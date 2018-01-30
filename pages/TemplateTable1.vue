<template>
  <div>
    <vuetable store-action="users/getUsers" :action-col-def="actionColDef" ref="myvuetale" @delete="batchDeleteUsers" v-if="showTable" @create="create">
    </vuetable>
    <vueform v-if="!showTable" :schemas="schemas" :model="model" :type="type" store-action="users/update" @submitSuccess="submitSuccess"></vueform>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex'
  export default{
    methods: {
      ...mapActions({
        delete: 'users/delete'
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
      batchDeleteUsers (val) {
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
        schemas: 'users/schemas'
      })
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/scss/form/_all.scss";
</style>
