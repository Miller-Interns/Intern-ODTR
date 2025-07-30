<template>
  <div v-if="pending" class="status-message">
    Loading intern details...
  </div>
  <div v-else-if="error || !form" class="status-message error">
    Could not find intern data.
  </div>

  <div v-else class="page-background">
    <div class="form-container">
      <div class="intern-header-card">
        <h3>{{ form.name }}</h3>
        <p>{{ form.role }}</p>
        <p class="details">{{ form.course }} - {{ form.year }} | {{ form.school }}</p>
        <p class="details">Hours Completed: {{ form.hoursCompleted ?? 0 }}/{{ form.requiredHours }}</p>
        <div class="tabs">
          <button class="tab-button active">Personal Info</button>
          <button class="tab-button">Time Logs</button>
        </div>
      </div>
      <form class="form" @submit.prevent="saveChanges">
        <h2 class="form-section-title">Intern details</h2>
        <div class="form-group">
          <label for="name">Full Name:</label>
          <input id="name" type="text" v-model="form.name" :disabled="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="contact-number">Contact Number:</label>
          <input id="contact-number" type="tel" v-model="form.contactNumber" :disabled="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" type="email" v-model="form.email" :disabled="!isEditing" required />
        </div>

        <h2 class="form-section-title">Internship information:</h2>
        <div class="form-group">
          <label for="school">School:</label>
          <input id="school" type="text" v-model="form.school" :disabled="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="course">Course:</label>
          <input id="course" type="text" v-model="form.course" :disabled="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="year">Year Level:</label>
          <input id="year" type="text" v-model="form.year" :disabled="!isEditing" required />
        </div>
        <div class="form-group">
          <label for="required-hours">Required hours:</label>
          <input id="required-hours" type="number" v-model.number="form.requiredHours" :disabled="!isEditing"
            required />
        </div>
        <div class="form-group">
          <label for="note">Note/Remarks:</label>
          <input id="note" type="text" v-model="form.note" :disabled="!isEditing" />
        </div>

        <div class="button-container">
          <button v-if="!isEditing" type="button" @click="startEditing" class="submit-button">
            Edit Details
          </button>
          <button v-else type="submit" class="submit-button save-button">
            ✓ Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from '~/generated/prisma'

const route = useRoute()
const isEditing = ref(false)
const internId = route.params.id as string

interface InternDetails {
  id: string
  name: string
  email: string
  contactNumber: string | null
  school: string
  course: string
  year: string
  requiredHours: number
  hoursCompleted: number | null
  note: string | null
  role: string
  status: Status
}

const { data: form, pending, error } = await useFetch<InternDetails>(`/api/interns_details/${internId}`)

function startEditing() {
  isEditing.value = true
}

async function saveChanges() {
  if (!form.value) return
  alert('Save functionality requires a PUT API endpoint to be created.')
  isEditing.value = false
}
</script>

<style scoped>
.page-background {
  background-color: #333;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.status-message {
  text-align: center;
  margin-top: 50px;
  font-size: 1.2rem;
  color: #666;
}

.status-message.error {
  color: #d8000c;
  font-weight: bold;
}

.form-container {
  background-color: #ffffff;
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
  overflow: hidden;
}

.intern-header-card {
  background-color: #f0f2f5;
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.intern-header-card h3 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
}

.intern-header-card p {
  margin: 0 0 4px 0;
  font-size: 0.95rem;
  color: #333;
}

.intern-header-card .details {
  color: #666;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  margin-top: 16px;
  border-bottom: 2px solid #ccc;
}

.tab-button {
  flex-grow: 1;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #0b64e0;
  border-bottom-color: #0b64e0;
  font-weight: 600;
}

.form {
  padding: 20px;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f0f2f5;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
  color: #1c1e21;
}

input:disabled {
  background-color: #ffffff;
  border-color: transparent;
  padding-left: 0;
  color: #333;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: #e4e6eb;
  color: #050505;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 10px;
}

.submit-button:hover {
  background-color: #d8dbdf;
}

.save-button {
  background-color: #1b74e4;
  color: #ffffff;
}

.save-button:hover {
  background-color: #1868cd;
}
</style>
