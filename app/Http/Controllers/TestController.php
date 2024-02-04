<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Test;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

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
            'tags' => 'required|json',
            'close_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $test = Test::create($request->all());
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
            'tags' => 'sometimes|required|json',
            'close_date' => 'nullable|date',
        ]);

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
}
