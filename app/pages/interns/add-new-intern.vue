<template>
    <div class="app-container">
        <div class="header">
            <NuxtLink to="/interns/view_interns" class="back-button">
                ←
            </NuxtLink>
            <h1>Add Intern</h1>
        </div>

        <form class="form" @submit.prevent="addIntern">
            <div class="form-group">
                <label for="first-name">First Name:</label>
                <input id="first-name" type="text" v-model.trim="form.firstName" required />
            </div>

            <div class="form-group">
                <label for="middle-name">Middle Name (Optional):</label>
                <input id="middle-name" type="text" v-model.trim="form.middleName" />
            </div>

            <div class="form-group">
                <label for="last-name">Last Name:</label>
                <input id="last-name" type="text" v-model.trim="form.lastName" required />
            </div>

            <div class="form-group">
                <label for="email">Email Address:</label>
                <input id="email" type="email" v-model.trim="form.email" required />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" type="password" v-model.trim="form.password" required />
            </div>

            <div class="form-group">
                <label for="school">School(CODE):</label>
                <input id="password" type="text" v-model.trim="form.school" required />
            </div>

            <div class="form-group">
                <label for="required-hours">Required Hours:</label>
                <input id="required-hours" type="number" v-model.number="form.requiredHours" required />
            </div>

            <div class="form-group">
                <label for="status">Status:</label>
                <select id="status" v-model="form.status" required>
                    <option value="" disabled>
                        Select a status
                    </option>
                    <option value="INCOMING">Incoming</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <div class="form-group">
                <label for="note">Note (Optional):</label>
                <input id="note" type="text" v-model="form.note" />
            </div>

            <button type="submit" class="submit-button">
                Add Intern
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    school: '',
    requiredHours: null as number | null,
    status: '',
    note: '',
})

async function addIntern() {
    try {
        const response = await $fetch('/api/add_interns', {
            method: 'POST',
            body: form.value,
        })

        alert('Intern added successfully!')
        console.log('Server response:', response)

        router.push('/interns/list-of-interns')
    } catch (error: any) {
        console.error('Error adding intern:', error)
        alert(`Failed to add intern: ${error.data?.statusMessage || 'Please check your input.'}`)
    }
}
</script>

<style scoped>
.app-container {
    font-family: 'Times New Roman', Times, serif;
    background-color: #ffffff;
    padding: 20px;
    max-width: 500px;
    margin: auto;
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
    padding: 0;
    margin-bottom: 15px;
    text-decoration: none;
}

.header h1 {
    font-size: 28px;
    color: #333;
    margin: 0;
    font-weight: normal;
}

.form {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    align-items: center;
    background-color: #e0e0e0;
    margin-bottom: 15px;
    padding-left: 12px;
}

label {
    color: #555;
    font-size: 16px;
    flex-shrink: 0;
    padding-right: 8px;
    white-space: nowrap;
}

input,
select {
    flex-grow: 1;
    padding: 12px 12px 12px 0;
    border: none;
    background-color: transparent;
    font-size: 16px;
    font-family: 'Times New Roman', Times, serif;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

input:focus,
select:focus {
    outline: none;
}

select {
    background-position: right 10px center;
    background-size: 16px;
    padding-right: 30px;
}

.submit-button {
    width: 100%;
    padding: 15px;
    background-color: #cccccc;
    color: #333;
    border: none;
    font-size: 18px;
    font-family: 'Times New Roman', Times, serif;
    cursor: pointer;
    margin-top: 10px;
}
</style>
