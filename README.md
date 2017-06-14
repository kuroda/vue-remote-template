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
  })
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

## Initial Data

The response date from the backend server can be a string or a JSON data.

In the former case, the string will be interpreted as the remote template.

In the latter case, the JSON data should have `template` key and optional `data` key.
The value of `template` key will be interpreted as the remote template.
The value of `data` key will be used as the initial data of Vue component.

For example, when the server returns the following JSON data:

```json
{
  "template": "<div>{{ message }}</div>",
  "data": { "message": "Hello, world!" }
}
```

Then, the resultant HTML fragment will be `<div>Hello, world!</div>`.

Note that the initial data provided by the JSON data from the server overwrites
the data set by the `v-model` directives.

## Extensions

If you want to initialize the component's properties that are not bound to
a input via `v-model` directive,
you must provide an _extension_.

```javascript
// greeting.js
export const greeting = {
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
import { greeting } from "./greeting"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    mixins: [ VueRemoteTemplate ],
    el: "#app",
    data: {
      templatePath: "/hello",
      extensions: {
        greeting: greeting
      }
    }
  })
})
```

The name of extension must be specified by the `data-extension` attribute of
the root element of remote template:

```html
<div data-extension="greeting">
  <div>Hello, {{name}}!</div>
</div>
```

The above template produces the following HTML fragment:

```html
<div data-extension="greeting">
  <div>Hello, Alice!</div>
</div>
```

## `visit` method

You can call the `visit` method to switch the remote template.

```html
<div>
  <button type="button" @click="visit('/goodbye')">Click me!</button>
</div>
```

When the user clicks on this button on the browser,
an Ajax access to `/goodbye` is executed and a remote template gets fetched.

If a newly fetched template's root element has the `data-title` attribute,
its value is set to the document title.

And, a newly fetched template's root element has the `data-url` attribute,
its value is used to add an entry to the browser's history using
[window.history.pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method) method.

Here is an example of remote template:

```html
<div data-extension="greeting" data-title="Farewell" data-url="/bye">
  <div>Goodbye, {{name}}!</div>
</div>
```

If you use the `visit` method on an `a` element, you can omit argument to the method.
The `href` value of the `a` element is interpreted as the remote template path.

```html
<div>
  <a href="/goodbye" @click.prevent="visit">Click me!</a>
</div>
```

Note that you must _prevent_ the default action so that the browser does not
visit the specified path actually.

## `submit` method

You can call the `submit` method to submit form data via Ajax call.

```html
<form action="/users/123" method="post" @submit.prevent="submit">
  <input type="hidden" name="_method" value="patch">
  <input type="text" name="user[name]" v-model="user.name" value="Alice">
  <input type="submit" value="Update">
</form>
```

When the user clicks on the "Update" button, an Ajax request via `PATCH` method
is submitted to the `/users/123`.

If the server returns a text, it is used as remote template to show the result.
If the server returns a JSON object, it must contain the `templatePath` key,
whose value is used to make another Ajax request in order to fetch a remote template.

Note that the `submit` method must be called on the `<form>` element.
You cannot call it on the elements within a form.

Also note that the _method_ of Ajax call is determined by the value of a
hidden element whose name is `_method`.

## Demo

See https://github.com/kuroda/vue-rails-form-builder-demo.

## Development Setup

```bash
# install dependencies
yarn install

# test
yarn test
```

You need the Google Chrome version 59 or higher to run test.
If you use `google-chrome-beta`, export `CHROME_BIN` environment variable:

```bash
export CHROME_BIN=$(which google-chrome-beta)
```

## Building for distribution

```bash
yarn build
```
