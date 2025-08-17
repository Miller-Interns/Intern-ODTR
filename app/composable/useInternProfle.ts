import { ref, reactive, watch } from 'vue'
import type { InternDetails } from '~/types/Intern' // Corrected import path casing
import { useToast } from '#imports'

export function useInternProfile(internId: string) {
  const isEditing = ref(false)
  const isModalOpen = ref(false)
  const avatarFile = ref<File | null>(null)
  const avatarPreviewUrl = ref<string | null>(null)
  const toast = useToast()

  // Fetch the initial data from the API
  const { data, pending, error, refresh } = useFetch<InternDetails>(`/api/interns/${internId}`)

  // This is the reactive "working copy" of the form that the UI will bind to.
  const form = reactive<Partial<InternDetails>>({})
  
  // --- THE FIX: Storing the original state ---
  // We store the pristine, original data in a simple, non-reactive object.
  let originalFormState: Partial<InternDetails> = {}

  // This watcher syncs our form when the data is first loaded or refreshed.
  watch(data, (newInternData) => {
    if (newInternData) {
      // Update the reactive `form` object with the new data.
      Object.assign(form, newInternData)
      // Create a deep, non-reactive copy of the pristine data for our backup.
      originalFormState = JSON.parse(JSON.stringify(newInternData))
    }
  }, { immediate: true })

  // --- CORRECTED FUNCTIONS ---

  function startEditing() {
    isEditing.value = true
  }

  function cancelEditing() {
    // This now works correctly. It copies the values from our backup
    // back into the reactive `form` object, which updates the UI.
    Object.assign(form, originalFormState)
    
    // Also reset any pending file uploads
    avatarFile.value = null
    avatarPreviewUrl.value = null
    
    isEditing.value = false
  }

  async function saveChanges() {
    if (!form.internId) return
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
    form, pending, error, isEditing, avatarPreviewUrl, isModalOpen,
    startEditing, cancelEditing, saveChanges, markAsCompleted,
    handleStatusUpdate, handlePictureUpload,
  }
}