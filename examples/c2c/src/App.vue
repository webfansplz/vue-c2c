<script setup lang="ts">
import { ref } from 'vue'
import { c2c } from 'vue-c2c'
import Confirm from './components/Confirm.vue'

const useConfirm = c2c(Confirm)

const props = ref({
  content: 'Hi',
})

const { show, hide, visible, exposed } = useConfirm(props, {
  emit: {
    onCancel() {
      exposed.value?.updateCancelText()
      setTimeout(() => {
        hide()
      }, 800)
    },
    onSubmit() {
      props.value.content = 'Hello World!'
      setTimeout(() => {
        hide()
      }, 800)
    },
  },
})

function toggle() {
  visible.value ? hide() : show()
}
</script>

<template>
  <div w-screen h-screen flex items-center justify-center>
    <button w-30 h-12 text-6 rounded-2 border-1 cursor-pointer bg-white hover="bg-#f8f8f8" @click="toggle">
      Toggle
    </button>
  </div>
</template>
