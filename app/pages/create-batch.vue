<template>
  <div class="batch-container">
    <h1>Create Batch</h1>
    <form @submit.prevent="submitBatch">
    
      <div class="form-group">
        <label for="batchNumber">Batch Number</label>
        <input
          id="batchNumber"
          v-model.trim="batchNumber"
          type="text"
          placeholder="e.g., FSD-2024-01"
          required
        />
      </div>

    
      <div class="form-group">
        <label for="startDate">Start Date</label>
        <input
          id="startDate"
          v-model="startDate"
          type="date"
          required
        />
      </div>

   
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading">Submitting...</span>
        <span v-else>Submit</span>
      </button>

  
      <p v-if="successMessage" class="success-message">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">

import type { BatchApiResponse } from '../interfaces/batch-response';

definePageMeta({
  path: "/createBatch",
  layout: 'batch'
});


const batchNumber = ref<string>('');
const startDate = ref<string>('');
const isLoading = ref<boolean>(false);
const successMessage = ref<string>('');
const errorMessage = ref<string>('');


function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


onMounted(() => {
  startDate.value = getTodayDateString();
});


async function submitBatch() {
  successMessage.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {

    await $fetch<BatchApiResponse>('/api/batches', {
      method: 'POST',
      body: {
        batch_number: batchNumber.value,
        start_date: startDate.value,
      },
    });

    successMessage.value = 'Batch created successfully!';
    batchNumber.value = '';
    startDate.value = getTodayDateString();

  } catch (error: any) {
    errorMessage.value = error.data?.message || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Adding some basic styles to make it look good */
.batch-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
}

button:disabled {
  background-color: #a0c3e6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  color: #155724;
  background-color: #d4edda;
  border-radius: 4px;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  color: #721c24;
  background-color: #f8d7da;
  border-radius: 4px;
}
</style>