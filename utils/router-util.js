/**
 * Created by shitx02 on 2017/7/14.
 */


export function createRoutes (files, srcDir) {
  let routes = []
  files.forEach((file) => {
    let keys = file.replace(/^pages/, '').replace(/\.vue$/, '').replace(/\/{2,}/g, '/').split('/').slice(1)
    let route = { name: '', path: '', component: r(srcDir, file) }
    let parent = routes
    keys.forEach((key, i) => {
      route.name = route.name ? route.name + '-' + key.replace('_', '') : key.replace('_', '')
      route.name += (key === '_') ? 'all' : ''
      let child = _.find(parent, { name: route.name })
      if (child) {
        if (!child.children) {
          child.children = []
        }
        parent = child.children
        route.path = ''
      } else {
        if (key === 'index' && (i + 1) === keys.length) {
          route.path += (i > 0 ? '' : '/')
        } else {
          route.path += '/' + (key === '_' ? '*' : key.replace('_', ':'))
          if (key !== '_' && key.indexOf('_') !== -1) {
            route.path += '?'
          }
        }
      }
    })
    // Order Routes path
    parent.push(route)
    parent.sort((a, b) => {
      if (!a.path.length || a.path === '/') {
        return -1
      }
      if (!b.path.length || b.path === '/') {
        return 1
      }
      let res = 0
      let _a = a.path.split('/')
      let _b = b.path.split('/')
      for (let i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        let y = (_a[i].indexOf('*') > -1) ? 2 : (_a[i].indexOf(':') > -1 ? 1 : 0)
        let z = (_b[i].indexOf('*') > -1) ? 2 : (_b[i].indexOf(':') > -1 ? 1 : 0)
        res = y - z
        if (i === _b.length - 1 && res === 0) {
          res = 1
        }
      }
      return res === 0 ? -1 : res
    })
  })
  return cleanChildrenRoutes(routes)
}
