<template>
  <UContainer class="py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Batches</h1>
      <UButton icon="i-heroicons-plus" to="/batches/create-new-batch">
        Create New Batch
      </UButton>
    </div>
    <div v-if="pending" class="text-center py-12 text-gray-500">
      <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl" />
      <p class="mt-2">Loading batches...</p>
    </div>
    <div v-else-if="error" class="text-center py-12">
       <UCard>
        <div class="text-center py-8">
          <UIcon name="i-lucide-server-crash" class="text-4xl text-red-500" />
          <h3 class="mt-4 text-lg font-semibold">Could Not Load Batches</h3>
          <p class="mt-2 text-sm text-gray-500">There was an error fetching the data. Please try again later.</p>
        </div>
      </UCard>
    </div>
    <UCard v-else-if="!batches || batches.length === 0">
      <div class="text-center py-8">
        <UIcon name="i-lucide-folder-search" class="text-4xl text-gray-400" />
        <h3 class="mt-4 text-lg font-semibold">No Batches Found</h3>
        <p class="mt-2 text-sm text-gray-500">Get started by creating a new batch.</p>
      </div>
    </UCard>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="batch in batches"
        :key="batch.id"
        :to="`/admin/crud-for-interns/batches/${batch.id}`"
        class="block group"
      >
        <UCard class="h-full group-hover:ring-2 group-hover:ring-primary-500 dark:group-hover:ring-primary-400 transition-all">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ `Batch ${batch.batchNumber}` }}</h3>
              <UBadge :label="batch.status" color="primary" variant="soft" size="md" />
            </div>
          </template>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Interns</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ batch.internCount }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Supervisor</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ batch.supervisor }}</span>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import type { BatchListItem } from '~/types/crud-for-interns/Batch';

  const { data: batches, pending, error } = await useFetch<BatchListItem[]>('/api/crud-for-interns/batches', {
    lazy: true,
    key: 'all-batches-list'
  })
</script>