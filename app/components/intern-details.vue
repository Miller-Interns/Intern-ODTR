<script setup lang="ts">
import type { InternDetails } from '~/interfaces/interfaces';

defineProps<{
  details: InternDetails;
  isEditing: boolean;
}>();
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-base font-semibold leading-7 text-black dark:text-white">
        Intern details:
      </h2>
      <div class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UFormField>
          <template #label>
            First Name <span v-if="!details.firstName" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.firstName" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField label="Middle Name (Optional):">
          <UInput v-model="details.middleName" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Last Name <span v-if="!details.lastName" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.lastName" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Contact Number <span v-if="!details.contactNumber" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.contactNumber" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Email <span v-if="!details.email" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.email" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
      </div>
    </div>
    <div>
      <h2 class="text-base font-semibold leading-7 text-black dark:text-white">
        Internship information:
      </h2>
      <div class="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UFormField>
          <template #label>
            School <span v-if="!details.school" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.school" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Course and Year Level <span v-if="!details.courseYear" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.courseYear" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Required hours <span v-if="!details.requiredHours && details.requiredHours !== 0" class="text-red-500">*</span>
          </template>
          <UInput v-model.number="details.requiredHours" type="number" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Role/Position <span v-if="!details.role" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.role" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Emergency Contact Name <span v-if="!details.contactPerson" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.contactPerson" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField>
          <template #label>
            Emergency Contact Number <span v-if="!details.contactPersonNumber" class="text-red-500">*</span>
          </template>
          <UInput v-model="details.contactPersonNumber" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
        <UFormField label="Note/Remarks (Optional):" class="lg:col-span-3">
          <UTextarea v-model="details.note" :disabled="!isEditing" size="xl" class="w-full" />
        </UFormField>
      </div>
    </div>
  </div>
</template>