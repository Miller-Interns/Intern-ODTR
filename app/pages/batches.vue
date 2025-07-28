<template>
    <h1>Manage</h1>
    <ShowBatch/>
    <NuxtLink to="/createBatch"><button>
Create Batch
    </button></NuxtLink>
</template>
<script>
import { NuxtLink } from '#components';
import ShowBatch from '~/components/show-batch.vue';




definePageMeta({
    path:'/',
    layout:'batch'
})
</script>


