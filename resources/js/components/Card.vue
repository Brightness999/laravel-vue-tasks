<template>
  <div class="bg-white shadow-md w-full rounded cursor-pointer mb-6">
    <div class="py-4 px-6">
      <div class="flex justify-between items-center">
        <div class="px-4 py-2 rounded-full inline-block" :class="{ 'bg-red-200': task.category === 'personal', 'bg-green-200': task.category === 'work', 'bg-yellow-200': task.category === 'other' }">
          {{ task.category.toUpperCase() }}
        </div>
        <DotsVerticalIcon @click="toggleDropdown" class="h-5 w-5" />
        <div v-if="dropdownOpen" class="absolute right-6 mt-32 bg-white border rounded shadow-md">
          <ul>
            <li class="hover:bg-gray-100 px-4 py-2" @click="openTaskModal">Edit</li>
            <li class="hover:bg-gray-100 px-4 py-2" @click="openConfirmModal">Delete</li>
          </ul>
        </div>
      </div>
      <Errors v-if="errors" :content="errors" @close="errors = null" />
      <div class="text-2xl font-bold py-4">{{ task.title }}</div>
      <div class="text-sm">{{ task.description }}</div>
    </div>
    <div class="py-4 px-6 border-t flex justify-between">
      <div class="flex-1 flex justify-start items-center">
        <div v-for="(_, i) in Array(Math.floor(Math.random() * 11)).slice(0, 4)" class="-ml-3">
          <template v-if="i === 3">
            <template v-if="Math.floor(Math.random() * 10) > 6">
              <img :src="getImgUrl(Math.floor(Math.random() * 10))" alt="User1" class="h-10 w-10 rounded-full" />
            </template>
            <template v-else>
              <span class="flex justify-center items-center h-10 w-10 border-2 border-blue-700 text-blue-700 bg-blue-100 rounded-full">+{{ Math.floor(Math.random() * 10) }}</span>
            </template>
          </template>
          <template v-else>
            <img :src="getImgUrl(Math.floor(Math.random() * 11))" alt="User1" class="h-10 w-10 rounded-full" />
          </template>
        </div>
      </div>
      <div class="flex items-center gap-2 text-gray-300">
        <div class="flex items-center gap-1">
          <EyeIcon class="h-5 w-5" />{{ Math.floor(Math.random() * 11) }}
        </div>
        <div class="flex items-center gap-1">
          <ChatIcon class="h-5 w-5" />{{ Math.floor(Math.random() * 11) }}
        </div>
        <div class="flex items-center gap-1">
          <PaperClipIcon class="h-5 w-5" />{{ Math.floor(Math.random() * 11) }}
        </div>
      </div>
    </div>
    <div v-if="isTaskModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <TaskModal v :confirm="updateTask" :closeModal="closeTaskModal" :task="task" />
    </div>
    <div v-if="isConfirmModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <ConfirmModal :confirm="deleteTask" :closeModal="closeConfirmModal" :task="task" :message="'Are you sure to delete this task?'" />
    </div>
  </div>
</template>

<script>
import { ChatIcon, DotsVerticalIcon, EyeIcon, PaperClipIcon } from '@heroicons/vue/outline';
import TaskModal from './TaskModal';
import ConfirmModal from './ConfirmModal';
import Errors from './Errors';

export default {
  name: 'Card',
  props: {
    task: Object,
  },
  data() {
    return {
      dropdownOpen: false,
      isTaskModalOpen: false,
      isConfirmModalOpen: false,
      busy: false,
      errors: null,
    }
  },
  components: { EyeIcon, ChatIcon, PaperClipIcon, DotsVerticalIcon, TaskModal, ConfirmModal, Errors },
  methods: {
    getImgUrl(sig) {
      return `https://source.unsplash.com/random/200x200?sig=${sig}`;
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    openTaskModal() {
      this.isTaskModalOpen = true;
      this.dropdownOpen = false;
    },
    closeTaskModal() {
      this.isTaskModalOpen = false;
    },
    openConfirmModal() {
      this.isConfirmModalOpen = true;
      this.dropdownOpen = false;
    },
    closeConfirmModal() {
      this.isConfirmModalOpen = false;
    },
    async updateTask(taskData) {
      this.busy = true;
      this.errors = null
      try {
        await this.$store.dispatch('updateTask', taskData)
        this.closeTaskModal();
      }
      catch (e) {
        this.errors = e.data
      };
      this.busy = false;
    },
    async deleteTask() {
        this.busy = true;
        this.errors = null
        try {
            if (this.task.id) {
                await this.$store.dispatch('deleteTask', this.task.id)
                this.closeConfirmModal();
            }
        }
        catch (e) {
            this.errors = e.data
        };
        this.busy = false;
    },
  }
};
</script>