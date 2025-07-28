<script setup>
defineProps({
  intern: { type: Object, required: true },
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-5">
    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <img :src="intern.avatar" alt="Intern Avatar" class="w-16 h-16 rounded-full bg-gray-200">
      
      <!-- Details -->
      <div class="flex-1">
        <h2 class="font-bold text-xl text-gray-900">{{ intern.name }}</h2>
        
        <div class="flex items-center text-sm gap-2 text-gray-600 mt-1">
          <span>{{ intern.status }}</span> -
          <span class="flex items-center gap-1 text-xs">
            <span class="bg-gray-200 p-1 rounded-full w-8 h-4 inline-block"></span>
            Mark as Completed
          </span>
        </div>

        <p class="text-sm text-gray-500 mt-2">{{ intern.role }}</p>
        <p class="text-sm text-gray-500">{{ intern.course }}</p>
        <p class="text-sm text-gray-500">{{ intern.school }}</p>

        <p class="text-sm text-gray-600 font-semibold mt-2">
          Hours Completed: {{ intern.hoursCompleted }}/{{ intern.hoursRequired }}
        </p>
      </div>
    </div>
  </div>
</template>