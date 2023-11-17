import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { SessionStorage } from 'quasar'
import { api } from 'boot/axios'
import translate from 'src/services/translate'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const isAuthenticated = SessionStorage.has('user')
    if (!isAuthenticated && to.name !== 'signin' && to.name !== 'signup') {
      return next({
        name: 'signin',
      })
    } else if (
      isAuthenticated &&
      (to.name === 'signin' || to.name === 'signup')
    ) {
      return next({
        name:
          from.name === 'signin' || to.name === 'signup' ? 'home' : from.name,
      })
    } else if (isAuthenticated && to.name === 'party') {
      return api.post('/party/check', { partyId: to.params.uid }).then(() => {
        return next()
      }).catch((err) => {
        translate().showErrorMessage(err.response.data.message)
        return next({
          name: from.name || 'home',
        })
      })

    } else {
      return next()
    }
  })

  return Router
})
