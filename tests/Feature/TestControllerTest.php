<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Test;
use App\Models\User;

class TestControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_index_returns_all_tests()
    {
        $user = User::factory()->create();
        $tests = Test::factory()->count(3)->create();

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
        $testData = [
            'title' => 'Assumenda nesciunt rerum necessitatibus commodi harum sunt aut.',
            'description' => 'Enim nemo magnam atque sapiente. Delectus explicabo deleniti in aliquid odit quisquam culpa.',
            'questions' => json_encode(['Q1', 'Q2']),
            'user_id' => $user->id,
            'tags' => json_encode(['tag1', 'tag2']),
            'close_date' => now()->toDateString(),
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
                    'id', 'title', 'description', 'questions', 'user_id', 'tags', 'close_date', 'created_at', 'updated_at'
                ]);

        // Assert: Check if the response contains the expected data for the JSON data
        $decodedResponse = json_decode($response->getContent(), true);

        // Assert the decoded structure
        $this->assertEquals(['Q1', 'Q2'], json_decode($decodedResponse['questions'], true));
        $this->assertEquals(['tag1', 'tag2'], json_decode($decodedResponse['tags'], true));

        // Assert: These 3 fields must exist in the database for a test to be created successfully
        $this->assertDatabaseHas('tests', [
            'title' => $testData['title'],
            'questions' => $testData['questions'],
            'user_id' => $testData['user_id'],
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

        $updatedData = [
            'title' => 'Updated Title',
            'description' => 'Updated description',
        ];

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/tests/{$test->id}", $updatedData);

        $response->assertStatus(200)
        ->assertJson($updatedData);
    }

    public function test_destroy_deletes_a_test()
    {
        $user = User::factory()->create();
        $test = Test::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/tests/{$test->id}");

        $response->assertStatus(204);
    }
}
