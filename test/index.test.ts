import { expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { c2c, c2cWithTemplate } from '../src'

const Confirm = defineComponent({
  props: {
    content: String,
  },
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

it('should work w/ c2cWithTemplate', async () => {
  const useConfirm = c2cWithTemplate(Confirm)
  const props = ref({
    content: 'Hi',
  })
  const { toggle, template: Placeholder } = useConfirm(props)

  const wrapper = mount({
    render() {
      return h('div', null, [
        h(Placeholder.value, null, () => 'Hi'),
      ])
    },
  })
  expect(wrapper.text()).toBe('')
  toggle()
  await nextTick()
  expect(wrapper.text()).toBe('Hi')
  props.value.content = 'Hello'
  await nextTick()
  expect(wrapper.text()).toBe('Hello')
})
