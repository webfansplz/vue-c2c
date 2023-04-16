import { createCommentVNode, createVNode, defineComponent, nextTick, ref, render, shallowRef, unref, vShow, watch, withDirectives } from 'vue'
import type {
  ComponentPropTypes,
  ComponentType,
  VueC2CComponent,
  VueC2CComposableOptions,
  VueC2CFunctionalComponent,
  VueC2COptions,
  VueC2CReturn,
} from './type'

export type { VueC2COptions, VueC2CReturn } from './type'

// overloads
export function c2c<T extends VueC2CFunctionalComponent>(componentConstructor: T, options?: VueC2COptions<false>): VueC2CReturn<T, false>
export function c2c<T extends VueC2CComponent>(componentConstructor: T, options?: VueC2COptions<false>): VueC2CReturn<T, false>
export function c2c<T extends VueC2CFunctionalComponent>(componentConstructor: T, options?: VueC2COptions<true>): VueC2CReturn<T, true>
export function c2c<T extends VueC2CComponent>(componentConstructor: T, options?: VueC2COptions<true>): VueC2CReturn<T, true>

// implementation
export function c2c<T extends ComponentType>(componentConstructor: T, options?: VueC2COptions<boolean>): VueC2CReturn<T, boolean> {
  return options?.withPlaceholder ? _c2cWithComponent(componentConstructor, options as VueC2COptions<true>) : _c2c(componentConstructor, options as VueC2COptions<false>)
}

function _c2c<T extends ComponentType>(componentConstructor: T, options: VueC2COptions<false> = {}): VueC2CReturn<T, boolean> {
  const {
    appendTo = () => document.body,
    display = 'v-if',
  } = options

  const isClient = typeof window !== 'undefined'

  function composable(props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) {
    const container = ref<HTMLElement | null>(null)
    const mounted = ref(false)
    const visible = ref(options.visible ?? false)
    const exposed = ref()
    const ele = ref<HTMLElement | null>(null)
    const displayStyle = ref('unset')

    if (visible.value && isClient)
      _toggle(true)

    function _toggle(state: boolean) {
      visible.value = state
      if (display === 'v-if')
        state ? _mount() : _destroy()

      else
        state ? _show() : _hide()
    }

    function _mount() {
      container.value = document.createDocumentFragment() as unknown as HTMLElement
      // Providing an 'emits' option for better callability makes sense, even if it already exists in props.
      const vnode = createVNode(componentConstructor as ComponentPropTypes<T>, { ...unref(props), ...opt?.emits })
      render(vnode, container.value!)
      ele.value = vnode.el as HTMLElement
      exposed.value = vnode.component?.exposed ?? {}
      appendTo().appendChild(container.value!)
      mounted.value = true
    }

    function _destroy() {
      render(null, container.value!)
      container.value!.parentNode?.removeChild(container.value!)
      mounted.value = false
    }

    function _show() {
      if (!mounted.value)
        _mount()

      else
        ele.value!.style.display = displayStyle.value
    }

    function _hide() {
      visible.value = false
      displayStyle.value = ele.value?.style?.display ?? 'unset'
      ele.value!.style.display = 'none'
    }

    watch(() => unref(props), () => {
      mounted.value && _destroy()
      _toggle(visible.value)
    }, {
      deep: true,
    })

    return {
      exposed,
      visible,
      toggle: () => _toggle(!visible.value),
      show: () => _toggle(true),
      hide: () => _toggle(false),
    }
  }
  return composable
}

function _c2cWithComponent<T extends ComponentType>(componentConstructor: T, options: VueC2COptions<true> = {}): VueC2CReturn<T, boolean> {
  const {
    display = 'v-if',
  } = options

  function composable(props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) {
    const Placeholder = shallowRef()
    const visible = ref(options.visible ?? false)
    const exposed = ref()

    if (display === 'v-if') {
      Placeholder.value = defineComponent({
        setup(_, { slots }) {
          return () => {
            // Providing an 'emits' option for better callability makes sense, even if it already exists in props.
            const vnode = visible.value ? createVNode(componentConstructor as ComponentPropTypes<T>, { ...unref(props), ...opt?.emits }, slots) : createCommentVNode('v-if', true)
            nextTick(() => {
              exposed.value = vnode.component?.exposed ?? {}
            })
            return [vnode]
          }
        },
      })
    }
    else {
      Placeholder.value = defineComponent({
        setup(_, { slots }) {
          return () => {
            const vnode = createVNode(componentConstructor as ComponentPropTypes<T>, { ...unref(props), ...opt?.emits }, slots)
            nextTick(() => {
              exposed.value = vnode.component?.exposed ?? {}
            })
            return withDirectives(vnode, [
              [vShow, visible.value],
            ])
          }
        },
      })
    }

    function show() {
      visible.value = true
    }

    function hide() {
      visible.value = false
    }

    function toggle() {
      visible.value = !visible.value
    }

    return {
      exposed,
      visible,
      show,
      hide,
      toggle,
      Placeholder,
    }
  }
  return composable
}
