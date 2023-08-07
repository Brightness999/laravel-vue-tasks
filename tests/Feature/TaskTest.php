<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Support\Facades\Auth;

class TaskTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use WithoutMiddleware;

    /** @test */
    public function it_can_create_a_task()
    {
        Auth::shouldReceive('check')->andReturn(true);
        Auth::shouldReceive('user')->andReturn(User::factory()->create());

        $taskData = [
            'category' => 'personal',
            'status' => 'todo',
            'title' => 'New Title',
            'description' => 'New Descriptioin',
        ];

        $updatedTask = $this->post(route('createTask'), $taskData);
        $updatedTask->assertStatus(200);

        $this->assertEquals($updatedTask['category'], $taskData['category']);
        $this->assertEquals($updatedTask['status'], $taskData['status']);
        $this->assertEquals($updatedTask['title'], $taskData['title']);
        $this->assertEquals($updatedTask['description'], $taskData['description']);
    }
    
    /** @test */
    public function it_cannot_create_a_task_when_it_is_not_valid()
    {
        Auth::shouldReceive('check')->andReturn(true);
        Auth::shouldReceive('user')->andReturn(User::factory()->create());
    
        $taskData = [];
        $updatedTask = $this->post(route('createTask'), $taskData);
        $updatedTask->assertStatus(500);
        $updatedTask->assertJson([
            'data' => 'Title cannot be null.'
        ]);

        $taskData = [
            'title' => 'New Title'
        ];
        $updatedTask = $this->post(route('createTask'), $taskData);
        $updatedTask->assertStatus(500);
        $updatedTask->assertJson([
            'data' => 'Description cannot be null.'
        ]);

        $taskData = [
            'title' => 'New Title',
            'description' => 'New Description',
        ];
        $updatedTask = $this->post(route('createTask'), $taskData);
        $updatedTask->assertStatus(500);
        $updatedTask->assertJson([
            'data' => 'Status cannot be null.'
        ]);

        $taskData = [
            'title' => 'New Title',
            'description' => 'New Description',
            'status' => 'todo',
        ];
        $updatedTask = $this->post(route('createTask'), $taskData);
        $updatedTask->assertStatus(500);
        $updatedTask->assertJson([
            'data' => 'Category cannot be null.'
        ]);
    }

    /** @test */
    public function it_can_update_a_task_in_tasks_table()
    {
        Auth::shouldReceive('check')->andReturn(true);
        Auth::shouldReceive('user')->andReturn(User::factory()->create());

        $task = Task::factory()->create([
            'category' => 'personal',
            'status' => 'inprogress',
            'title' => 'before updated title',
            'description' => 'before updated description',
        ]);
        
        $taskData = [
            'category' => 'personal',
            'status' => 'done',
            'title' => 'updated title',
            'description' => 'updated description',
        ];

        $updatedTask = $this->put(route('updateTask', ['id' => $task->id]), $taskData);
        $updatedTask->assertStatus(200);

        $this->assertEquals($updatedTask['category'], $taskData['category']);
        $this->assertEquals($updatedTask['status'], $taskData['status']);
        $this->assertEquals($updatedTask['title'], $taskData['title']);
        $this->assertEquals($updatedTask['description'], $taskData['description']);
    }

    /** @test */
    public function it_can_delete_a_task()
    {
        Auth::shouldReceive('check')->andReturn(true);
        Auth::shouldReceive('user')->andReturn(User::factory()->create());

        $task = Task::factory()->create();

        $response = $this->delete("/api/task/{$task->id}");

        $response->assertStatus(200);

        $this->assertDeleted('tasks', ['id' => $task->id]);
    }
}
