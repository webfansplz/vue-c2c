<script setup lang="ts">
import { ref } from 'vue'
import { c2c } from 'vue-c2c'
import Tooltip from './components/Tooltip.vue'

const useTooltip = c2c(Tooltip, {
  withComponent: true,
})

const props = ref({
  content: 'Hi',
})

const { show, hide, toggle, visible, VComponent } = useTooltip(props)

// function toggle() {
//   visible.value ? hide() : show()
// }
</script>

<template>
  <div w-screen h-screen flex items-center justify-center>
    <button relative w-35 h-12 text-6 rounded-2 border-1 cursor-pointer bg-white hover="bg-#f8f8f8" @mouseenter="toggle" @mouseleave="toggle">
      <VComponent />
      Hover Me
    </button>
  </div>
</template>
