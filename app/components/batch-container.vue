<script setup lang="ts">
import ViewButtom from '~/composables/view-buttom.vue';

</script>

<template>
    <div class="batchCard">
        <div class="card-header">
        <h3 class="batchNo">batch Number and Status
            <ViewButtom/>
        </h3>
        </div>
        <div class="card-details">
            <h4>No. of interns</h4>
            <h4>Started</h4>
        </div>
        
    </div>
    <!--contents of the layout slot-->
    <slot/>
</template>


