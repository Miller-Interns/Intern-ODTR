<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-base font-semibold leading-7 text-black dark:text-white">
        Intern details:
      </h2>
      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-700 dark:text-gray-200">First Name</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.firstName" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.firstName || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Middle Name (Optional)</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.middleName" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.middleName || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Last Name</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.lastName" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.lastName || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Email</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.email" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.email || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Contact Number</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.contactNumber" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.contactNumber || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Emergency Contact Person</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.emergencyContactPerson" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.emergencyContactPerson || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Emergency Contact Number</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.emergencyContactNumber" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.emergencyContactNumber || '-' }}</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-base font-semibold leading-7 text-black dark:text-white">
        Internship information:
      </h2>
      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">School</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.school" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.school || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Course and Year Level</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.courseYear" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.courseYear || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Required Hours</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model.number="details.requiredHours" type="number" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.requiredHours ? `${details.requiredHours} hours` : '-' }}</p>
          </div>
        </div>
        <div class="form-field-container">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Role/Position</label>
          <div class="mt-2">
            <UInput v-if="isEditing" v-model="details.role" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white">{{ details.role || '-' }}</p>
          </div>
        </div>
        <div class="form-field-container lg:col-span-3">
          <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Note/Remarks (Optional)</label>
          <div class="mt-2">
            <UTextarea v-if="isEditing" v-model="details.notes" size="xl" class="w-full"/>
            <p v-else class="text-base text-black dark:text-white whitespace-pre-wrap">{{ details.notes || 'None' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UFormField, UInput, UTextarea } from '#components';
import type { InternDetails } from '~/types/crud-for-interns/Intern';

defineProps<{
  details: Partial<InternDetails>;
  isEditing: boolean;
}>();
</script>