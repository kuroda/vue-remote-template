import Axios from "axios"
import { getInitialData } from "vue-data-scooper"

function parseTemplate(template) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(template, "text/html")
  const root = doc.querySelector("body > *")
  let title = undefined

  if (root.hasAttribute("title")) {
    title = root.getAttribute("title")
    root.removeAttribute("title")
  }

  return [ root, title ]
}

const VueRemoteTemplate = {
  render: function(h) {
    return h(this.dynamicComponent)
  },
  data: function() {
    const root = document.querySelector(this.$options.el)
    return {
      parsedTemplate: undefined,
      path: undefined,
      initialPath: root.dataset.initialPath
    }
  },
  watch: {
    path: function(val, _oldVal) {
      let self = this
      Axios.get(val)
        .then(function(response) {
          const [ root, title ] = parseTemplate(response.data)
          self.parsedTemplate = root
          if (response.headers["document-title"])
            window.document.title = response.headers["document-title"]
          else if (title)
            window.document.title = title
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
        return {
          template: self.parsedTemplate.outerHTML,
          data: function() {
            return Object.assign({}, self.initialData)
          },
          methods: {
            visit: function(templatePath, url) {
              if (!url) url = templatePath
              window.history.pushState({ path: templatePath }, "", url)
              self.path = templatePath
            },
            show: function(templatePath) {
              self.path = templatePath
            }
          }
        }
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

    window.onpopstate = function(event) {
      if (event.state && event.state.path)
        self.path = event.state.path
      else
        self.path = self.initialPath
    }
  }
}

export default VueRemoteTemplate
