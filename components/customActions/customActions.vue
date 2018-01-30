<template>
  <div class="action-box">
  <!--<button class="ui blue button" @click="onClick('edit', rowData)"><i class="edit icon" style="font-size: 12px"></i></button>-->
  <!--<button class="ui green button" @click="onClick('delete', rowData)"><i class="delete icon"></i></button>-->
    <span class="glyphicon glyphicon-pencil" @click="onClick('edit', rowData)"></span>
    <span class="glyphicon glyphicon-remove-sign" @click="onClick('delete', rowData)"></span>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex'
  let edit = 'edit'
  let dele = 'delete'
  export default{
    props: {
      rowData: {
        type: Object,
        required: true
      }
    },
    methods: {
      onClick (action, data) {
        if (edit === action) {
//          this.$router.push({path: '/form/formgenerator', query: { type: action }})
//          this.create()
          this.$emit("edit", data)
        } else if (dele === action) {
          this.$emit("remove", data)
        }
      }
    }
  }
</script>
<style scoped>
  .action-box{
    color: blue;
  }
  .action-box > span{
    margin-right: 22px;
    cursor: pointer;
  }
  /*.action-box > span:hover{*/
    /*cursor: pointer;*/
  /*}*/
</style>
