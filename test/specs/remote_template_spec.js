import Vue from 'vue/dist/vue.esm'
import VueRemoteTemplate from '../../src/vue-remote-template'
import { Axios } from '../../src/vue-remote-template'
import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter';

Vue.config.productionTip = false
Vue.config.devtools = false

const mockAxios = new MockAdapter(Axios)

describe('VueRemoteTemplate', () => {
  let vm

  beforeEach(() => {
    const container = document.createElement('div')
    container.setAttribute('id', 'app')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (vm) {
      vm.$destroy(true)
      vm.$el && vm.$el.remove()
    }

    mockAxios.reset()
  })

  it('should render a basic template', (done) => {
    vm = new Vue({
      template: "<div>OK</div>",
      el: "#app"
    })

    setTimeout(() => {
      const div = document.body.querySelector('div')
      expect(div.textContent).to.eq("OK")
      done();
    }, 1);
  })

  it('should render a remote template', (done) => {
    mockAxios.onGet("/templates/1").reply(200, "<div>OK</div>")

    vm = new Vue({
      mixins: [ VueRemoteTemplate ],
      el: "#app",
      data: {
        templatePath: "/templates/1"
      }
    })

    setTimeout(() => {
      const div = document.body.querySelector('div')
      expect(div.textContent).to.eq("OK")
      done();
    }, 1);
  })

  it('should use an extension', (done) => {
    mockAxios.onGet("/templates/1").reply(200,
      "<div data-extension='greeting'>Hello, {{name}}!</div>"
    )

    vm = new Vue({
      mixins: [ VueRemoteTemplate ],
      el: "#app",
      data: {
        templatePath: "/templates/1",
        extensions: {
          greeting: {
            data: function() {
              return { name: "Alice" }
            }
          }
        }
      }
    })

    setTimeout(() => {
      const div = document.body.querySelector('div')
      expect(div.textContent).to.eq("Hello, Alice!")
      done();
    }, 1);
  })

  it('should bind form inputs to Vue.js properties', (done) => {
    mockAxios.onGet("/templates/1").reply(200,
      `
      <form>
        <input type="text" name="user[name]" v-model="user.name" value="Alice">
        <div id="user-name">name = {{user.name}}</div>
      </form>
      `
    )

    vm = new Vue({
      mixins: [ VueRemoteTemplate ],
      el: "#app",
      data: {
        templatePath: "/templates/1"
      }
    })

    setTimeout(() => {
      const div = document.getElementById("user-name")
      expect(div.textContent).to.eq("name = Alice")

      const child = vm.$children[0]
      expect(child.$data.user.name).to.eq("Alice")

      done();
    }, 1);
  })

  it('should process a method call on visit() with path', (done) => {
    mockAxios
      .onGet("/templates/1").reply(200,
        "<span @click='visit(\"/templates/2\")'>Click</span>")
      .onGet("/templates/2").reply(200, "<div>OK</div>")

    vm = new Vue({
      mixins: [ VueRemoteTemplate ],
      el: "#app",
      data: {
        templatePath: "/templates/1"
      }
    })

    setTimeout(() => {
      const link = document.body.querySelector('span')
      link.click()
    }, 1);

    setTimeout(() => {
      const div = document.body.querySelector('div')
      expect(div.textContent).to.eq("OK")
      done();
    }, 10);
  })

  it('should process a method call on visit() without path', (done) => {
    mockAxios
      .onGet("/templates/1").reply(200,
        "<a href='/templates/2' @click.prevent='visit'>Click</a>")
      .onGet("/templates/2").reply(200, "<div>OK</div>")

    vm = new Vue({
      mixins: [ VueRemoteTemplate ],
      el: "#app",
      data: {
        templatePath: "/templates/1"
      }
    })

    setTimeout(() => {
      const link = document.body.querySelector('a')
      link.click()
    }, 1);

    setTimeout(() => {
      const div = document.body.querySelector('div')
      expect(div.textContent).to.eq("OK")
      done();
    }, 10);
  })
})
