import Vue from 'vue'
import { sync } from 'vuex-router-sync'

process.env.DEBUG = 'nuxt:*'


import * as BayMax from '../components'

Vue.use(BayMax);

export default function ({ app, store }) {
  sync(store, app.router)
}
