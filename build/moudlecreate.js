/**
 * Created by itw_zhangdl on 2017/9/26.
 */
// import render from 'render'
var fs = require('fs')
//var minimist = require('minimist');

//var args = minimist(process.argv.slice(2));
//var aa = ['abc','sssss']

//console.log(args.v1); //thisisv1
//console.log(args.v2); //thisisv2
var argv;
try {
  argv = JSON.parse(process.env.npm_config_argv).original;
}	catch(ex) {    argv = process.argv;}
console.log(argv);
var argvName = argv[2]
var argvNa = argvName[0].toUpperCase()+argvName.slice(1)
var argvtoUp = argv[2].toUpperCase()

var temp = `<template>
  <div>
    <vuetable store-action="${argv[2]}/get${argvNa}" :action-col-def="actionColDef" ref="myvuetale" @delete="batchDelete${argvNa}" v-if="showTable" @create="create">
    </vuetable>
    <vueform v-if="!showTable" :schemas="schemas" :model="model" :type="type" store-action="${argv[2]}/update" @submitSuccess="submitSuccess"></vueform>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex'
  export default{
    methods: {
      ...mapActions({
        delete: '${argv[2]}/delete'
      }),
      create () {
        this.showTable = false
        this.type = 'add'
        this.model = {}
      },
      submitSuccess () {
        this.showTable = true
      },
      deleteUser (row) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete([row.id]).then((res) => {
            this.$refs.myvuetale.loadData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }, (rej) => {
            this.$message.error('删除错误');
          })
        }, () => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }).catch(() => {

        });
      },
      batchDelete${argvNa} (val) {
        if (val) {
          let ids = [];
          ids = val.map((user) => {
            return user.id
          })
          if (val.length === 0) {
            this.$alert('请先选中要删除的行', '', {
              confirmButtonText: '确定'
            });
          } else {
            this.$confirm('确定要删除吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.delete(ids).then((res) => {
                this.$refs.myvuetale.loadData()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }, (rej) => {
                this.$message.error('删除错误');
              })
            }, () => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            })
          }
        }
      },
      editUser (data) {
        this.model = Object.assign({},data)
        this.showTable = false
        this.type = 'edit'
      }
    },
    data () {
      return {
        type: '',
        showTable: true,
        model: {},
        actionColDef: [{
          handler: this.editUser,
          name: '编辑'
        }, {
          icon: 'message',
          type: 'text',
          handler: this.deleteUser,
          name: '删除'
        }],
        copySchema: []
      }
    },
    computed: {
      ...mapGetters({
        schemas: '${argv[2]}/schemas'
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/scss/form/_all.scss";
</style>
`
const server = "http://localhost:8080"
var store = `import axios from 'axios'
const server = "http://localhost:8080"
export const state = () => ({
  ${argv[2]}:{}
})
export const getters = {
  schemas: (state) => {
    let labels = state.${argv[2]}.tableLables
    if (labels) {
      labels.map((value) => {
        value['model'] = value['prop']
        return value
      })
      return labels
    }
  }
}


export const mutations = {

  GET_${argvtoUp}_SUCCESS (state, ${argv[2]}) {
    state.${argv[2]} = ${argv[2]}
  }
}

export const actions = {
  get${argvNa} ({commit}, payload) {
    return new Promise((resolve, reject) => {
      axios["get"](server+'/api/${argv[2]}', payload) .then(function (response) {
        commit('GET_${argvtoUp}_SUCCESS',response.data)
        resolve(response.data)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  delete ({commit}, payload) {
    let params = ''
    if (payload.length == 1) {
      params = payload[0]
    } else if (payload.length > 1) {
      params = payload.join('&ids=')
    }
    return new Promise((resolve, reject) => {
      axios["delete"](server + '/api/delete?ids=' + params) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  batchDelete ({commit}, payload) {
    let parames = {}
    parames['id'] = payload
    return new Promise((resolve, reject) => {
      axios["delete"](server + '/api/delete', {params: parames}) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  },
  update ({commit}, payload) {
    let type = payload.type
    let url = ''
    if (type === 'edit')
      url = '/api/update'
    else url = '/api/add'
    return new Promise((resolve, reject) => {
      axios["post"](server + url, payload) .then(function (response) {
        resolve(response)
      })
        .catch(function (error) {
          reject(error)
        });
    })
  }
}

`

fs.writeFileSync('./pages/TemplateTable.vue', temp,
  {
    callback: (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    }
  }
)
fs.writeFileSync(`./store/${argv[2]}.js`, store,
  {
    callback: (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    }
  }
)
