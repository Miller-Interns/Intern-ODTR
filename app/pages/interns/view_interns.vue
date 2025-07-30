<template>
  <div class="page-container">
    <header class="header">
      <NuxtLink to="/dashboard" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </NuxtLink>
      <h1>Active Interns</h1>
    </header>
    <div v-if="pending" class="status-message">Loading Batch Details...</div>
    <div v-else-if="error || !batchData" class="status-message error">Could not load batch details.</div>
    <main v-else class="content-wrapper">
      <section class="batch-details-card">
        <div class="batch-header">
          <h2>Batch Details</h2>
          <span class="status-pill">{{ batchData.details.statusText }}</span>
        </div>
        <div class="interns-list">
          <NuxtLink v-for="intern in batchData.interns" :key="intern.id" :to="`/interns/${intern.id}`"
            class="intern-card-link">
            <div class="intern-card-content">
              <div class="intern-info">
                <img v-if="intern.pictureUrl" :src="intern.pictureUrl" alt="Profile" class="profile-picture">
                <div v-else class="profile-picture-placeholder"></div>
                <p class="intern-name">{{ intern.name }}</p>
              </div>
              <p class="hours-completed">Hours Completed: {{ intern.hoursCompleted ?? 0 }}/{{ intern.requiredHours }}
                hours</p>
            </div>
          </NuxtLink>
        </div>
      </section>
      <NuxtLink to="/interns/new" class="add-intern-button">
        <span class="plus-icon">+</span> Add Intern
      </NuxtLink>

    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

interface InternInfo {
  id: string;
  name: string;
  pictureUrl: string | null;
  hoursCompleted: number | null;
  requiredHours: number;
}

interface BatchData {
  details: {
    id: string;
    batchNumber: string;
    statusText: string;
  };
  interns: InternInfo[];
}

const route = useRoute();
const batchId = '1';

const { data: batchData, pending, error } = await useFetch<BatchData>(`/api/batch/${batchId}`);
</script>

<style scoped>

.page-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 500px;
  margin: 20px auto;
  padding: 0 20px;
}

.status-message {
  text-align: center;
  padding: 50px 20px;
  color: #666;
  font-size: 1.1rem;
}

.status-message.error {
  color: #D8000C;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e2e5;
}

.header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #050505;
  margin: 0;
}

.back-button {
  color: #050505;
  display: flex;
  align-items: center;
}

.batch-details-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.batch-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.status-pill {
  background-color: #d1f4e7;
  color: #0d8356;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.interns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.intern-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e0e2e5;
  border-radius: 8px;
  transition: background-color 0.2s, border-color 0.2s;
}

.intern-card-link:hover {
  background-color: #fafafa;
  border-color: #ccc;
}

.intern-card-content {
  padding: 12px;
}

.intern-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.profile-picture,
.profile-picture-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-picture-placeholder {
  background-color: #e0e2e5;
  border: 1px solid #ccc;
}

.intern-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.hours-completed {
  font-size: 0.85rem;
  color: #65676b;
  margin: 0;
  padding-left: 52px;
}

.add-intern-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: center;
  padding: 12px;
  margin-top: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0d8356;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, border-color 0.2s;
}

.add-intern-button:hover {
  background-color: #fafafa;
  border-color: #b3b3b3;
}

.plus-icon {
  font-size: 1.2rem;
  line-height: 1;
}
</style>