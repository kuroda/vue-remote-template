import Vue from "vue/dist/vue.esm"
import Axios from "axios"
import serialize from "form-serialize"
import { getInitialData } from "vue-data-scooper"

Vue.config.productionTip = false

function processTemplate(vm, template) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(template, "text/html")
  const root = doc.querySelector("body > *")
  const metadata = root.dataset.meta ?
    JSON.parse(root.dataset.meta) : {}

  if (metadata.url) {
    if (vm.parsedTemplate)
      window.history.pushState({ templatePath: vm.templatePath }, "", metadata.url)
    else
      window.history.replaceState({ templatePath: vm.templatePath }, "", metadata.url)
  }
  if (metadata.title)
    window.document.title = metadata.title

  vm.handlerName = metadata.handler
  vm.parsedTemplate = root
}

function fetchTemplate(vm) {
  Axios.get(vm.templatePath)
    .then(function(response) {
      processTemplate(vm, response.data)
    })
    .catch(function(error) {
      console.log(error)
    })
}

const VueRemoteTemplate = {
  render: function(h) {
    return h(this.dynamicComponent)
  },
  data: function() {
    const root = document.querySelector(this.$options.el)
    return {
      parsedTemplate: undefined,
      templatePath: undefined,
      handlerName: undefined
    }
  },
  watch: {
    templatePath: function() {
      if (this.templatePath) fetchTemplate(this)
    }
  },
  computed: {
    dynamicComponent: function() {
      if (this.parsedTemplate) {
        const self = this
        const base = {
          template: self.parsedTemplate.outerHTML,
          data: function() {
            return Object.assign({}, self.initialData)
          },
          methods: {
            visit: function(templatePath) {
              self.templatePath = templatePath
            },
            submit: function(event) {
              const formData = serialize(event.target, { hash: true })
              const method = formData["_method"] ||
                event.target.getAttribute("method")
              const config = {
                method: method,
                url: event.target.getAttribute("action"),
                data: formData
              }
              Axios.request(config)
                .then(function(response) {
                  if (typeof response.data === "string")
                    processTemplate(self, response.data)
                  else
                    self.templatePath = response.data.templatePath
                })
                .catch(function(error) {
                  console.log(error)
                })
            }
          }
        }
        if (this.handlerName)
          return Vue.extend({ mixins: [ base, this.handlers[this.handlerName] ] })
        else
          return Vue.extend({ mixins: [ base ] })
      }
      else {
        return ""
      }
    },
    initialData: function() {
      return getInitialData(this.parsedTemplate)
    }
  },
  mounted: function() {
    const self = this

    window.onpopstate = function(event) {
      if (event.state && event.state.templatePath)
        self.templatePath = event.state.templatePath
    }

    if (self.templatePath) fetchTemplate(self)
  }
}

export default VueRemoteTemplate
