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
