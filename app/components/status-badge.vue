<template>
  <UBadge :color="badgeAppearance.color" variant="soft">
    {{ badgeAppearance.text }}
  </UBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'; 
import { Status } from '~/enum/enums'; 

const props = defineProps<{
  status: Status | string;
}>();

const badgeAppearance = computed(() => {
  switch (props.status) {
    case Status.ONGOING:
      return { color: 'success', text: 'Ongoing' } as const;
    
    case Status.COMPLETED:
      return { color: 'secondary', text: 'Completed' } as const;
      
    case Status.INCOMING:
      return { color: 'primary', text: 'Incoming' } as const;
      
    default:
      return { color: 'secondary', text: 'Unknown' } as const;
  }
});
</script>