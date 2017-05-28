# vue-remote-template

A Vue.js mixin to fetch template via Ajax

[![npm version](https://badge.fury.io/js/vue-remote-template.svg)](https://badge.fury.io/js/vue-remote-template)

## Synopsis

`app/config/routes.rb`

```ruby
Rails.application.routes.draw do
  root 'top#index'
  get 'hello' => 'templates#hello'
  get 'goodbye' => 'templates#goodbye'
end
```

`app/controllers/templates_controller.rb`

```ruby
class TemplatesController < ApplicationController
  layout false

  def hello; end
  def goodbye; end
end
```

`app/views/top/index.html.erb`

```erb
<div id="app" data-initial-template-path="/hello"></div>

<%= javascript_pack_tag 'app' %>
```

`app/views/templates/hello.html.erb`

```erb
<div data-meta='{ "title": "Greeting" }' data-name='Alice'>
  <div>Hello, {{name}}!</div>
  <button type="button" @click="visit('/goodbye')">Click me!</button>
</div>
```

`app/views/templates/goodbye.html.erb`

```erb
<div data-meta='{ "title": "Farewell" }' data-name='Alice'>
  <div>Goodbye, {{name}}!</div>
  <button type="button" @click="visit('/hello')">Click me!</button>
</div>
```

`app/javascript/packs/app.js`

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
