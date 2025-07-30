<!-- <template>
  <div class="batch-container">
    <h1>Create Batch</h1>
    <form @submit.prevent="submitBatch">
    
      <div class="form-group">
        <label for="batchNumber">Batch Number</label>
        <input
          id="batchNumber"
          v-model.trim="batchNumber"
          type="text"
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

import { Status, type Batch} from '~/server/db/types'


definePageMeta({
  path: "/createBatch",

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
  
  const todayString = getTodayDateString();
  const statusToSet = startDate.value > todayString ? Status.INCOMING : Status.ONGOING;

  try {
    await $fetch<Batch>('/api/batches/Post-batch', {
      method: 'POST',
      body: {
        batch_number: batchNumber.value,
        start_date: startDate.value,
        status: statusToSet
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
</script> -->
<template>
  <div class="batch-container">
    <h1>Create Batch</h1>
    <form @submit.prevent="submitBatch">
      <div class="form-group">
        <label for="batchNumber">Batch Number</label>
        <input id="batchNumber" v-model.trim="batchNumber" type="text" required />
      </div>
      <div class="form-group">
        <label for="startDate">Start Date</label>
        <input id="startDate" v-model="startDate" type="date" required />
      </div>
        <div class="form-group">
        <label for="supervisor">Intern Supervisor</label>
        <select id="supervisor" v-model="selectedSupervisorId" required>
          <option :value="null" disabled>-- Please select a supervisor --</option>
          <option
            v-for="supervisor in supervisorList"
            :key="supervisor.id"
            :value="supervisor.id"
          >
            {{ supervisor.name }}
          </option>
        </select>
      </div>
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading">Submitting...</span>
        <span v-else>Submit</span>
      </button>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Status } from "~/enums/status";
import { type BatchApiResponse, type  Supervisor, supervisors } from '~/interfaces/batch-response';
import { getTodayDateString } from '~/composables/today-date';

definePageMeta({
  path: "/createBatch",
});

const batchNumber = ref<string>('');
const startDate = ref<string>('');


const supervisorList = ref<Supervisor[]>(supervisors);
const selectedSupervisorId = ref<string>('');

const isLoading = ref<boolean>(false);
const successMessage = ref<string>('');
const errorMessage = ref<string>('');



onMounted(() => {
  startDate.value = getTodayDateString();
   selectedSupervisorId.value = '';
});

async function submitBatch() {
    console.log("Submit function started.");

     if (!selectedSupervisorId.value) {
      errorMessage.value = 'Please select a supervisor.';
      return; // Exit early if validation fails
    }

  successMessage.value = '';
  errorMessage.value = '';
  isLoading.value = true;
  
  const todayString = getTodayDateString();
  const statusToSet = startDate.value > todayString ? Status.INCOMING : Status.ONGOING;
  console.log("into to $fetch..."); 
  try {
    console.log("Attempting to $fetch..."); 
    
    const response = await $fetch<BatchApiResponse>('/api/batches/Post-batch', {
      method: 'POST',
      body: {
        batch_number: batchNumber.value,
        start_date: startDate.value,
        status: statusToSet,
       supervisorId: selectedSupervisorId.value,

      },
    });
  console.log("API response received:", response); 
    if (response.success) {
      successMessage.value = `Batch "${response.batch.batch_number}" created successfully!`;
      batchNumber.value = '';
      startDate.value = getTodayDateString();
    }
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Your styles are correct, no changes needed */
</style>
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