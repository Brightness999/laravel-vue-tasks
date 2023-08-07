<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-black opacity-50 fixed inset-0"></div>
    <div class="bg-white p-4 rounded shadow-md w-auto max-w-sm z-10">
      <h2 class="text-xl font-semibold mb-4">Confirm</h2>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end">
        <button class="px-4 py-2 text-white bg-red-500 rounded" @click="closeModal">Cancel</button>
        <button class="px-4 py-2 ml-2 text-white bg-green-500 rounded" @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['closeModal', 'confirm', 'task', 'message'],
}
</script>