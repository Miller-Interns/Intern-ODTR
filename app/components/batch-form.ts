
import type { BatchWithInternCount, Batch } from '~/types/Types';
import { format, parse, isValid } from 'date-fns'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'


export const useBatchForm = (batchId?: string) => {
  const submitted = ref(false)
  const router = useRouter();
  const toast = useToast();
  const form = reactive({
    batch_number: '',
    start_date: format(new Date(), 'MM/dd/yyyy'),
    selectedSupervisorId: '',

  });

  const supervisorList = ref<{ label: string; value: string; icon: string}[]>([]);
  const isLoading = ref(true);
  const error = ref({
    message: null as string | null
  });

  const isEditMode = !!batchId;



const calendarDate = computed({
  get: () => {
    if (!form.start_date) {
      return undefined;
    }
    const jsDate = parse(form.start_date, 'MM/dd/yyyy', new Date());
    if (!isValid(jsDate)) {
      return undefined;
    }
    
    return new CalendarDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
  },

  set: (value) => {
    if (value) {
      const jsDate = value.toDate(getLocalTimeZone());
      form.start_date = format(jsDate, 'MM/dd/yyyy');
    }
  }
});

  const fetchSupervisors = async () => {
    try {
      const rawData = await $fetch<{ id: string; name: string | null }[]>('/api/batches/admin',{
           query: {
        isAdmin: true
      }
    });
      if (Array.isArray(rawData)) {
        supervisorList.value = rawData.map(user => ({
          label: user.name || 'Unnamed Supervisor',
          value: String(user.id),
          icon: 'i-lucide-circle-user'
          
        }));
      }
    } catch (e) {
           error.value.message = 'Failed to load supervisors.';
    }
  };


  const loadBatchForEdit = async () => {
    if (!isEditMode) return;
    try {
      const data = await $fetch<Batch>('/api/batches/single', {
        query: { id: batchId },
      });
    
      form.batch_number = data.batch_number.toString();
      form.start_date = format(new Date(data.start_date),'MM/dd/yyyy');
      form.selectedSupervisorId = data.supervisorId.toString() ?? ''; 
    } catch (e) {
    error.value.message = "Failed to fetch batch ID";
    }
  };
   

const supervisorError=computed(()=>{
 if (!form.selectedSupervisorId && submitted.value) {
      return "Please select a supervisor.";
    }
    return undefined

})

const batchNumberError= computed(()=>{
if (!form.batch_number && submitted.value) {
      return"Please input batch number.";
    }


})
     
const startDateError =computed(()=>{
 if (!form.start_date && submitted.value) {
      return "Please input start date.";

    }
  })

       
  const submit = async () => {


    isLoading.value = true;
       error.value.message = null; 
    submitted.value = true

    const endpoint = isEditMode ? '/api/batches/edit' : '/api/batches/Post-batch';
    const method = isEditMode ? 'PATCH' : 'POST';


    const body: any = {
      batch_number: form.batch_number,
      start_date: form.start_date,
      supervisorId: form.selectedSupervisorId,
      status: form.start_date > format(new Date(), 'MM/dd/yyyy') ? Status.INCOMING : Status.ONGOING,
    };
    if (isEditMode) {
      body.id = batchId; 
    }

    try {
      await $fetch(endpoint, { method, body });
      
      toast.add({
        description: `Batch ${form.batch_number} ${isEditMode ? 'updated' : 'added'} successfully`,
      });
      
      await router.push('/admin/batches');

    } catch (e: any) {
  const errorMessage = e.data?.statusMessage || 'An unexpected error occurred.';
   error.value.message = errorMessage;
  if (e.statusCode === 409) {
    error.value.message = errorMessage;
  } else {
    error.value.message = errorMessage;
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

    supervisorError,
    batchNumberError,
    startDateError,
    form,
    calendarDate,
    supervisorList,
    isLoading,
    error,
    submit,
    isEditMode
  };
};