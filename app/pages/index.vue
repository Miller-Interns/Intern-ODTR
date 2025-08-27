<template>
	<div>
		Redirecting...
	</div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'redirect-to-login'
})
</script>
