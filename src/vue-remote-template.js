import Vue from "vue/dist/vue.esm"
import Axios from "axios"
import { getInitialData } from "vue-data-scooper"

Vue.config.productionTip = false

function parseTemplate(template) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(template, "text/html")
  return doc.querySelector("body > *")
}

const VueRemoteTemplate = {
  render: function(h) {
    return h(this.dynamicComponent)
  },
  data: function() {
    const root = document.querySelector(this.$options.el)
    return {
      parsedTemplate: undefined,
      handlerName: undefined,
      path: undefined,
      initialPath: root.dataset.initialPath
    }
  },
  watch: {
    path: function(val, _oldVal) {
      let self = this
      Axios.get(val)
        .then(function(response) {
          const root = parseTemplate(response.data)
          const metadata = root.dataset.meta ?
            JSON.parse(root.dataset.meta) : {}

          if (metadata.url)
            window.history.pushState({ path: self.path }, "", metadata.url)
          if (metadata.title)
            window.document.title = metadata.title

          self.handlerName = metadata.handler
          self.parsedTemplate = root
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  computed: {
    dynamicComponent: function() {
      if (this.parsedTemplate) {
        let self = this
        const base = {
          template: self.parsedTemplate.outerHTML,
          data: function() {
            return Object.assign({}, self.initialData)
          },
          methods: {
            visit: function(templatePath) {
              self.path = templatePath
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

    self.path = self.initialPath
    self.handlerName = self.initialHandlerName

    window.onpopstate = function(event) {
      if (event.state && event.state.path)
        self.path = event.state.path
      else
        self.path = self.initialPath
    }
  }
}

export default VueRemoteTemplate
