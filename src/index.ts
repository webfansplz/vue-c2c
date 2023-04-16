import { createCommentVNode, createVNode, defineComponent, nextTick, ref, render, shallowRef, unref, vShow, watch, withDirectives } from 'vue'
import type { FunctionalComponent, Ref, ShallowRef } from 'vue'

export function c2c<T extends FunctionalComponent<any>>(componentConstructor: T, options?: VueC2COptions): VueC2CReturn<T>
export function c2c<T extends abstract new (...args: any) => any>(componentConstructor: T, options?: VueC2COptions): VueC2CReturn<T>
export function c2c<T extends ComponentType>(componentConstructor: T, options: VueC2COptions = {}): VueC2CReturn<T> {
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

export function c2cWithTemplate<T extends FunctionalComponent<any>>(componentConstructor: T, options?: VueC2COptions): VueC2CWithTemplateCReturn<T>
export function c2cWithTemplate<T extends abstract new (...args: any) => any>(componentConstructor: T, options?: VueC2COptions): VueC2CWithTemplateCReturn<T>
export function c2cWithTemplate<T extends ComponentType>(componentConstructor: T, options: VueC2CWithTemplateOptions = {}): VueC2CWithTemplateCReturn<T> {
  const {
    display = 'v-if',
  } = options

  function composable(props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) {
    const template = shallowRef()
    const visible = ref(options.visible ?? false)
    const exposed = ref()

    if (display === 'v-if') {
      template.value = defineComponent({
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
      template.value = defineComponent({
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
      template,
    }
  }
  return composable
}

interface VueC2CBaseOptions {
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
}

export interface VueC2COptions extends VueC2CBaseOptions {

  /**
   * Function that returns an HTMLElement where the component should be appended to.
   * @default ()=> document.body
   */
  appendTo?: () => HTMLElement
}

export interface VueC2CWithTemplateOptions extends VueC2CBaseOptions { }

export interface VueC2CComposableReturn {
  exposed: Ref<any>
  visible: Ref<boolean>
  show: () => void
  hide: () => void
  toggle: () => void
}

type MaybeRef<T> = T | Ref<T>

type ComponentType = ((abstract new (...args: any) => any) | FunctionalComponent<any>)

type ComponentEmitTypes<T extends Record<any, any>> = {
  [K in keyof T as K extends `on${Capitalize<infer P>}` ? K : never]: T[K] extends Record<any, any> ? ComponentEmitTypes<T[K]> : T[K]
}

type ComponentPropTypes<T extends ComponentType> =
  T extends abstract new (...args: any) => any ? MaybeRef<InstanceType<T>['$props']> : T extends FunctionalComponent<infer P> ? P : Record<any, any>

export interface VueC2CComposableOptions<T extends ComponentType> {
  emits?: ComponentEmitTypes<T extends abstract new (...args: any) => any ? InstanceType<T>['$props'] : T extends FunctionalComponent<infer P> ? P : Record<any, any>>
}

export type VueC2CReturn<T extends ComponentType> = (props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) => VueC2CComposableReturn

export type VueC2CWithTemplateCReturn<T extends ComponentType> = (props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) => VueC2CComposableReturn & { template: ShallowRef<any> }
