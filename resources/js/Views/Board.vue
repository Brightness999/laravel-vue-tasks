<template>
  <div class="container m-auto flex justify-between min-h-screen">
    <Errors v-if="errors" :content="errors" @close="errors = null" />
    <div class="inline-block">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center gap-4">
          <div class="flex text-lg gap-1"><span class="text-red-400 text-4xl -mt-2">•</span> To Do</div>
          <div class="px-4 py-1 rounded-full bg-white">{{ todoList.length }}</div>
        </div>
        <DotsVerticalIcon class="h-5 w-5 cursor-pointer" />
      </div>
      <button @click="openTaskModal('todo')"
        class="text-blue-600 bg-white font-semibold shadow text-lg py-4 w-full rounded flex justify-center gap-2">
        <PlusIcon class="h-5 w-5 ml-2 mt-1" />
        Add New Task
      </button>
      <container drag-class="card-ghost" drop-class="card-ghost-drop" :drop-placeholder="dropPlaceholderOptions"
        :get-child-payload="getTodoList" group-name="1" @drop="onDrop('todoList', $event)">
        <draggable v-for="(task, $index) in todoList" :key="$index">
          <Card :task="task" />
        </draggable>
      </container>
    </div>
    <div class="inline-block">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center gap-4">
          <div class="flex text-lg gap-1"><span class="text-blue-500 text-4xl -mt-2">•</span> In Progress</div>
          <div class="px-4 py-1 rounded-full bg-white">{{ inprogressList.length }}</div>
        </div>
        <DotsVerticalIcon class="h-5 w-5 cursor-pointer" />
      </div>
      <button @click="openTaskModal('inprogress')"
        class="text-blue-600 bg-white font-semibold shadow text-lg py-4 w-full rounded flex justify-center gap-2">
        <PlusIcon class="h-5 w-5 ml-2 mt-1" />
        Add New Task
      </button>
      <container drag-class="card-ghost" drop-class="card-ghost-drop" :drop-placeholder="dropPlaceholderOptions"
        :get-child-payload="getInProgressList" group-name="1" @drop="onDrop('inprogressList', $event)">
        <draggable v-for="(task, $index) in inprogressList" :key="$index">
          <Card :task="task" />
        </draggable>
      </container>
    </div>
    <div class="inline-block">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center gap-4">
          <div class="flex text-lg gap-1"><span class="text-green-400 text-4xl -mt-2">•</span> Done</div>
          <div class="px-4 py-1 rounded-full bg-white">{{ doneList.length }}</div>
        </div>
        <DotsVerticalIcon class="h-5 w-5 cursor-pointer" />
      </div>
      <button @click="openTaskModal('done')"
        class="text-blue-600 bg-white font-semibold shadow text-lg py-4 w-full rounded flex justify-center gap-2">
        <PlusIcon class="h-5 w-5 ml-2 mt-1" />
        Add New Task
      </button>
      <container drag-class="card-ghost" drop-class="card-ghost-drop" :drop-placeholder="dropPlaceholderOptions"
        :get-child-payload="getDoneList" group-name="1" @drop="onDrop('doneList', $event)">
        <draggable v-for="(task, $index) in doneList" :key="$index">
          <Card :task="task" />
        </draggable>
      </container>
    </div>
    <div v-if="isTaskModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <TaskModal :confirm="handleTask" :closeModal="closeTaskModal" :task="selectedTask"
        :selectedStatus="selectedStatus" />
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { DotsVerticalIcon, PlusIcon } from '@heroicons/vue/outline';
import Card from '../components/Card';
import TaskModal from '../components/TaskModal';
import Errors from '../components/Errors';

export default {
  name: 'CardList',
  components: {
    Card,
    Container,
    Draggable,
    PlusIcon,
    TaskModal,
    Errors,
    DotsVerticalIcon
  },
  data() {
    return {
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: false,
      },
      isTaskModalOpen: false,
      selectedTask: {},
      busy: false,
      errors: null,
      selectedStatus: '',
    };
  },
  mounted() {
    this.getTasks();
  },
  computed: {
    todoList() {
      const tasks = this.$store.getters.tasks;
      return tasks.length ? tasks.filter(task => task.status === 'todo') : [];
    },
    inprogressList() {
      const tasks = this.$store.getters.tasks;
      return tasks.length ? tasks.filter(task => task.status === 'inprogress') : [];
    },
    doneList() {
      const tasks = this.$store.getters.tasks;
      return tasks.length ? tasks.filter(task => task.status === 'done') : [];
    },
  },
  methods: {
    getTasks() {
      this.$store.dispatch('getBoardTasks');
    },
    async onDrop(collection, dropResult) {
      const tasks = this.$store.getters.tasks;
      if (dropResult.addedIndex != null) {
        const newTasks = tasks.map(task => {
          if (task.id === dropResult.payload.id && collection === 'todoList') {
            task.status = 'todo'; return task;
          } else if (task.id === dropResult.payload.id && collection === 'inprogressList') {
            task.status = 'inprogress'; return task;
          } else if (task.id === dropResult.payload.id && collection === 'doneList') {
            task.status = 'done'; return task;
          } else {
            return task;
          }
        });
        await this.$store.commit('setTasks', newTasks);
        const updatedTask = { ...dropResult.payload, status: collection === 'todoList' ? 'todo' : collection === 'inprogressList' ? 'inprogress' : collection === 'doneList' ? 'done' : '' };
        this.$store.dispatch('updateTask', updatedTask);
      }
    },
    getTodoList(index) {
      return this.todoList[index];
    },
    getInProgressList(index) {
      return this.inprogressList[index];
    },
    getDoneList(index) {
      return this.doneList[index];
    },
    openTaskModal(selectedStatus) {
      this.isTaskModalOpen = true;
      this.selectedStatus = selectedStatus;
    },
    closeTaskModal() {
      this.isTaskModalOpen = false;
    },
    async handleTask(taskData) {
      this.busy = true;
      this.errors = null
      try {
        await this.$store.dispatch(taskData.id ? 'updateTask' : 'createTask', taskData)
        this.closeTaskModal();
      }
      catch (e) {
        this.errors = e.data
      };
      this.busy = false;
    },
  },
};
</script>

<style scoped>
.smooth-dnd-container {
  width: 20vw;
  height: 100%;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.card-ghost {
  transition: transform 0.18s ease;
}

.card-ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}

@media screen and (max-width: 1024px) {
  .smooth-dnd-container {
    width: 25vw;
  }
}

@media screen and (max-width: 769px) {
  .card-list-container {
    display: block;
  }

  .smooth-dnd-container {
    width: auto;
    max-width: 100%;
  }
}
</style>
