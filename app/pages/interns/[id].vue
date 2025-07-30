<template>
  <div v-if="pending" class="status-message">
    Loading intern details...
  </div>
  <div v-else-if="error || !form" class="status-message error">
    Error: Could not find intern data. Please check the server logs and ensure the API is running.
  </div>
  <div v-else class="page-background">
    <div class="details-container">
      <form @submit.prevent="saveChanges">
        <div class="header">
          <NuxtLink to="/interns/view_interns" class="back-button">
            ←
          </NuxtLink>
        </div>
        <div class="intern-header">
          <div class="profile-picture-container" :class="{ 'is-editable': isEditing }" @click="handleProfileClick">
            <input ref="fileInput" type="file" @change="handleFileUpload" accept="image/png, image/jpeg, image/gif"
              style="display: none" />
            <img v-if="form.internPicture" :src="form.internPicture" alt="Profile Picture"
              class="profile-picture-image" />
            <div v-else class="profile-picture-placeholder">
              <span class="plus-icon">+</span>
            </div>
          </div>
          <div class="header-details">
            <p class="intern-name">{{ form.fullName }}</p>
            <p class="intern-status">{{ form.status }}</p>
            <p class="intern-role">{{ form.role }}</p>
            <p class="sub-details">{{ form.course }} - {{ form.year }} | {{ form.school }}</p>
            <p class="sub-details">Hours Completed: {{ form.hoursCompleted ?? 0 }}/{{ form.requiredHours }}</p>
          </div>
        </div>
        <div class="tabs">
          <button type="button" class="tab-button active">
            Personal Info
          </button>
          <button type="button" class="tab-button" @click="console.log('Time Logs page not implemented.')">
            Time Logs
          </button>
        </div>
        <div class="info-body">
          <h2 class="info-section-title">Intern details:</h2>
          <div class="info-group">
            <label for="first-name" class="info-label">
              First Name:
            </label>
            <input id="first-name" type="text" class="info-input" v-model="form.firstName" :disabled="!isEditing"
              required />
          </div>
          <div class="info-group">
            <label for="middle-name" class="info-label">
              Middle Name(Optional):
            </label>
            <input id="middle-name" type="text" class="info-input" v-model="form.middleName" :disabled="!isEditing" />
          </div>
          <div class="info-group">
            <label for="last-name" class="info-label">
              Last Name:
            </label>
            <input id="last-name" type="text" class="info-input" v-model="form.lastName" :disabled="!isEditing"
              required />
          </div>
          <div class="info-group">
            <label for="contact-number" class="info-label">
              Contact Number:
            </label>
            <input id="contact-number" type="tel" class="info-input" v-model="form.contactNumber"
              :disabled="!isEditing" />
          </div>
          <div class="info-group">
            <label for="email" class="info-label">
              Email:
            </label>
            <input id="email" type="email" class="info-input" v-model="form.email" :disabled="!isEditing" required />
          </div>

          <h2 class="info-section-title">Internship information:</h2>
          <div class="info-group">
            <label for="school" class="info-label">
              School:
            </label>
            <input id="school" type="text" class="info-input" v-model="form.school" :disabled="!isEditing" required />
          </div>
          <div class="info-group">
            <label for="courseYear" class="info-label">
              Course and Year Level:
            </label>
            <input id="courseYear" type="text" class="info-input" v-model="form.courseYear" :disabled="!isEditing"
              required />
          </div>
          <div class="info-group">
            <label for="required-hours" class="info-label">
              Required Hours:
            </label>
            <input id="required-hours" type="number" class="info-input" v-model.number="form.requiredHours"
              :disabled="!isEditing" required />
          </div>
          <div class="info-group">
            <label for="role-position" class="info-label">
              Role/Position:
            </label>
            <input id="role-position" type="text" class="info-input" v-model="form.role" :disabled="!isEditing"
              required />
          </div>
          <div class="info-group">
            <label for="emergency-person" class="info-label">
              Emergency Contact Person:
            </label>
            <input id="emergency-person" type="text" class="info-input" v-model="form.contactPerson"
              :disabled="!isEditing" />
          </div>
          <div class="info-group">
            <label for="emergency-contact" class="info-label">
              Emergency Contact Number:
            </label>
            <input id="emergency-contact" type="text" class="info-input" v-model="form.contactPersonNumber"
              :disabled="!isEditing" />
          </div>
        </div>
        <button v-if="!isEditing" type="button" @click="startEditing" class="action-button edit-button">
          Edit Details
        </button>
        <button v-else type="submit" class="action-button save-button">
          ✓ Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from '~/generated/prisma'

