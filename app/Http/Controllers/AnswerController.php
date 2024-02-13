<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Answer;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class AnswerController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'test_id' => 'required|exists:tests,id',
            'questions' => 'required|json',
            'email' => [
                'required',
                'email',
                Rule::unique('answers')->where(function ($query) use ($request) {
                    return $query->where('test_id', $request->test_id)
                                 ->where('email', $request->email);
                }),
            ],
            'name' => 'required|string',
        ], [
            'email.unique' => 'You have already submitted answers for this test.',
        ]);

        Log::info('AnswerController@store', $request->all());

        $answer = new Answer($request->all());
        $answer->save();

        return response()->json($answer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
