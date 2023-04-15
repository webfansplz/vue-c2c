<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ content?: string;color: string }>()
const emits = defineEmits(['update'])
const color = computed(() => props.color ?? 'red')
</script>

<template>
  <div w-100 h-100 bg-white flex-center inline-block>
    {{ content ?? 'Hi' }}
    <slot />
    <h3 @click="emits('update', 1)">
      <slot name="title" />
    </h3>
  </div>
</template>

<style>
div {
  color: v-bind(color);
}
</style>