const route = useRoute()
const internId = route.params.id as string
const isEditing = ref(false)

interface InternDetails {
  id: string
  userId: string
  fullName: string
  lastName: string
  firstName: string
  middleName: string | null
  email: string
  contactNumber: string | null
  contactPerson: string | null
  contactPersonNumber: string | null
  school: string
  course: string
  year: string
  courseYear: string
  requiredHours: number
  hoursCompleted: number | null
  note: string | null
  role: string
  status: Status
  password?: string | null
  internPicture: string | null
}

const { data: form, pending, error, refresh } = await useFetch<InternDetails>(`/api/interns_details/${internId}`)

function startEditing() {
  isEditing.value = true
}

async function saveChanges() {
  if (!form.value) return

  if (!form.value.userId) {
    window.alert('CRITICAL ERROR: Cannot save because User ID is missing. Please refresh.')
    return
  }

  try {
    await $fetch(`/api/interns_details/${internId}`, {
      method: 'PUT',
      body: form.value,
    })

    isEditing.value = false
    window.alert('Intern details updated successfully!')
    await refresh()
  } catch (err: any) {
    console.error('Failed to save changes:', err)
    window.alert(`Error: ${err.data?.statusMessage || 'Could not save changes. Check server logs.'}`)
  }
}

const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleProfileClick() {
  if (isEditing.value) {
    triggerFileInput()
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    await $fetch(`/api/interns/${internId}/upload-picture`, {
      method: 'POST',
      body: formData,
    })

    window.alert('Profile picture updated!')
    await refresh()
  } catch (err: any) {
    console.error('Failed to upload picture:', err)
    window.alert(`Error: ${err.data?.statusMessage || 'Could not upload the picture.'}`)
  }
}
</script>

<style scoped>
.page-background {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #ffffff;
  min-height: 100vh;
  padding-bottom: 90px;
}

.details-container {
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 20px;
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

.header {
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  font-size: 28px;
  color: #333;
  cursor: pointer;
  text-decoration: none;
}

.header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
  font-weight: normal;
}

.intern-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
}

.header-details p {
  margin: 0;
  line-height: 1.4;
}

.intern-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #050505;
}

.intern-status,
.intern-role {
  font-size: 1rem;
  color: #333;
  text-transform: capitalize;
}

.sub-details {
  font-size: 0.9rem;
  color: #666;
}

.profile-picture-container {
  flex-shrink: 0;
  cursor: default;
}

.profile-picture-container.is-editable {
  cursor: pointer;
}

.profile-picture-placeholder {
  width: 90px;
  height: 90px;
  border: 2px solid #333;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  transition: all 0.2s;
}

.plus-icon {
  font-size: 40px;
  font-weight: 300;
  color: #333;
}

.profile-picture-image {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
  transition: opacity 0.2s;
}

.profile-picture-container.is-editable:hover .profile-picture-image,
.profile-picture-container.is-editable:hover .profile-picture-placeholder {
  opacity: 0.7;
  border-color: #0b64e0;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab-button {
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
}

.tab-button.active {
  color: #0b64e0;
  border-bottom-color: #0b64e0;
  font-weight: 600;
}

.info-body {
  padding: 0 5px;
}

.info-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-top: 25px;
  margin-bottom: 20px;
}

.info-group {
  margin-bottom: 20px;
}

.info-label {
  display: block;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.info-input {
  width: 100%;
  font-size: 1rem;
  color: #1c1e21;
  border-radius: 6px;
  transition: all 0.2s;
  border: 1px solid #ddd;
  padding: 12px;
  box-sizing: border-box;
}

.info-input:disabled {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #555;
}

.info-input:focus:not(:disabled) {
  border-color: #0b64e0;
  box-shadow: 0 0 0 2px rgba(11, 100, 224, 0.2);
  outline: none;
}

.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  padding: 15px 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.action-button {
  width: 100%;
  max-width: 510px;
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #e4e6eb;
  color: #050505;
}

.edit-button:hover {
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
