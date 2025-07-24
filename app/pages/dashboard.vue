<template>
    <h1>The dashboard will be here</h1>
    <button class="submit-button" @click="navigateTo('/login');">
        Go back
    </button>
</template>

<style scoped>
.submit-button {
  width: 100%;
  padding: 14px 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #1F2937;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-top: 8px;
}
</style>