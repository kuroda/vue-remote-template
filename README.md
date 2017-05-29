# vue-remote-template

A Vue.js mixin to fetch template via Ajax

[![npm version](https://badge.fury.io/js/vue-remote-template.svg)](https://badge.fury.io/js/vue-remote-template)

## Synopsis

```html
<html>
  <body>
    <div id="app"></div>
    <script src="/app.js"></script>
  </body>
</html>
```

```javascript
// app.jp
import Vue from "vue/dist/vue.esm"
import VueRemoteTemplate from "vue-remote-template"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    mixins: [ VueRemoteTemplate ],
    el: "#app",
    data: {
      templatePath: "/hello"
    }
  )
})
```

The above code fetches an HTML fragment from `/hello` via Ajax,
compiles it into a Vue template, and constructs a DOM tree onto the target
`<div>` element.

## Demo

See https://github.com/kuroda/vue-rails-form-builder-demo.
