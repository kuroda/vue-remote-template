import Vue from 'vue/dist/vue.esm'
import VueRemoteTemplate from '../../dist/vue-remote-template'
import { expect } from 'chai'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('VueRemoteTemplate', () => {
  beforeEach(() => {
    const container = document.createElement('div')
    container.setAttribute('id', 'app')
    document.body.appendChild(container)
  })

  it('should render a basic template', (done) => {
    expect(1).to.eq(1)
    done()
  })
})
