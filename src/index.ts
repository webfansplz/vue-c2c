import { createCommentVNode, createVNode, defineComponent, ref, render, shallowRef, unref, vShow, watch, withDirectives } from 'vue'
import type { Ref } from 'vue'

type MaybeRef<T> = T | Ref<T>

type ComponentPropTypes<T extends abstract new (...args: any) => any> = MaybeRef<InstanceType<T>['$props']>

export interface VueC2COptions {
  /**
   * Display style of the component.
   * @default 'v-if'
   */
  display?: 'v-if' | 'v-show'
  /**
   * Display style of the component.
   * @default false
   */
  visible?: boolean
  /**
   * Function that returns an HTMLElement where the component should be appended to.
   * @default ()=> document.body
   */
  appendTo?: () => HTMLElement
}

export interface VueC2CWithTemplateOptions {
  /**
   * Display style of the component.
   * @default 'v-if'
   */
  display?: 'v-if' | 'v-show'
  /**
   * Display style of the component.
   * @default true
   */
  visible?: boolean
}

export function c2cWithTemplate<T extends abstract new (...args: any) => any>(componentConstructor: T, options: VueC2CWithTemplateOptions = {}) {
  const {
    display = 'v-if',
  } = options
  function composable(props: ComponentPropTypes<T> = {}) {
    const template = shallowRef()
    const visible = ref(options.visible ?? true)

    if (display === 'v-if') {
      template.value = defineComponent({
        setup(_, { slots }) {
          return () => {
            const vnode = visible.value ? createVNode(componentConstructor as ComponentPropTypes<T>, unref(props), slots) : createCommentVNode('v-if', true)
            return [vnode]
          }
        },
      })
    }
    else {
      template.value = defineComponent({
        setup(_, { slots }) {
          return () => {
            const vnode = createVNode(componentConstructor as ComponentPropTypes<T>, unref(props), slots)
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

    return {
      visible,
      show,
      hide,
      template,
    }
  }
  return composable
}

export function c2c<T extends abstract new (...args: any) => any>(componentConstructor: T, options: VueC2COptions = {}) {
  const {
    appendTo = () => document.body,
    display = 'v-if',
  } = options

  const isClient = typeof window !== 'undefined'

  function composable(props: ComponentPropTypes<T> = {}) {
    const container = ref<Element | null>(null)
    const mounted = ref(false)
    const visible = ref(options.visible ?? false)

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
      container.value = document.createDocumentFragment() as unknown as Element
      const vnode = createVNode(componentConstructor as ComponentPropTypes<T>, unref(props))
      render(vnode, container.value!)
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
        container.value!.style.display = 'unset'
    }

    function _hide() {
      visible.value = false
      container.value!.style.display = 'none'
    }

    watch(() => unref(props), () => {
      mounted.value && _destroy()
      _toggle(visible.value)
    }, {
      deep: true,
    })

    return {
      visible,
      show: () => _toggle(true),
      hide: () => _toggle(false),
    }
  }
  return composable
}
