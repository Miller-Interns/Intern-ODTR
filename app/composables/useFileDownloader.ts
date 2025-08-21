export function useFileDownloader() {
	const isExporting = ref(false)
	const exportError = ref<string | null>(null)
	const toast = useToast()

	const downloadFile = async (url: string, defaultFilename: string = 'download.csv') => {
		isExporting.value = true
		exportError.value = null

		try {
			const response = await $fetch.raw(url)
			const data = response._data

			if (typeof data !== 'string' || data.length === 0) {
				throw new Error('The server response was not a valid file content.')
			}

			const blob = new Blob([data], { type: response.headers.get('content-type') || 'application/octet-stream' })
			const objectUrl = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = objectUrl

			const disposition = response.headers.get('content-disposition')
			let filename = defaultFilename
			if (disposition && disposition.includes('filename=')) {
				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
				const matches = filenameRegex.exec(disposition)
				if (matches != null && matches[1]) {
					filename = matches[1].replace(/['"]/g, '')
				}
			}

			link.setAttribute('download', filename)
			document.body.appendChild(link)
			link.click()

			// Cleanup
			document.body.removeChild(link)
			URL.revokeObjectURL(objectUrl)

			toast.add({
				title: 'Success',
				description: 'DTR exported successfully.',
				color: 'success',
			})
		} catch (err: any) {
			const errorMessage = err.message || 'An unknown error occurred during download.'
			exportError.value = err.message
			toast.add({
				title: 'Error',
				description: errorMessage,
				color: 'error',
			})
		} finally {
			isExporting.value = false
		}
	}

	return {
		isExporting: readonly(isExporting),
		exportError: readonly(exportError),
		downloadFile,
	}
}
