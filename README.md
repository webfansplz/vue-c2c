# vue-c2c
Transforming Vue components to composable functions.


## Install

```bash
npm i vue-c2c
```

## Usage

### c2c

#### Options

```ts
interface VueC2COptions {
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
```

```html
<script setup>
  import { c2c } from 'vue-c2c'
  import Dialog from './Dialog.vue'

  const useDialog = c2c(Dialog)

  const { visible, show, hide } = useDialog(props)
</script>
```

### c2cWithTemplate

```ts
interface VueC2CWithTemplateOptions {
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
```

```html
<script setup>
  import { c2cWithTemplate } from 'vue-c2c'
  import Dialog from './Dialog.vue'

  const useDialog = c2cWithTemplate(Dialog)

  const { template: Placeholder, visible, show, hide } = useDialog(props)
</script>

<template>
  <Placeholder>
    Hello World
  </Placeholder>
</template>
```
