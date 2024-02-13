<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;
use App\Models\Test;
use App\Models\User;

class TestControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_index_returns_all_tests()
    {
        $user = User::factory()->create();
        $tests = Test::factory()->count(1)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/tests');

        $response->assertStatus(200)
                 ->assertJson($tests->toArray());
    }

    /** @test */
    public function user_can_retrieve_only_their_own_tests()
    {
        // Create two users
        $userOne = User::factory()->create();
        $userTwo = User::factory()->create();

        // Create tests associated with each user
        $userOneTests = Test::factory()->count(2)->create(['user_id' => $userOne->id]);
        $userTwoTests = Test::factory()->count(3)->create(['user_id' => $userTwo->id]);

        // Authenticate as userOne
        $response = $this->actingAs($userOne, 'sanctum')->getJson('/api/user/tests');

        // Assert the response status is 200 OK
        $response->assertStatus(200);

        // Assert the response contains only userOne's tests
        $response->assertJsonCount(2); // Assert the number of tests returned matches userOne's tests count
        $userOneTests->each(function ($test) use ($response) {
            $response->assertJsonFragment([
                'id' => $test->id,
                'title' => $test->title,
            ]);
        });

        // Assert the response does not contain userTwo's tests
        $userTwoTests->each(function ($test) use ($response) {
            $response->assertJsonMissing([
                'id' => $test->id,
                'title' => $test->title,
            ]);
        });
    }


    public function test_store_creates_a_new_test()
    {
        $user = User::factory()->create();
        $tags = ['tag1', 'tag2'];
        $validQuestions = json_encode([
            [
                "question_id" => "q1",
                "title" => "Sample Question",
                "description" => "Sample Description",
                "autoGrade" => "true",
                "choices" => [
                    ["id" => "c1", "text" => "Choice 1"],
                    ["id" => "c2", "text" => "Choice 2"]
                ],
                "trueFalseChoices" => [
                    ["id" => "tf1", "text" => "True"],
                    ["id" => "tf2", "text" => "False"]
                ],
                "saved" => true,
                "type" => "Multiple Choice",
                "answer" => "c1"
            ]
        ]);

        $testData = [
            'title' => 'Assumenda nesciunt rerum necessitatibus commodi harum sunt aut.',
            'description' => 'Enim nemo magnam atque sapiente. Delectus explicabo deleniti in aliquid odit quisquam culpa.',
            'questions' => $validQuestions,
            'user_id' => $user->id,
            'tags' => json_encode($tags),
            'close_date' => now()->toDateString(),
            'password' => 'secret',
            'hasPassword' => true,
        ];

        // Act: Make a POST request to the store route
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tests', $testData);

        // Assert: Check if the response status is 201 and certain keys exist
        $response->assertStatus(201)
                ->assertJson([
                    'title' => $testData['title'],
                    'description' => $testData['description'],
                    'user_id' => json_decode($testData['user_id'], true),
                ])
                ->assertJsonStructure([
                    'id', 'title', 'description', 'questions', 'user_id', 'hasPassword', 'tags', 'close_date', 'created_at', 'updated_at'
                ]);

        // Assert that tags are saved correctly
        foreach ($tags as $tag) {
            $this->assertDatabaseHas('tags', [
                'name' => $tag,
                'user_id' => $user->id
            ]);
        }

        // Assert: These 3 fields must exist in the database for a test to be created successfully
        $this->assertDatabaseHas('tests', [
            'title' => $testData['title'],
            'questions' => $testData['questions'],
            'user_id' => $testData['user_id'],
        ]);
    }

    public function test_store_rejects_invalid_questions_structure()
    {
        $user = User::factory()->create();
        $invalidQuestions = json_encode([
            [
                "question_id" => "q1",
                // Missing title, and autoGrade, choices, trueFalseChoices, type, and answer fields
            ]
        ]);

        $testData = [
            'title' => 'Invalid Questions Test',
            'description' => 'Test with invalid questions structure.',
            'questions' => $invalidQuestions,
            'user_id' => $user->id,
            'tags' => json_encode(['tag1', 'tag2']),
            'close_date' => now()->toDateString(),
            'password' => 'secret',
            'hasPassword' => 'true',
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tests', $testData);

        // Assert that the response has a 422 status and contains the expected error structure
        $response->assertStatus(422)
                ->assertJson([
                    'error' => 'Invalid questions structure',
                ])
                ->assertJsonStructure([
                    'error',
                    'messages'
                ]);
    }


    public function test_show_returns_a_specific_test()
    {
        $user = User::factory()->create();
        $test = Test::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/tests/{$test->id}");

        $response->assertStatus(200)
        ->assertJson($test->toArray());
    }

    public function test_update_modifies_an_existing_test()
    {
        $user = User::factory()->create();
        $test = Test::factory()->create();

        $user = User::factory()->create();
        $tags = ['tag1 updated', 'tag2 updated'];
        $validQuestions = json_encode([
            [
                "question_id" => "AAA",
                "title" => "Sample Question Updated",
                "description" => "Sample Description Updated",
                "autoGrade" => true,
                "choices" => [
                    ["id" => "c1", "text" => "Choice 1"],
                    ["id" => "c2", "text" => "Choice 2"]
                ],
                "trueFalseChoices" => [
                    ["id" => "tf1", "text" => "True"],
                    ["id" => "tf2", "text" => "False"]
                ],
                "saved" => true,
                "type" => "True False",
                "answer" => "True"
            ]
        ]);

        $updateData = [
            'title' => 'Assumenda nesciunt rerum necessitatibus commodi harum sunt aut.',
            'description' => 'Enim nemo magnam atque sapiente. Delectus explicabo deleniti in aliquid odit quisquam culpa.',
            'questions' => $validQuestions,
            'user_id' => $user->id,
            'tags' => json_encode($tags),
            'close_date' => now()->toDateString(),
            'password' => 'secret',
            'hasPassword' => true,
        ];

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/tests/{$test->id}", $updateData);

        $response->assertStatus(200)
        ->assertJsonStructure([
            'id', 'title', 'description', 'questions', 'user_id', 'hasPassword', 'tags', 'close_date', 'created_at', 'updated_at'
        ]);
    }

    public function test_destroy_deletes_a_test()
    {
        $user = User::factory()->create();
        $test = Test::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/tests/{$test->id}");

        $response->assertStatus(204);
    }
}
