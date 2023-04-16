import type { FunctionalComponent, Ref, ShallowRef } from 'vue'

type MaybeRef<T> = T | Ref<T>
export type VueC2CFunctionalComponent = FunctionalComponent<any, any>
export type VueC2CComponent = (abstract new (...args: any) => any)
export type ComponentType = VueC2CComponent | VueC2CFunctionalComponent
type FunctionalComponentPropTypes<T> = T extends FunctionalComponent<infer P> ? P : Record<any, any>
type ComponentEmitTypes<T extends Record<any, any>> = {
  [K in keyof T as K extends `on${Capitalize<infer P>}` ? K : never]: T[K] extends Record<any, any> ? ComponentEmitTypes<T[K]> : T[K]
}
export type ComponentPropTypes<T extends ComponentType> =
  T extends VueC2CComponent ? MaybeRef<InstanceType<T>['$props']> : FunctionalComponentPropTypes<T>

export interface VueC2CComposableReturn {
  exposed: Ref<any>
  visible: Ref<boolean>
  show: () => void
  hide: () => void
  toggle: () => void
}
export interface VueC2CComposableOptions<T extends ComponentType> {
  emits?: ComponentEmitTypes<T extends VueC2CComponent ? InstanceType<T>['$props'] : FunctionalComponentPropTypes<T>>
}

export type VueC2COptions<T> = {
  /**
   * Display style of the component.
   * @default 'v-if'
   */
  display?: 'v-if' | 'v-show'
  /**
   * Visible of the component.
   * @default false
   */
  visible?: boolean
  /**
   * Return a placeholder component that allows specifying the insertion position.
   * @default false
   */
  withPlaceholder?: T
} & (T extends false ? {
  /**
   * Function that returns an HTMLElement where the component should be appended to.
   * @default ()=> document.body
   */
  appendTo?: () => HTMLElement
} : {})

export type VueC2CReturn<T extends ComponentType, PLACEHOLDER> = (props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) => VueC2CComposableReturn & (PLACEHOLDER extends true ? { Placeholder: ShallowRef<any> } : {})
