<template>
    <div class="bg-black-50 min-h-screen flex flex-col pb-20">

        <!-- Loading State -->
        <div v-if="pending" class="flex flex-1 items-center justify-center">
            <p>Loading Profile...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-1 items-center justify-center text-red-500 text-center">
            <p>Could not load profile data.<br />Please try again later.</p>
        </div>

        <!-- Main Content -->
        <div v-else-if="data?.profile" class="p-4 space-y-6">
            <UCard class="shadow-lg">
                <div class="flex items-start gap-4">
                    <div class="relative w-max">
                        <UAvatar :src="data.profile.intern_picture || undefined" alt="Avatar" class="w-16 h-16" />
                        <button @click="openFileInput" class="absolute bottom-0 right-0 bg-black bg-opacity-60 hover:bg-opacity-80 
               rounded-full p-1 flex items-center justify-center transition">
                            <UIcon v-if="!isUploading" name="i-heroicons-camera" class="text-white text-xs" />
                            <UIcon v-else name="i-heroicons-arrow-path" class="text-white text-sm animate-spin" />
                        </button>
                        <input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" class="hidden" />
                    </div>
                    <div>
                        <h1 class="font-bold text-lg">{{ data.profile.name || 'Intern Name' }}</h1>
                        <UBadge v-if="data.profile.status" color="success" variant="soft" class="mt-1">
                            Ongoing
                        </UBadge>
                        <UBadge v-else color="error" variant="soft" class="mt-1">
                            Inactive
                        </UBadge>
                        <p class="text-sm text-black-500 mt-1">{{ data.profile.role || 'No Role Assigned' }}</p>
                        <p class="text-sm text-black-500">{{ data.profile.course }} - {{ data.profile.year }}</p>
                        <p class="text-sm text-black-500">{{ data.profile.school }}</p>
                        <p class="text-sm text-black-500">
                            Hours: {{ data.profile.hours_completed }} / {{ data.profile.required_hours }}
                        </p>
                    </div>
                </div>
            </UCard>

            <div class="relative py-2">
                <div class="relative flex justify-center"><span class="bg-black-50 px-2 text-sm text-black-500">Personal
                        Info</span></div>
                <div class="w-full border-t border-black-300" />
            </div>

            <!-- VIEW MODE -->
            <div v-if="!isEditing" class="space-y-6">
                <section>
                    <h2 class="font-bold text-xl mb-4 text-black-800">Intern details</h2>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">First Name</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.first_name }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Middle Name</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.middle_name || "N/A" }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Last Name</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.last_name }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Email</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.email }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Password</h1>
                        <h2 class="font-semibold text-black-800 text-left">••••••••••</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Contact Number</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{
                            data.profile.contact_number }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Emergency Contact Person</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{
                            data.profile.emergency_contact_person }}</h2>
                    </div>
                    <div>
                        <h1 class="text-black-500 text-sm">Emergency Contact Number</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{
                            data.profile.emergency_contact_number }}</h2>
                    </div>
                </section>
                <section>
                    <h2 class="font-bold text-xl mb-4 text-black-800">Internship information</h2>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">School</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.school }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Course and Year Level</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.course
                        }} - {{ data.profile.year }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Required Hours</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{
                            data.profile.required_hours }}</h2>
                    </div>
                    <div class="pb-5">
                        <h1 class="text-black-500 text-sm">Role/Position</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.role || 'N/A' }}</h2>
                    </div>
                    <div>
                        <h1 class="text-black-500 text-sm">Note/Remarks(Optional)</h1>
                        <h2 class="font-semibold text-black-800 text-left">{{ data.profile.notes || 'None' }}</h2>
                    </div>
                </section>
                    <UModal>
                        <UButton label="Open" color="neutral" variant="subtle" />

                        <template #content>
                            <Placeholder class="h-48 m-4" />
                        </template>
                    </UModal>
                <div class="space-y-2 pt-4">
                    <UButton @click="enterEditMode" block size="lg" icon="i-heroicons-pencil-square">Edit Info</UButton>
                    <UModal v-model:open="isLogoutModalOpen" title="Confirmation">
                        <UButton @click="isLogoutModalOpen = true" block size="lg"
                            icon="i-heroicons-arrow-left-on-rectangle" color="primary">Logout</UButton>
                            <template #header>
                                <h2 class="text-2xl font-bold">Logout?</h2>
                            </template>
                            <template #body>
                            <p class="py-4 text-black">Are you sure you want to log out?</p>
                            </template>
                            <template #footer>
                                <div class="flex justify-end gap-2">
                                    <UButton @click="isLogoutModalOpen = false" color="primary" variant="outline" label="Cancel" class="text-black text-md"/>
                                    <UButton @click="performLogout" color="primary" label="Yes, Logout" class="text-white text-md"/>
                                </div>
                            </template>
                    </UModal>
                </div>
            </div>

            <!-- EDIT MODE -->
            <div v-else class="space-y-6">
                <UForm :state="formState" @submit="handleSaveChanges">
                    <!-- FIX: Rebuilt the form to match the new design -->
                    <section class="space-y-4">
                        <h2 class="font-bold text-xl mb-2">Intern details</h2>
                        <UFormField label="First Name" name="firstName" required class="text-sm">
                            <UInput v-model="formState.first_name" class="w-full" placeholder="First Name"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Middle Initial (Optional)" name="middleName">
                            <UInput v-model="formState.middle_name" class="w-full" placeholder="Middle Initial"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Last Name" name="lastName" required>
                            <UInput v-model="formState.last_name" class="w-full" placeholder="Last Name"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Email" name="email" required>
                            <UInput v-model="formState.email" type="email" class="w-full" placeholder="Email"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="New Password (leave blank to keep current)" name="password">
                            <UInput v-model="formState.password" :type="isPasswordVisible ? 'text' : 'password'"
                                revealable="false" placeholder="Password" class="w-full"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" :class="passwordError
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'focus:border-primary-500 focus:ring-primary-500 border-gray-300'
                                    ">
                                <template #trailing>
                                    <UButton :icon="isPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                        variant="link" color="neutral" :padded="false"
                                        @click="isPasswordVisible = !isPasswordVisible" />
                                </template>
                            </UInput>
                        </UFormField>
                        <UFormField label="Contact Number" name="contact_number">
                            <UInput v-model="formState.contact_number" class="w-full" placeholder="Contact Number"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Emergency Contact Person" name="emergency_contact_person">
                            <UInput v-model="formState.emergency_contact_person" class="w-full"
                                placeholder="Emergency Contact Person"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Emergency Contact Number" name="emergency_contact_number">
                            <UInput v-model="formState.emergency_contact_number" class="w-full"
                                placeholder="Emergency Contact Number"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                    </section>
                    <section class="space-y-4 mt-6">
                        <h2 class="font-bold text-xl mb-2">Internship information</h2>
                        <UFormField label="School" name="school" required>
                            <UInput v-model="formState.school" class="w-full" placeholder="School"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Course and Year Level" name="courseAndYear" required>
                            <UInput v-model="formState.courseAndYear" class="w-full" placeholder="Course and Year Level"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Required hours" name="required_hours" required>
                            <UInput v-model.number="formState.required_hours" type="number" class="w-full"
                                placeholder="Required Hours" :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Role/Position" name="role">
                            <UInput v-model="formState.role" class="w-full" placeholder="Role/Position"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                        <UFormField label="Note/Remarks (Optional)" name="notes">
                            <UTextarea v-model="formState.notes" class="w-full"
                                placeholder="Any additional notes or remarks" :rows="3"
                                :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
                        </UFormField>
                    </section>
                    <div class="flex gap-2 pt-6">
                        <UButton type="submit" :loading="isSaving" block size="lg">Save Changes</UButton>
                        <UButton @click="isEditing = false" block size="lg" color="primary">Cancel</UButton>
                    </div>
                </UForm>
            </div>
        </div>
        <!-- Bottom Navigation -->
        <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t">
            <div class="flex justify-around py-2">
                <UButton to="/dashboard" variant="link" icon="i-heroicons-home"
                    class="flex flex-col items-center text-xs text-black-600">Dashboard</UButton>
                <UButton to="/timelogs" variant="link" icon="i-heroicons-clock"
                    class="flex flex-col items-center text-xs text-black-600">Time Logs</UButton>
                <UButton to="/profile" variant="link" icon="i-heroicons-user-circle"
                    class="flex flex-col items-center text-xs text-primary-600 font-bold">Profile</UButton>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Selectable } from 'kysely';
