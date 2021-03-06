import Vue from "vue/dist/vue.esm"
import Axios from "axios"
import serialize from "form-serialize"
import { getInitialData } from "vue-data-scooper"

Vue.config.productionTip = false
Vue.config.devtools = false

function processTemplate(vm, response_data) {
  const template = typeof response_data === "string" ?
    response_data : response_data.template
  const parser = new DOMParser()
  const doc = parser.parseFromString(template, "text/html")
  const root = doc.querySelector("body > *")
  const metadata = root.dataset || {}

  if (metadata.url) {
    if (vm.parsedTemplate)
      window.history.pushState({ templatePath: vm.templatePath }, "", metadata.url)
    else
      window.history.replaceState({ templatePath: vm.templatePath }, "", metadata.url)
  }
  if (metadata.title)
    window.document.title = metadata.title

  vm.extensionName = metadata.extension
  vm.parsedTemplate = root
  vm.additionalData = response_data.data ? response_data.data : {}
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
      extensionName: undefined,
      extensions: {},
      additionalData: {}
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
            visit: function(arg) {
              if (arg instanceof Event)
                self.templatePath = arg.target.getAttribute("href")
              else if (typeof arg === "string")
                self.templatePath = arg
              else
                throw "The argument of visit() must be an event or a string."
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
                  else if (response.data.template)
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

        let mixins = [ base ]
        if (this.extensionName) mixins.push(this.extensions[this.extensionName])
        return Vue.extend({ mixins: mixins })
      }
      else {
        return ""
      }
    },
    initialData: function() {
      const data = getInitialData(this.parsedTemplate)
      Object.assign(data, this.additionalData)
      return data
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

// For test
export { Axios }

export default VueRemoteTemplate
