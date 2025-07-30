<script setup lang="ts">
import ViewButton from '~/composables/view-buttom.vue';
import { type Batch } from '@prisma/client';
import { formatDate } from '~/server/db/utils/format'
import { NuxtLink } from '#components';



definePageMeta({
    path: '/',
    layout: 'batch'
})

const { data: allBatches, pending, error } = await useFetch<Batch[]>('/api/batches/batch');
const currentBatches = computed(() => {
    if (!allBatches.value) return [];
    return allBatches.value.filter(batch => batch.end_date === null);
});

const previousBatches = computed(() => {
    if (!allBatches.value) return [];
    return allBatches.value.filter(batch => batch.end_date !== null);
});
const today = new Date();
today.setHours(0, 0, 0, 0);

const triggerServerStatusUpdate = async () => {
   try {
    const updatedBatchList = await $fetch<Batch[]>('/api/batches/status', {
      method: 'PATCH'
    });
    allBatches.value = updatedBatchList;

  } catch (e) {
    console.error('Client: Failed to trigger the server-side status update:', e);
  }
};

watch(allBatches, (newBatches) => {
  if (!newBatches || newBatches.length === 0) return;

  const needsUpdate = newBatches.some(batch => 
    batch.status === 'INCOMING' && batch.start_date <= today
  );

  if (needsUpdate) {
    triggerServerStatusUpdate();
  }
}, { 
  once: true
}); 

</script>

<template>
    <div>
        <div v-if="pending" class="loading-state">
            Loading batch information...
        </div>

        <div v-else-if="error" class="error-state">
            <h2>Error</h2>
            <p>Could not load batches. Please try again later.</p>
            <pre>{{ error.message }}</pre>
        </div>

        <div v-else>
            <section class="batch-section">
                <h2>Current Batches</h2>
                <div v-if="currentBatches.length > 0" class="batch-list">
                    <div v-for="batch in currentBatches" :key="batch.id" class="batchCard current">
                        <div class="card-header">
                            <h3 class="batchNo">Batch {{ batch.batch_number }}</h3>
                            <p class="date">Started: {{ formatDate(batch.start_date) }}</p>
                            <ViewButton :batch-id="batch.id" />
                            <NuxtLink to="/editBatch/${batch.id}"><button>
                                    edit Batch
                                </button>
                            </NuxtLink>
                        </div>
                        <div class="card-details">
                          <p>Status: <span class="status" :class="`status-${batch.status?.toLowerCase()}`">{{ batch.status }}</span></p>
            </div>
                    </div>
                </div>
                <p v-else class="empty-state">No active batches.</p>
            </section>

            <NuxtLink to="/createBatch"><button>
                    Create Batch
                </button></NuxtLink>

            <section class="batch-section">
                <h2>Previous Batches</h2>
                <div v-if="previousBatches.length > 0" class="batch-list">
                    <div v-for="batch in previousBatches" :key="batch.id" class="batchCard previous">
                        <div class="card-header">
                            <h3 class="batchNo">Batch {{ batch.batch_number }}</h3>
                            <div class="date-range">
                                <p class="date">Started: {{ formatDate(batch.start_date) }}</p>
                                <p class="date">Ended: {{ formatDate(batch.end_date) }}</p>
                            </div>
                            <ViewButton :batch-id="batch.id" />
                        </div>
                        <div class="card-details">
                            <p>Status: <span class="status">{{ batch.status }}</span></p>
                        </div>
                    </div>
                </div>
                <p v-else class="empty-state">No previous batches found.</p>
            </section>
        </div>

        <!-- Slot allows this component to be used as a layout wrapper if needed. -->
        <slot />
    </div>
</template>

<style scoped>
.date,
.date-range {
    font-size: 0.9em;
    color: #555;
    margin: 0;
}

.date-range {
    text-align: right;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

/* Add other styles as needed */
</style>