import type { Intern, User } from '~/server/db/types';

type ProfileDataResponse = {
    profile: Selectable<Intern> & { email: string; name: string | null };
};

const { clear } = useUserSession();
const router = useRouter();
const toast = useToast();
const isPasswordVisible = ref(false)
const passwordError = ref<string | undefined>(undefined)
const isLogoutModalOpen = ref(false);

const isEditing = ref(false);
const isSaving = ref(false);
const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const formState = ref({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    contact_number: '',
    emergency_contact_person: '',
    emergency_contact_number: '',
    school: '',
    courseAndYear: '',
    course: '',
    year: '',
    required_hours: 0,
    role: '',
    notes: '',
});

const { data, pending, error, refresh } = await useFetch<ProfileDataResponse>('/api/profile/fetch');

function openFileInput() {
    fileInput.value?.click();
}

async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    isUploading.value = true;
    const formData = new FormData();
    formData.append('picture', file);

    try {
        await $fetch('/api/profile/picture', {
            method: 'POST',
            body: formData,
        });
        toast.add({ title: 'Profile picture updated!', color: 'success' });
        await refresh(); // Refresh data to show the new picture
    } catch (err: any) {
        toast.add({ title: 'Error', description: err.data?.message || 'Could not upload picture.', color: 'error' });
    } finally {
        isUploading.value = false;
        // Reset file input to allow re-uploading the same file if needed
        if (fileInput.value) fileInput.value.value = '';
    }
}

function enterEditMode() {
    if (data.value?.profile) {
        const profile = data.value.profile;
        formState.value = {
            ...formState.value,
            first_name: profile.first_name,
            middle_name: profile.middle_name || '',
            last_name: profile.last_name,
            email: profile.email,
            contact_number: profile.contact_number,
            emergency_contact_person: profile.emergency_contact_person,
            emergency_contact_number: profile.emergency_contact_number,
            school: profile.school,
            courseAndYear: `${profile.course} - ${profile.year}`,
            required_hours: profile.required_hours,
            role: profile.role || '',
            notes: profile.notes || '',
        };
        isEditing.value = true;
    }
}

async function handleSaveChanges() {
    isSaving.value = true;
    try {
        const [course, year] = formState.value.courseAndYear.split(' - ');
        const payload = {
            ...formState.value,
            course: course?.trim() || '',
            year: year?.trim() || '',
        };
        delete (payload as any).courseAndYear;

        await $fetch('/api/profile/update', {
            method: 'PUT',
            body: payload,
        });
        toast.add({ title: 'Profile updated successfully!', color: 'success' });
        isEditing.value = false;
        await refresh();
    } catch (err: any) {
        toast.add({ title: 'Error', description: err.data?.message || 'Could not update profile.', color: 'error' });
    } finally {
        isSaving.value = false;
    }
}

async function performLogout() {
    await $fetch('/api/auth/logout', { method: 'POST' });
    await clear();
    await router.push('/login');
}
</script>