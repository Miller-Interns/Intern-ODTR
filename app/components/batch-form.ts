import { format } from 'date-fns';
import type { BatchWithInternCount } from '~/types/Types';

export const useBatchForm = (batchId?: string) => {

  const router = useRouter();
  const toast = useToast();
  const form = reactive({
    batch_number: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    selectedSupervisorId: '',
  });

  const supervisorList = ref<{ label: string; value: string }[]>([]);
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const isEditMode = !!batchId;


  const fetchSupervisors = async () => {
    try {
      const rawData = await $fetch<{ id: string; name: string | null }[]>('/api/batches/admin');
      if (Array.isArray(rawData)) {
        supervisorList.value = rawData.map(user => ({
          label: user.name || 'Unnamed Supervisor',
          value: String(user.id),
        }));
      }
    } catch (e) {
      error.value = 'Failed to load supervisors.';
    }
  };


  const loadBatchForEdit = async () => {
    if (!isEditMode) return;
    try {
      const data = await $fetch<BatchWithInternCount>('/api/batches/single', {
        query: { id: batchId },
      });
    
      form.batch_number = data.batch_number.toString();
      form.start_date = format(new Date(data.start_date), 'yyyy-MM-dd');
      form.selectedSupervisorId = data.supervisorId?.id.toString() ?? ''; 
    } catch (e) {
      error.value = "Failed to fetch batch ID"
    }
  };


  const submit = async () => {
    if (!form.selectedSupervisorId) {
      error.value = "Please select a supervisor.";
      toast.add({ title: 'Validation Error', description: error.value  });
      return;
    }

    isLoading.value = true;
    error.value = null;

 
    const endpoint = isEditMode ? '/api/batches/edit' : '/api/batches/Post-batch';
    const method = isEditMode ? 'PATCH' : 'POST';


    const body: any = {
      batch_number: form.batch_number,
      start_date: form.start_date,
      supervisorId: form.selectedSupervisorId,
      status: form.start_date > format(new Date(), 'yyyy-MM-dd') ? Status.INCOMING : Status.ONGOING,
    };
    if (isEditMode) {
      body.id = batchId; 
    }

    try {
      await $fetch(endpoint, { method, body });
      
      toast.add({
        title: `Batch ${isEditMode ? 'Updated' : 'Created'}`,
        description: `Successfully ${isEditMode ? 'updated' : 'created'} Batch ${form.batch_number}`,
      });
      
      await router.push('/batches');

    } catch (e: any) {
     const  errorMessage = e.data?.statusMessage || 'An unexpected error occurred.';
        error.value = errorMessage;
      if (e.statusCode === 409) {
        toast.add({
          title: 'Conflict Error',
          description: errorMessage ?? 'This batch number is already taken.',
        
        });
      } else {
        toast.add({
          title: 'Submission Failed',
          description: errorMessage ?? 'An unknown error occurred.',
        });
      }
    } finally {
      isLoading.value = false;
    }
  };


  Promise.all([
    fetchSupervisors(),
    loadBatchForEdit(),
  ]).finally(() => {
    isLoading.value = false;
  });

  return {
    form,
    supervisorList,
    isLoading,
    error,
    submit,
    isEditMode
  };
};