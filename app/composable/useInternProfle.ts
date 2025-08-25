import { ref, reactive, watch } from 'vue'
import type { InternDetails } from '~/types/crud-for-interns/Intern' 
import { useToast } from '#imports'

export function useInternProfile(internId: string) {
  const isEditing = ref(false)
  const isModalOpen = ref(false)
  const avatarFile = ref<File | null>(null)
  const avatarPreviewUrl = ref<string | null>(null)
  const toast = useToast()
  const { data, pending, error, refresh } = useFetch<InternDetails>(`/api/crud-for-interns/interns/${internId}`)
  const form = reactive<Partial<InternDetails>>({})
  
  let originalFormState: Partial<InternDetails> = {}

  watch(data, (newInternData) => {
    if (newInternData) {
      Object.assign(form, newInternData)
      originalFormState = JSON.parse(JSON.stringify(newInternData))
    }
  }, { immediate: true })

  function startEditing() {
    isEditing.value = true
  }

  function cancelEditing() {
    Object.assign(form, originalFormState)
    
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
        await $fetch(`/api/crud-for-interns/interns/${form.internId}/picture`, { method: 'POST', body: formData })
      }

      await $fetch(`/api/crud-for-interns/interns/${form.internId}`, { method: 'PUT', body: form })

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
      await $fetch(`/api/crud-for-interns/interns/${form.internId}/status`, { method: 'PATCH', body: { status: newStatus } })
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