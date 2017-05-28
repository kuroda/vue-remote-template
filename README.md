# vue-remote-template

A Vue.js mixin to fetch template via Ajax

[![npm version](https://badge.fury.io/js/vue-remote-template.svg)](https://badge.fury.io/js/vue-remote-template)

## Synopsis

`/app.js`

```javascript
import Vue from "vue/dist/vue.esm"
import VueRemoteTemplate from "vue-remote-template"
const MyVue = Vue.extend({ mixins: [ VueRemoteTemplate ] })

document.addEventListener("DOMContentLoaded", () => {
  new MyVue({
    el: "#app"
  )
})
```

`/index.html`

```html
<html>
<body>
  <div id="app" data-initial-template-path="/hello.html"></div>
  <script src="/app.js"></script>
</body>
</html>
```

`/hello.html`

```html
<div data-meta='{ "title": "Greeting" }' data-name='Alice'>
  <div>Hello, {{name}}!</div>
  <button type="button" @click="visit('/goodbye.html')">Click me!</button>
</div>
```

`/goodbye.html`

```html
<div data-meta='{ "title": "Farewell" }' data-name='Alice'>
  <div>Goodbye, {{name}}!</div>
  <button type="button" @click="visit('/hello.html')">Click me!</button>
</div>
```

## Demo

See https://github.com/kuroda/vue-rails-form-builder-demo.
