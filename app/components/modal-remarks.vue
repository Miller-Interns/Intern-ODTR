<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  initialValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);
const remarksText = ref(props.initialValue);

function submitRemarks() {
  emit("submit", remarksText.value.trim());
  emit("close");
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75"
    @click="$emit('close')"
  >
    <div
      class="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      @click.stop
    >
      <div class="mb-4 flex items-start justify-between">
        <h3 class="text-xl font-semibold text-gray-900">Add Remarks</h3>

        <!-- <button
          class="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
          @click="$emit('close')"
        > -->
        <!-- <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span> -->
        <!-- </button> -->
      </div>

      <textarea
        v-model="remarksText"
        rows="5"
        class="w-full rounded-md border-gray-300 p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Type your remarks here..."
      ></textarea>

      <div class="mt-6 flex justify-end gap-x-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          @click="submitRemarks"
        >
          Save Remarks
        </button>
      </div>
    </div>
  </div>
</template>
