<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-black opacity-50 fixed inset-0"></div>
    <div class="bg-white p-6 rounded-lg z-10 max-w-lg w-full">
      <h2 class="text-xl font-semibold mb-4">{{ task.id ? 'Edit' : 'New' }} Task</h2>
      <form class="max-w-lg mx-auto p-4" @submit.prevent="handleTask">
        <div class="mb-4">
          <label for="title" class="block font-semibold mb-1">Title</label>
          <input type="text" v-model="title" name="title" required
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
        </div>
        <div class="mb-4">
          <label for="description" class="block font-semibold mb-1">Description</label>
          <textarea v-model="description" name="description" required rows="5"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div class="w-full mb-4">
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select v-model="category" name="category" required
            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="w-full mb-4">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select v-model="status" name="status" required :disabled="selectedStatus"
            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="flex justify-between">
          <button @click="closeModal"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold text-lg py-3 px-6 rounded-lg">
            Cancel
          </button>
          <button type="submit" name="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-3 px-6 rounded-lg">
            {{ task.id ? 'Edit' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['confirm', 'closeModal', 'task', 'selectedStatus'],
  data() {
    return {
      title: '',
      description: '',
      category: '',
      status: '',
      errors: null,
      busy: false,
    }
  },
  mounted() {
    if (this.task) {
      this.title = this.task.title;
      this.description = this.task.description;
      this.category = this.task.category;
      this.status = this.task.status ? this.task.status : this.selectedStatus;
    }
  },
  methods: {
    handleTask() {
      let taskData = {
        title: this.title,
        description: this.description,
        category: this.category,
        status: this.status,
      };

      if (this.task) {
        if (this.task.id) {
          taskData['id'] = this.task.id;
        }
      }
      this.confirm(taskData);
    },
  }
}
</script>