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
// app.js
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

The above code fetches an HTML fragment from `/hello` via Ajax.
We call this _remote template_.
Remote templates are compiled into Vue templates, and are used
to construct a DOM tree onto the target`<div>` element.

## Form Input Bindings

When a remote template is fetched, a Vue component gets created dynamically.

And if the remote templates contain `v-model` directives,
the component's data is initialized using the `getInitialData` function
of [vue-data-scooper](https://www.npmjs.com/package/vue-data-scooper) package.

```html
<form>
  <input type="text" name="user[name]" v-model="user.name" value="Alice">
</form>
```

The above remote template sets the component's `user.name` property to the
string "Alice".

## Extensions

If you want to initialize the component's properties that are not bound to
a input via `v-model` directive,
you must provide an _extension_.

```javascript
// hello_extension.js
export const helloExtension = {
  data: function() {
    return {
      name: "Alice"
    }
  }
}
```

An extension is a _mixin_ to be used when the component is created.

You can register extensions to the `extensions` property.

```javascript
// app.js
import Vue from "vue/dist/vue.esm"
import VueRemoteTemplate from "vue-remote-template"
import { helloExtension } from "./hello_extension"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    mixins: [ VueRemoteTemplate ],
    el: "#app",
    data: {
      templatePath: "/hello",
      extensions: {
        hello: helloExtension
      }
    }
  )
})
```

The name of extension must be specified by the `data-extension` attribute of
the root element of remote template:

```html
<div data-extension="hello">
  <div>Hello, {{name}}!</div>
</div>
```

The above template produces the following HTML fragment:

```html
<div data-extension="hello">
  <div>Hello, Alice!</div>
</div>
```

## Demo

See https://github.com/kuroda/vue-rails-form-builder-demo.
