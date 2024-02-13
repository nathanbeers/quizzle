<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Test>
 */
class TestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
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
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'questions' => json_encode($validQuestions),
            'user_id' => \App\Models\User::factory(),
            'tags' => json_encode([$this->faker->word, $this->faker->word]),
            'close_date' => $this->faker->date(),
            'password' => Hash::make('secret'),
            'hasPassword' => true,
        ];
    }
}

