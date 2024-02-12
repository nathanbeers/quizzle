<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Test extends Model
{
    use HasFactory;

    protected $table = 'tests';

    protected $fillable = [
        'title',
        'description',
        'questions',
        'user_id',
        'tags',
        'close_date',
    ];

    protected $casts = [
        'questions' => 'array',
        'tags' => 'array',
        'close_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function saveUserTags($tags, $user)
    {
        $tagIds = [];
        $userTags = $user->tags()->get();
        foreach ($userTags as $userTag) {
            if (in_array($userTag->name, $tags)) {
                $tagIds[] = $userTag->id;
            }
        }
        $newTags = array_diff($tags, $userTags->pluck('name')->toArray());
        foreach ($newTags as $newTag) {
            $tag = $user->tags()->create(['name' => $newTag]);
            $tagIds[] = $tag->id;
        }
        return $tagIds;
    }

    public static function validateQuestions(array $questions): array
    {
        $errors = [];

        foreach ($questions as $question) {
            // Validate base question structure
            if (!isset($question['question_id'], $question['title'], $question['autoGrade'], $question['choices'], $question['trueFalseChoices'], $question['saved'])) {
                $errors[] = 'Missing base question form fields.';
                continue;
            }

            // Validate 'Multiple Choice' or 'True False' question type
            if (isset($question['type']) && in_array($question['type'], ['Multiple Choice', 'True False'])) {
                if (!isset($question['answer']) || !is_string($question['answer'])) {
                    $errors[] = "The answer field is required for {$question['type']} questions.";
                }

                // Validate choices structure
                foreach ($question['choices'] as $choice) {
                    if (!isset($choice['id'], $choice['text'])) {
                        $errors[] = 'Missing choice fields for multiple choice question.';
                        break;
                    }
                }

                // Validate trueFalseChoices structure
                foreach ($question['trueFalseChoices'] as $choice) {
                    if (!isset($choice['id']) || !in_array($choice['text'], ['True', 'False'])) {
                        $errors[] = 'Invalid trueFalseChoices fields.';
                        break;
                    }
                }
            } elseif (isset($question['type']) && in_array($question['type'], ['Short Answer', 'Essay'])) {
                // Optional answer validation for 'Short Answer' or 'Essay'
                if (isset($question['answer']) && !is_string($question['answer'])) {
                    $errors[] = "The answer field must be a string for {$question['type']} questions.";
                }
            } else {
                $errors[] = 'Invalid question type.';
            }
        }

        return $errors;
    }
}
