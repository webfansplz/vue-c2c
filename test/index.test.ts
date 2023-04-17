import { expect, expectTypeOf, it } from 'vitest'
import type { Ref } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { c2c } from '../src'

const Confirm = defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props) {
    return () => h('div', null, props.content)
  },
})

it('should work', () => {
  const useConfirm = c2c(Confirm)
  const props = ref({
    content: 'Hi',
  })

  const { visible, toggle } = useConfirm(props)

  expect(visible.value).toBe(false)
  toggle()
  expect(visible.value).toBe(true)
})

it('should work w/ withPlaceholder option', async () => {
  const useConfirm = c2c(Confirm, {
    withPlaceholder: true,
  })
  const props = ref({
    content: 'Hi',
  })
  const { toggle, Placeholder } = useConfirm(props, {
    emits: {
      onSubmit: () => { },
    },
  })

  const wrapper = mount({
    render() {
      return h('div', null, [
        h(Placeholder.value, null, () => 'Hi'),
      ])
    },
  })

  expectTypeOf(useConfirm).parameter(0).toEqualTypeOf<({
    content: string
  } | Ref<{
    content: string
  }> | undefined)>()

  expect(wrapper.text()).toBe('')
  toggle()
  await nextTick()
  expect(wrapper.text()).toBe('Hi')
  props.value.content = 'Hello'
  await nextTick()
  expect(wrapper.text()).toBe('Hello')
})
