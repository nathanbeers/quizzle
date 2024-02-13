<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Test;
use App\Models\User;

class TestControllerAnswer extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function it_can_store_an_answer_successfully()
    {
        $user = User::factory()->create();
        $test = Test::factory()->create(['user_id' => $user->id]);

        $answerData = [
            'test_id' => $test->id,
            'answers' => json_encode(['Q1' => 'A1', 'Q2' => 'A2']),
            'email' => $this->faker->safeEmail,
            'name' => $this->faker->name,
        ];

        $response = $this->actingAs($user)->postJson(route('answers.store'), $answerData);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('answers', [
            'test_id' => $test->id,
            'email' => $answerData['email'],
            'name' => $answerData['name'],
        ]);
    }
}
