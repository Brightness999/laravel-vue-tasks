<template>
    <div class="max-w-screen-lg mx-auto text-gray-900">
        <div class="flex justify-center">
            <div class="flex-1">
                <div class="flex justify-end py-4">
                    <button @click="openModal" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg py-2 px-4 rounded flex gap-2">
                        <PlusIcon class="h-5 w-5 ml-2 mt-1" />
                        Add New Task
                    </button>
                </div>
                <div class="border w-auto">
                    <div class="border p-4 font-semibold ">Tasks List</div>
                    <div class="p-4 bg-white">
                        <Errors v-if="errors" :content="errors" @close="errors = null" />
                        <div class="grid md:flex justify-between gap-4">
                            <div class="flex items-center border rounded-md shadow-md">
                                <input
                                    type="text"
                                    class="px-4 py-2 w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                    placeholder="Search..."
                                    @change="changeSearchKey"
                                >
                                <button @click="handleSearch" class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                                    Search
                                </button>
                            </div>
                            <div class="  xl flex gap-4">
                                <select v-model="category" name="category" @change="selectCategory" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
                                    <option value=""></option>
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                                <select v-model="status" name="status" @change="selectStatus" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
                                    <option value=""></option>
                                    <option value="todo">To Do</option>
                                    <option value="inprogress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                                <select v-model="perPage" name="perPage" @change="changePerPage" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300">
                                    <option value="5">5 / page</option>
                                    <option value="10">10 / page</option>
                                    <option value="20">20 /page</option>
                                    <option value="50">50 / page</option>
                                    <option value="100">100 / page</option>
                                </select>
                            </div>
                        </div>
                        <table class="min-w-full divide-y divide-gray-200 mt-3">
                            <thead class="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="task in tasks" :key="task.id" class="grid md:table-row">
                                    <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-wrap md:table-cell"><span class="block font-bold md:hidden">Title:</span>{{ task.title }}</td>
                                    <td class="px-6 py-4 flex gap-2 flex-wrap md:table-cell"><span class="block font-bold md:hidden">Description:</span>{{ task.description }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-wrap md:table-cell"><span class="block font-bold md:hidden">Category:</span>{{ task.category.toUpperCase() }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-wrap md:table-cell"><span class="block font-bold md:hidden">Status:</span>{{ task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : task.status === 'done' ? 'Done' : '' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex gap-2">
                                            <button 
                                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                @click="openEditModal(task)">
                                                Edit
                                            </button>
                                            <button 
                                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                @click="openConfirmModal(task)">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex items-center justify-center mt-3" :class="{'hidden' : totalSize === 1}">
                            <a href="#" name="prevPage" @click="previousPage" class="px-3 py-2 border"
                                :class="[(totalSize > 0 && pageNumber > 1) ? 'text-blue-500' : 'text-gray-400 cursor-default']">
                                Prev
                            </a>
                            <a href="#" class="px-3 py-2 border hover:bg-blue-500 hover:text-white"
                                :class="{ 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber === 1 }"
                                @click="handleClickPage(1)">
                                1
                            </a>
                            <a href="#" class="px-3 py-2 border"
                                :class="{ 'hidden': totalSize < 3, 'hover:bg-blue-500 hover:text-white': ((totalSize > 7 && pageNumber < 5) || totalSize < 8), 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber === 2, 'cursor-default': totalSize > 7 && pageNumber > 4 }"
                                @click="((totalSize > 7 && pageNumber < 5) || totalSize < 8)  && handleClickPage(2)">
                                {{ totalSize > 7 ? pageNumber < 5 ? 2 : '···' : 2 }}
                            </a>
                            <a href="#" class="px-3 py-2 border hover:bg-blue-500 hover:text-white"
                                :class="{ 'hidden': totalSize < 4, 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber === (totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize -4 : pageNumber > 4 ? pageNumber - 1 : 3 : 3) }"
                                @click="handleClickPage(totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 4 : pageNumber > 4 ? pageNumber - 1 : 3 : 3)">
                                {{ totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 4 : pageNumber > 4 ? pageNumber - 1 : 3 : 3 }}
                            </a>
                            <a href="#" class="px-3 py-2 border hover:bg-blue-500 hover:text-white"
                                :class="{ 'hidden': totalSize < 5, 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber ===  ( totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 3 : pageNumber > 4 ? pageNumber : 4 : 4) }"
                                @click="handleClickPage(totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 3 : pageNumber > 4 ? pageNumber : 4 : 4)">
                                {{ totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 3 : pageNumber > 4 ? pageNumber : 4 : 4 }}
                            </a>
                            <a href="#" class="px-3 py-2 border hover:bg-blue-500 hover:text-white"
                                :class="{ 'hidden': totalSize < 6, 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber ===  (totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 2 : pageNumber > 4 ? pageNumber + 1 : 5 : 5) }"
                                @click="handleClickPage(totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 2 : pageNumber > 4 ? pageNumber + 1 : 5 : 5)">
                                {{ totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 2 : pageNumber > 4 ? pageNumber + 1 : 5 : 5 }}
                            </a>
                            <a href="#" class="px-3 py-2 border"
                                :class="{ 'hidden': totalSize < 7, 'hover:bg-blue-500 hover:text-white': ((totalSize > 7 && pageNumber > totalSize - 4) || totalSize < 8), 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber === totalSize - 1, 'cursor-default': totalSize > 7 && pageNumber < totalSize - 3 }"
                                @click="totalSize > 7 ? pageNumber > totalSize - 4 ? handleClickPage(totalSize - 1) : '' : handleClickPage(6)">
                                {{ totalSize > 7 ? pageNumber > totalSize - 4 ? totalSize - 1 : '···' : 6 }}
                            </a>
                            <a href="#" class="px-3 py-2 border hover:bg-blue-500 hover:text-white"
                                :class="{ 'hidden': totalSize < 2, 'bg-blue-500 hover:bg-blue-700 text-white': pageNumber === totalSize }"
                                @click="handleClickPage(totalSize)">
                                {{ totalSize }}
                            </a>
                            <a href="#" name="nextPage" @click="nextPage" class="px-3 py-2 border"
                                :class="[pageNumber < totalSize ? 'text-blue-500' : 'text-gray-400 cursor-default']">Next</a>
                        </div>
                    </div>
                </div>
                <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
                    <TaskModal :confirm="handleTask" :closeModal="closeModal" :task="selectedTask" />
                </div>
                <div v-if="isConfirmModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
                    <ConfirmModal :confirm="deleteTask" :closeModal="closeConfirmModal" :task="selectedTask" :message="'Are you sure to delete this task?'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/outline';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';
import Errors from '../components/Errors';

export default {
    data() {
        return {
            isModalOpen: false,
            selectedTask: {},
            isConfirmModalOpen: false,
            busy: false,
            errors: null,
            pageNumber: 1,
            perPage: 10,
            category: '',
            status: '',
            searchKey: '',
        };
    },
    mounted() {
        this.getTasks();
    },
    computed: {
        tasks() {
            return this.$store.getters.tasks;
        },
        totalSize() {
            return this.$store.getters.totalSize;
        }
    },
    methods: {
        getTasks() {
            const {pageNumber, perPage, category, status, searchKey} = this;
            this.$store.dispatch('getTasks', { pageNumber, perPage, category, status, searchKey });
        },
        previousPage() {
            if (this.pageNumber - 1 > 0) {
                this.pageNumber = this.pageNumber - 1;
                this.getTasks();
            }
        },
        nextPage() {
            if (this.pageNumber + 1 <= this.totalSize) {
                this.pageNumber = this.pageNumber + 1;
                this.getTasks();
            }
        },
        handleClickPage(pageNumber) {
            this.pageNumber = pageNumber;
            this.getTasks();
        },
        changePerPage(event) {
            this.perPage = event.target.value;
            this.getTasks();
        },
        selectStatus(event) {
            this.status = event.target.value;
            this.getTasks();
        },
        selectCategory(event) {
            this.category = event.target.value;
            this.getTasks();
        },
        handleSearch() {
            this.getTasks();
        },
        changeSearchKey(event) {
            this.searchKey = event.target.value;
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.selectedTask = {};
            this.isModalOpen = false;
        },
        openEditModal(task) {
            this.selectedTask = task;
            this.isModalOpen = true;
        },
        openConfirmModal(task) {
            this.selectedTask = task;
            this.isConfirmModalOpen = true;
        },
        closeConfirmModal() {
            this.selectedTask = {};
            this.isConfirmModalOpen = false;
        },
        async deleteTask() {
            this.busy = true;
            this.errors = null
            try {
                if (this.selectedTask.id) {
                    await this.$store.dispatch('deleteTask', this.selectedTask.id)
                    this.getTasks();
                    this.closeConfirmModal();
                }
            }
            catch (e) {
                this.errors = e.data
            };
            this.busy = false;
        },
        async handleTask(taskData) {
            this.busy = true;
            this.errors = null
            try {
                await this.$store.dispatch(taskData.id ? 'updateTask' : 'createTask', taskData)
                !taskData.id && this.getTasks();
                this.closeModal();
            }
            catch (e) {
                this.errors = e.data
            };
            this.busy = false;
        },
    },
    components: { PlusIcon, TaskModal, ConfirmModal, Errors }
}
</script>