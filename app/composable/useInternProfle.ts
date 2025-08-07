import { ref, onUnmounted } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import type { Status } from '~/generated/prisma'
import type { InternDetails } from '~/interfaces/interfaces'

export function useInternProfile(internId: string) {
  const toast = useToast()

  const isEditing = ref(false)
  const newAvatarFile = ref<File | null>(null)
  const avatarPreviewUrl = ref<string | null>(null)
  const isModalOpen = ref(false)

  const { data: form, pending, error, refresh } = useFetch<InternDetails>(`/api/interns_details/${internId}`)

  function startEditing() {
    isEditing.value = true
  }

  async function cancelEditing() {
    newAvatarFile.value = null
    avatarPreviewUrl.value = null
    isEditing.value = false
    await refresh()
    toast.add({ title: 'Edit cancelled', color: 'info' })
  }

  async function saveChanges(event: FormSubmitEvent<InternDetails>) {
    if (!form.value) return
    const savingToast = toast.add({ title: 'Saving changes...', color: 'secondary' })

    try {
      if (newAvatarFile.value) {
        const formData = new FormData()
        formData.append('avatar', newAvatarFile.value)
        await $fetch(`/api/interns/${internId}/upload-picture`, {
          method: 'POST',
          body: formData,
        })
      }

      await $fetch(`/api/interns_details/${internId}`, {
        method: 'PUT',
        body: event.data,
      })

      toast.update(savingToast.id, { title: 'Intern details updated successfully!', color: 'success'})
      isEditing.value = false
      newAvatarFile.value = null
      avatarPreviewUrl.value = null
      await refresh()
    } catch (err: any) {
      toast.update(savingToast.id, { title: 'Error Saving', description: err.data?.statusMessage || 'Could not save changes.', color: 'error'})
    }
  }

  async function markAsCompleted() {
    isModalOpen.value = false
    if (!form.value) return

    const statusToast = toast.add({ title: 'Updating status...', color: 'secondary'})
    try {
      const payload = { ...form.value, status: 'COMPLETED' as Status }
      await $fetch(`/api/interns_details/${internId}`, {
        method: 'PUT',
        body: payload,
      })
      toast.update(statusToast.id, { title: `${form.value.fullName} marked as Completed!`, color: 'success'})
      await refresh()
    } catch (err: any) {
      toast.update(statusToast.id, { title: 'Error Updating Status', description: err.data?.statusMessage || 'Could not update status.', color: 'error' })
    }
  }

  function handleStatusUpdate(newStatus: Status) {
    if (form.value) {
      form.value.status = newStatus
    }
  }

  function handlePictureUpload(file: File) {
    newAvatarFile.value = file
    if (avatarPreviewUrl.value) {
      URL.revokeObjectURL(avatarPreviewUrl.value)
    }
    avatarPreviewUrl.value = URL.createObjectURL(file)
  }

  onUnmounted(() => {
    if (avatarPreviewUrl.value) {
      URL.revokeObjectURL(avatarPreviewUrl.value)
    }
  })


  return {
    form,
    pending,
    error,
    isEditing,
    avatarPreviewUrl,
    isModalOpen,
    startEditing,
    cancelEditing,
    saveChanges,
    markAsCompleted,
    handleStatusUpdate,
    handlePictureUpload,
  }
}