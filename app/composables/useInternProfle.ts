import { ref, reactive, watch } from 'vue'
import type { InternDetails } from '~/types/Intern' 
import { useToast } from '#imports'

export function useInternProfile(internId: string) {
  const isEditing = ref(false)
  const isModalOpen = ref(false)
  const avatarFile = ref<File | null>(null)
  const avatarPreviewUrl = ref<string | null>(null)
  const toast = useToast()
  
  const isPasswordVisible = ref(false);
  const passwordError = ref<string | null>(null);
  const isSaving = ref(false); // The ref is here...

  const { data, pending, error, refresh } = useFetch<InternDetails>(`/api/interns/${internId}`)
  const form = reactive<Partial<InternDetails> & { password?: string }>({})
  
  let originalFormState: Partial<InternDetails> = {}

  watch(data, (newInternData) => {
    if (newInternData) {
      Object.assign(form, newInternData)
      form.password = ''; 
      originalFormState = JSON.parse(JSON.stringify(newInternData))
    }
  }, { immediate: true })

  function startEditing() {
    isEditing.value = true
  }

  function cancelEditing() {
    Object.assign(form, originalFormState)
    form.password = '';
    avatarFile.value = null
    avatarPreviewUrl.value = null
    isEditing.value = false
    passwordError.value = null;
  }

  async function saveChanges() {
    if (!form.internId) return
    
    if (form.password && form.password.length > 0 && form.password.length < 6) {
      passwordError.value = 'Password must be at least 6 characters.';
      toast.add({ title: 'Validation Error', description: passwordError.value, color: 'error' });
      return;
    }
    passwordError.value = null;

    isSaving.value = true;
    try {
      if (avatarFile.value) {
        const formData = new FormData()
        formData.append('picture', avatarFile.value)
        await $fetch(`/api/interns/${form.internId}/picture`, { method: 'POST', body: formData })
      }

      await $fetch(`/api/interns/${form.internId}`, { method: 'PUT', body: form })

      toast.add({ title: 'Success', description: 'Changes saved successfully!', color: 'success' }) 
      
      isEditing.value = false
      await refresh() 

    } catch (err: any) {
      console.error(err)
      const errorMessage = err.data?.statusMessage || 'An unexpected error occurred.'
      toast.add({ title: 'Error', description: `Failed to save changes: ${errorMessage}`, color: 'error' })
    } finally {
      isSaving.value = false;
    }
  }

  async function markAsCompleted() {
    if (!form.internId) return
    try {
      await handleStatusUpdate('COMPLETED')
      toast.add({ title: 'Success', description: 'Intern marked as completed.', color: 'success' })
      isModalOpen.value = false
    } catch (err) {
      toast.add({ title: 'Error', description: 'Failed to mark as completed.', color: 'error' })
    }
  }

  async function handleStatusUpdate(newStatus: 'COMPLETED' | 'ONGOING') {
    if (!form.internId) return
    try {
      await $fetch(`/api/interns/${form.internId}/status`, { method: 'PATCH', body: { status: newStatus } })
      await refresh()
    } catch (err) {
      console.error(err)
      throw err 
    }
  }

  function handlePictureUpload(file: File) {
    avatarFile.value = file
    avatarPreviewUrl.value = URL.createObjectURL(file)
  }

  return {
    form, 
    pending, 
    error, 
    isEditing, 
    avatarPreviewUrl, 
    isModalOpen,
    refresh,
    isPasswordVisible,
    passwordError,
    isSaving, // ...but it needs to be returned here.
    startEditing, 
    cancelEditing, 
    saveChanges, 
    markAsCompleted,
    handleStatusUpdate, 
    handlePictureUpload,
  }
}