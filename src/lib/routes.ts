import Characters from '../components/Characters'
import { Home } from '../components/Home'
import Planets from '../components/Planets'

export default {
  root: 'home',
  routes: [
    {
      path: 'home',
      component: Home,
      before() {
        return Promise.resolve()
      },
    },
    {
      path: 'characters/:filmId',
      component: Characters,
      on: (page, { filmId }) => {
        return new Promise((resolve, reject) => {
          resolve(this)
        })
      },
    },
    {
      path: 'planets/:filmId',
      component: Planets,
      on: (page, { filmId }) => {
        return new Promise((resolve, reject) => {
          resolve(this)
        })
      },
    },
  ],
}
