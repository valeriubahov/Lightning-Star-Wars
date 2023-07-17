import { Router } from '@lightningjs/sdk'
import routes from './lib/routes'

export default class App extends Router.App {
  // setup the router and add the routes
  override _setup() {
    Router.startRouter(routes, this)
  }

  static override _template() {
    return {
      // get the overall template
      ...super._template(),
      // can enhance the template like adding a menu here or widgets
    }
  }
}
