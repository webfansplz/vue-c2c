<h1 align="center">vue-c2c</h1>

<p align="center">
<b>Transforming Vue components to composable functions</b><br/>
 (Draw UI with components, Access/Control with composables)
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue-c2c" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/npm/v/vue-c2c" alt="NPM Version" /></a>
  <a href="https://github.com/webfansplz/vue-c2c/blob/master/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/webfansplz/vue-c2c" alt="License" /></a>
</p>

<p align="center">
<a href="https://stackblitz.com/edit/vue-c2c?embed=1&file=src/App.vue"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt=""></a>
</p>


<p align="left">
  <img src="./vue-c2c.png" alt="vue-c2c" />
</p>

## When should I use this?

In certain use cases (e.g. confirm, dialog, toast), composable functions can provide greater flexibility and ease of use than components. 


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
   * Return a placeholder component that allows specifying the insertion position.
   * @default false
   */
  withPlaceholder?: T
  /**
   * Function that returns an HTMLElement where the component should be appended to.
   * Only applies if `withPlaceholder` option is false.
   * @default ()=> document.body
   */
  appendTo?: () => HTMLElement
}
```

```html
<script setup>
  import { c2c } from 'vue-c2c'
  import Dialog from './Dialog.vue'

  const useDialog = c2c(Dialog, VueC2COptions)

  const { visible, show, hide, toggle, exposed } = useDialog(props, {
    emits: {
      onOk: () => {},
      onCancel: () => {},
    } 
  })
</script>
```

#### [Example](./examples/c2c)

### `withPlaceholder` Option

`withPlaceholder` option provides two additional features: 

- Element placeholder: 

  > The element placeholder functionality allows us to specify the location of created elements in a more flexible manner.

- Friendly SSR support:
  
  > If you're working on an SSR project (e.g. Nuxt), use `c2cTemplate` for better SSR support.

```html
<script setup>
  import { c2cWithTemplate } from 'vue-c2c'
  import Dialog from './Dialog.vue'

  const useDialog = c2cWithTemplate(Dialog, {
    withPlaceholder: true,
  })

  const { Placeholder, visible, show, hide, toggle, exposed } = useDialog(props, {
    emits: {
      onOk: () => {},
      onCancel: () => {},
    } 
  })
</script>

<template>
  <Placeholder>
    Hello World
  </Placeholder>
</template>
```

#### [Example](./examples/c2c-with-placeholder)


## License

[MIT](./LICENSE) License © 2023
