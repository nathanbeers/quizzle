<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'questions' => json_encode([$this->faker->sentence, $this->faker->sentence]),
            'user_id' => \App\Models\User::factory(), // Assuming you have a User model and its factory
            'tags' => json_encode([$this->faker->word, $this->faker->word]),
            'close_date' => $this->faker->date(),
        ];
    }
}
