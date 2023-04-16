<script setup lang="ts">
defineProps<{ content: string }>()
</script>

<template>
  <div
    absolute left="50%" top="-15" transform translate-x="-50%"
    w-50 h-10 lh-10 bg="#f3f3f3" border-gray border-solid border-1 rounded-2
  >
    <h3 flex-1 m-0 p-0 flex items-center justify-center>
      {{ content }}
    </h3>
  </div>
</template>
