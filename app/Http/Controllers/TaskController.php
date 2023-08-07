<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Mockery\Undefined;

class TaskController extends Controller
{
    //

    public function __invoke(Request $request)
    {
        if (auth()->check()) {
            $pageNumber = request('pageNumber');
            $perPage = request('perPage');
            $status = request('status');
            $category = request('category');
            $searchKey = request('searchKey');

            $tasks = Task::where('category', $category ? '=' : '!=',  $category)
                ->where('status', $status ? '=' : '!=', $status)
                ->where(function ($query) use ($searchKey) {
                    $query->where('title', 'LIKE', '%' . $searchKey . '%')
                        ->orWhere('description', 'LIKE', '%' . $searchKey . '%');
                })
                ->skip(($pageNumber - 1) * $perPage)
                ->take($perPage)
                ->get();
            $totalSize = ceil(Task::where('category', $category ? '=' : '!=',  $category)
                ->where('status', $status ? '=' : '!=', $status)
                ->where(function ($query) use ($searchKey) {
                    $query->where('title', 'LIKE', '%' . $searchKey . '%')
                        ->orWhere('description', 'LIKE', '%' . $searchKey . '%');
                })
                ->count() / $perPage);

            return response()->json([
                'tasks' => $tasks,
                'totalSize' => $totalSize,
            ]);
        } else {
            return response()->json([
                'data' => 'Unauthenticated.'
            ], 401);
        }
    }

    public function boardTasks(Request $request)
    {
        if (auth()->check()) {
            $tasks = Task::all();
            return response()->json($tasks);
        } else {
            return response()->json([
                'data' => 'Unauthenticated.'
            ], 401);
        }
    }

    public function create(Request $request)
    {
        if (auth()->check()) {
            if (!request('title')) {
                return response()->json([
                    'data' => 'Title cannot be null.'
                ], 500);
            }
            if (!request('description')) {
                return response()->json([
                    'data' => 'Description cannot be null.'
                ], 500);
            }
            if (!request('status')) {
                return response()->json([
                    'data' => 'Status cannot be null.'
                ], 500);
            }
            if (!request('category')) {
                return response()->json([
                    'data' => 'Category cannot be null.'
                ], 500);
            }

            $task = Task::create([
                'title' => request('title'),
                'description' => request('description'),
                'category' => request('category'),
                'status' => request('status'),
            ]);

            return response()->json($task);
        } else {
            return response()->json([
                'data' => 'Unauthenticated.'
            ], 401);
        }
    }

    public function update(Request $request)
    {
        if (auth()->check()) {
            $task = Task::find($request->route('id'));
            $task->update([
                'title' => request('title'),
                'description' => request('description'),
                'category' => request('category'),
                'status' => request('status'),
            ]);

            return response()->json($task);
        } else {
            return response()->json([
                'data' => 'Unauthenticated.'
            ], 401);
        }
    }
    
    public function delete(Request $request)
    {
        if (auth()->check()) {
            $task = Task::find($request->route('id'));
            $task->delete();
            return response()->json($task);
        } else {
            return response()->json([
                'data' => 'Unauthenticated.'
            ], 401);
        }
    }
}
