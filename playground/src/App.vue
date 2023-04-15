<script setup lang="ts">
import { ref } from 'vue'
import { c2c } from '../../src'
import Dialog from './components/Dialog.vue'

// const useDialog = c2c(Dialog)

// const { mounted, mount, destroy, template: Placeholder, show, hide, visible } = useDialog()

// const useDialog = c2cWithTemplate(Dialog, { display: 'v-show' })

const useDialog = c2c(Dialog)

const p = ref({
  content: 'Hi',
  color: 'red',
})

// const { template: Placeholder, show, hide, visible } = useDialog(p)

const { show, hide, visible } = useDialog(p)

function toggle() {
  visible.value ? hide() : show()
  setTimeout(() => {
    p.value.content = 'World'
    p.value.color = 'blue'
  }, 3000)
}
</script>

<template>
  <!-- <Placeholder>
    444
    <template #title>
      Title
    </template>
  </Placeholder> -->
  <div @click="toggle">
    123
  </div>
</template>
