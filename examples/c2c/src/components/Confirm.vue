<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ content: string }>()
const emits = defineEmits(['cancel', 'submit'])
const cancelText = ref('')
defineExpose({
  updateCancelText() {
    cancelText.value = '~'
  },
})
</script>

<template>
  <div w-full h-full flex items-center justify-center fixed left-0 top-0 bottom-0 bg-black bg-opacity-60>
    <div
      w-60 h-30 bg-white border-gray border-solid border-1 rounded-2 relative overflow-hidden flex flex-col select-none
    >
      <h3 flex-1 m-0 p-0 flex items-center justify-center>
        {{ content }}
      </h3>
      <footer h-8 flex w-full border-0 border-t border-solid border="#f5f5f5">
        <button flex-1 border-0 bg-white hover="bg-#f8f8f8" cursor-pointer @click.self="emits('cancel')">
          取消 {{ cancelText }}
        </button>
        <button flex-1 border-0 bg-white hover="bg-#f8f8f8" cursor-pointer @click.self="emits('submit')">
          确定
        </button>
      </footer>
    </div>
  </div>
</template>
