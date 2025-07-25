<template>
    <h1>Manage</h1>
    <BatchContainer/>
    <h1> Previous Batches</h1>
    <PreviousBatch/>
</template>
<script>
import BatchContainer from '~/components/batch-container.vue';
import PreviousBatch from '~/components/previous-batch.vue';


definePageMeta({
    path:'/',
    layout:'batch'
})
</script>


