var resolve = require('path').resolve
var slugify = require('transliteration').slugify
var striptags = require('./utils/strip-tags')
var hljs = require('highlight.js')
var glob = require('glob')

var md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})
function convert (str) {
  str = str.replace(/(&#x)(\w{4});/gi, function ($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16))
  })
  return str
}

module.exports = {
  router: {
    extendRoutes (routes, resolve) {
      glob('pages/**/*.md', function (er, files) {
        files.forEach((file) => {
          let tmppath = file.replace(/^pages/, '').replace(/\.md$/, '').toLowerCase()
          routes.push({
            name: tmppath,
            path: tmppath,
            component: resolve(__dirname, file)
          })
        })
      })
      /*
       routes.push({
       name: 'sample/alert2',
       path: '/sample/alert2',
       component: resolve(__dirname, 'pages/sample/Alert.md')
       });
       */
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'starter',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
      // {rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css'},
      // {rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css'}
    ]
  },
  plugins: [
    {src: '~/plugins/vue-vuetable', ssr: false},
    {src: '~/plugins/vee-validate.js', ssr: true},
    {src: '~/plugins/vue-element-ui', ssr: true},
    {src: '~/plugins/vuex-router-sync.js', ssr: true},
    {src: '~/plugins/vue-charts.js', ssr: true}
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: {color: '#3B8070'},

  css: [
    '~assets/font-awesome/css/font-awesome.css',
    // '~assets/theme-default/index.css',
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap/dist/css/bootstrap-theme.css',
    '~assets/dashboard.css',
    //'~assets/scss/main.scss',
    'bulma/css/bulma.css'
  ],
  /*
   ** Build configuration
   */
  build: {

    vendor: [
      '~/plugins/vue-vuetable.js',
      // '~/plugins/vue-element-ui',
      '~/plugins/vuex-router-sync.js',
      '~/plugins/vue-charts.js',
      '~/plugins/axios.js',
      '~/plugins/async-validator.js',
      '~/plugins/vee-validate.js'
    ],
    /*
     postcss: [
     require('postcss-nested')(),
     require('postcss-responsive-type')(),
     require('postcss-hexrgba')()
     ],
     */
    loaders: [
      /*
       {
       test: /\.(png|jpe?g|gif|svg)$/,
       loader: 'url-loader',
       query: {
       limit: 10000, // 10KO
       name: 'img/[name].[hash].[ext]'
       }
       },
       */
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 5000, // 1 KO
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
        // loader: ExtractPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.md$/,
        loader: 'vue-markdown-loader',
        options: {
          // markdown-it config
          preset: 'default',
          html: true,
          preprocess: function (MarkdownIt, source) {
            /*
             MarkdownIt.renderer.rules.table_open = function() {
             return '<table class="table">';
             };
             */
            return source
          },
          use: [
            /* markdown-it plugin */
            /* [require('markdown-it-anchor'), {
             level: 2,
             slugify: slugify,
             permalink: true,
             permalinkBefore: true
             }], */
            /* or */
            [require('markdown-it-container'), 'demo', {
              validate: function (params) {
                return params.trim().match(/^demo\s*(.*)$/)
              },
              render: function (tokens, idx) {
                // var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                if (tokens[idx].nesting === 1) {
                  // var description = (m && m.length > 1) ? m[1] : '';
                  var summaryContent = tokens[idx + 1].content
                  var summary = striptags.fetch(summaryContent, 'summary')
                  var summaryHTML = summary ? md.render(summary) : ''

                  var content = tokens[idx + 2].content
                  //console.log('content:'+content);
                  var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1')
                  var script = striptags.fetch(content, 'script')
                  var style = striptags.fetch(content, 'style')
                  //console.log('script:'+script);
                  //console.log('style:'+style);
                  var code = tokens[idx + 2].markup + tokens[idx + 2].info + '\n' + content + tokens[idx + 2].markup
                  var codeHtml = code ? md.render(code) : ''

                  //var jsfiddle = { html: html, script: script, style: style };
                  //jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));

                  //console.log('jsfiddle:'+jsfiddle);

                  // opening tag
                  return `<demo-box>
                    <div class="box-demo-show" slot="component">${html}</div>
                    <div slot="description">${summaryHTML}</div>
                    <div class="highlight" slot="code">${codeHtml}</div>
                  `

                } else {
                  // closing tag
                  return '</demo-box>\n'
                }
              }
            }],
            [require('markdown-it-container'), 'tip']

          ]
          // loader: resolve(__dirname, './build/vue-markdown-loader2/index2.js')
        }
      }
    ],
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      if (ctx.isClient) {
        /*
         config.module.rules.push({
         enforce: 'pre',
         test: /\.(js|vue)$/,
         loader: 'eslint-loader',
         exclude: /(node_modules)/
         })
         */
      }
    }
  }
}
