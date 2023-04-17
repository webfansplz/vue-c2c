import type { DefineComponent, ExtractPropTypes, FunctionalComponent, Ref, ShallowRef } from 'vue'

type MaybeRef<T> = T | Ref<T>
export type VueC2CFunctionalComponent = FunctionalComponent<any, any>
export type ComponentConstructor = (abstract new (...args: any) => any)
export type ComponentType = ComponentConstructor | VueC2CFunctionalComponent
type FunctionalComponentPropTypes<T> = T extends FunctionalComponent<infer P> ? P : Record<any, any>
type FunctionalComponentEmitTypes<T extends Record<any, any>> = {
  [K in keyof T as K extends `on${Capitalize<infer P>}` ? K : never]: T[K] extends Record<any, any> ? FunctionalComponentEmitTypes<T[K]> : T[K]
}
type ComponentEmitTypes<T extends (event: any, ...args: any[]) => void> = T extends (event: infer R, ...args: any[]) => void ? (R extends string ? {
  [K in R as `on${Capitalize<K>}`]: (...args: any[]) => void
} : Record<any, any>) : Record<any, any>
export type ComponentPropTypes<T extends ComponentType> =
  T extends ComponentConstructor ? (T extends DefineComponent<infer P, any, any> ? MaybeRef<ExtractPropTypes<P>> : MaybeRef<InstanceType<T>['$props']>) : FunctionalComponentPropTypes<T>

export interface VueC2CComposableReturn<T extends ComponentType> {
  exposed: Ref<T extends DefineComponent<infer P, infer EXPOSE, any> ? EXPOSE : {}>
  visible: Ref<boolean>
  show: () => void
  hide: () => void
  toggle: () => void
}
export interface VueC2CComposableOptions<T extends ComponentType> {
  emits?: T extends ComponentConstructor ? ComponentEmitTypes<InstanceType<T>['$emit']> : FunctionalComponentEmitTypes<FunctionalComponentPropTypes<T>>
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

export type VueC2CReturn<T extends ComponentType, PLACEHOLDER> = (props?: ComponentPropTypes<T>, opt?: VueC2CComposableOptions<T>) => VueC2CComposableReturn<T> & (PLACEHOLDER extends true ? { Placeholder: ShallowRef<any> } : {})
