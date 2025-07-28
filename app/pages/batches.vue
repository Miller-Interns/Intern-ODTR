<template>
    <h1>Manage</h1>
    <BatchContainer/>
    <NuxtLink to="/createBatch"><button>
Create Batch
    </button></NuxtLink>
    <h1> Previous Batches</h1>
    <PreviousBatch/>
</template>
<script>
import { NuxtLink } from '#components';
import BatchContainer from '~/components/batch-container.vue';
import PreviousBatch from '~/components/previous-batch.vue';



definePageMeta({
    path:'/',
    layout:'batch'
})
</script>


