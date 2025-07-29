<script setup lang="ts">
import type { PropType } from 'vue';
import type { InternWithDetails } from '../types/composites.js';

defineProps({
  intern: {
    type: Object as PropType<InternWithDetails>,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
    <div class="flex items-center space-x-3">
      <!-- 
        UPDATED: Access intern.user.avatar
        Added a fallback to a default image if the avatar URL is null or undefined.
      -->
      <img 
        :src="intern.user.avatar || '/default-avatar.png'" 
        alt="Intern Avatar" 
        class="w-12 h-12 rounded-full bg-gray-200"
      >
      <div class="flex-1">
        <!-- UPDATED: Access intern.user.name -->
        <p class="font-semibold text-gray-800">{{ intern.user.name }}</p>
        <p class="text-sm text-gray-500">
          Hours Completed: {{ intern.completed_hours }}/{{ intern.required_hours }} hours
        </p>
      </div>
    </div>
  </div>
</template>

