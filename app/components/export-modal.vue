<template>
	<!-- 
    The v-model on UModal controls its visibility.
    The 'prevent-close' prop ensures the user can't dismiss it by clicking outside.
  -->
	<UModal
		v-model="isOpen"
		prevent-close
		:ui="{
			class: 'flex min-h-full items-center justify-center text-center',
			overlay: 'bg-gray-900/75 dark:bg-gray-800/75',
			base: 'relative text-left overflow-visible w-full sm:my-8',
			padding: 'p-4 text-center',
			background: 'bg-transparent',
			ring: 'ring-0',
			shadow: 'shadow-none',
		}"
	>
		<!-- We can make the content of the overlay customizable via slots -->
		<slot>
			<div class="flex flex-col items-center gap-4">
				<USpinner :ui="{ base: 'h-10 w-10' }" />
				<p class="text-lg font-medium text-white">
					{{ text }}
				</p>
			</div>
		</slot>
	</UModal>
</template>

<script setup lang="ts">
	const props = defineProps({
		// Use a simple boolean prop to control visibility
		modelValue: {
			type: Boolean,
			default: false,
		},
		text: {
			type: String,
			default: 'Processing, please wait...',
		},
	})

	// Use a computed property to link the prop to the modal's v-model
	const isOpen = computed({
		get: () => props.modelValue,
		set: (value) => emit('update:modelValue', value),
	})

	const emit = defineEmits(['update:modelValue'])
</script>
