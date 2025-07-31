<template>
  <div class="batch-container">
    <div v-if="pending" class="loading">Loading batch data...</div>
    <div v-else-if="fetchError" class="error-message">
      Could not load batch data. {{ fetchError.message }}
    </div>
    <div v-else>
      <h1>Edit Batch {{ batchNumber }}</h1>
      <form @submit.prevent="submitBatch">
        <div class="form-group">
          <label for="batchNumber">Batch Number</label>
          <input id="batchNumber" v-model="batchNumber" type="text" required />
        </div>
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input id="startDate" v-model="startDate" type="date" required />
        </div>
        <div class="form-group">
          <label for="supervisor">Intern Supervisor</label>
          <select id="supervisor" v-model="selectedSupervisorId" required>
            <option :value="null" disabled>-- Please select a supervisor --</option>
            <option v-for="supervisor in supervisorList" :key="supervisor.id" :value="supervisor.id">
              {{ supervisor.name }}
            </option>
          </select>
        </div>
        <button type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Status } from "~/enums/status";
import { type BatchWithInternCount, type Supervisor, supervisors } from '~/interfaces/batch-response';

definePageMeta({
  path: '/editBatch'
});


const route = useRoute();
const router = useRouter();
const batchId = route.query.id as string;


const batchData = ref<BatchWithInternCount | null>(null);
const pending = ref(true);
const fetchError = ref<Error | null>(null);


const batchNumber = ref('');
const startDate = ref('');
const selectedSupervisorId = ref<string | null>(null);
const supervisorList = ref<Supervisor[]>(supervisors);

  const todayString = getTodayDateString();
  const statusToSet = startDate.value > todayString ? Status.INCOMING : Status.ONGOING;

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
  if (!batchId) {
    fetchError.value = new Error("No Batch ID found in the URL.");
    pending.value = false;
    return;
  }
  try {
    batchData.value = await $fetch<BatchWithInternCount>('/api/batches/single', {
        method: 'GET',
        query: {
            id: batchId
        }
    });
  } catch (err: any) {
    fetchError.value = err;
  } finally {
    pending.value = false;
  }
});

watchEffect(() => {
  if (batchData.value) {
    batchNumber.value = batchData.value.batch_number.toString();
    startDate.value = batchData.value.start_date.split('T')[0];
    
  }
});


async function submitBatch() {
  if (!selectedSupervisorId.value) {
    errorMessage.value = "Please select a supervisor.";
    return;
  }

 
  
  try {
    await $fetch<BatchWithInternCount>(`/api/batches/edit`, { 
      method: 'PATCH',
      body: {
        id: batchId,
        batch_number: batchNumber.value,
        start_date: startDate.value,
        status: statusToSet,
        supervisorId: selectedSupervisorId.value,
      },
    });
 isSubmitting.value = true;
  errorMessage.value = '';
    successMessage.value = 'Batch updated successfully! Redirecting...';
    setTimeout(() => router.push('/'), 1500);

  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.batch-container { max-width: 500px; margin: 2rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
/* ...and your other styles... */
</style>