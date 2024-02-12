<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Test;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class TestController extends Controller
{
    public function index()
    {
        try {
            $tests = Test::all();
            return response()->json($tests);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to retrieve tests', 'message' => $e->getMessage()], 500);
        }
    }

    public function indexForUser()
    {
        $user = Auth::user();
        $tests = $user->tests()->get();

        return response()->json($tests);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|json',
            'user_id' => 'required|integer',
            'tags' => 'nullable|json',
            'close_date' => 'date',
            'password' => 'nullable|string',
        ]);

        // validate questions json
        $questions = json_decode($request->input('questions'), true);
        if (is_null($questions)) {
            return response()->json(['error' => 'Invalid JSON for questions'], 422);
        }

        $questionValidationErrors = Test::validateQuestions($questions);
        if (!empty($questionValidationErrors)) {
            return response()->json(['error' => 'Invalid questions structure', 'messages' => $questionValidationErrors], 422);
        }

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->all();

        // Check if a test password was provided and hash it
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        try {
            // save test
            $test = Test::create($data);
            // save unqiue tags for user
            $user = Auth::user();
            $tags = json_decode($request->tags);
            $tagIds = Test::saveUserTags($tags, $user);

            return response()->json($test, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create test', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $test = Test::findOrFail($id);
            return response()->json($test);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Test not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching test', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'questions' => 'sometimes|required|json',
            'user_id' => 'sometimes|required|integer',
            'tags' => 'sometimes|nullable|json',
            'close_date' => 'nullable|date',
        ]);

        // validate questions json
        $questions = json_decode($request->input('questions'), true);
        if (is_null($questions)) {
            return response()->json(['error' => 'Invalid JSON for questions'], 422);
        }

        $questionValidationErrors = Test::validateQuestions($questions);
        if (!empty($questionValidationErrors)) {
            return response()->json(['error' => 'Invalid questions structure', 'messages' => $questionValidationErrors], 422);
        }

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $test = Test::findOrFail($id);
            $test->update($request->all());
            return response()->json($test);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Test not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update test', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $test = Test::findOrFail($id);
            $test->delete();
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Test not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete test', 'message' => $e->getMessage()], 500);
        }
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'test_id' => 'required|exists:tests,id',
            'password' => 'required|string',
        ]);

        $test = Test::find($request->test_id);

        if ($test && Hash::check($request->password, $test->password)) {
            return response()->json(['message' => 'Password verified successfully.'], 200);
        }

        return response()->json(['error' => 'Password verification failed.'], 401);
    }

}
