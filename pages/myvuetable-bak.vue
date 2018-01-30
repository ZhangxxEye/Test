<template>
  <div>
    <div v-if="showTable">
      <vuetable ref="vuetable"
                api-url="http://vuetable.ratiw.net/api/users"
                :fields="tableColumns"
                :sort-order="sortOrder"
                @create="create"
                @edit="edit"
      ></vuetable>
    </div>
    <div v-if="!showTable">
      <span class="glyphicon glyphicon-arrow-left" style="color: blue; cursor: pointer" @click="backTo"><span style="margin-left: 5px">返回</span></span>
      <form-generator :model="formModel" :schema="formSchema">
      </form-generator>

    </div>
    <div>

    </div>
  </div>



</template>
<script type="text/ecmascript-6">
  /*let tableColumns = [
    {
      name: '__sequence',
      title: 'No.',
      titleClass: 'right aligned',
      dataClass: 'right aligned'
    },
    {
      name: '__checkbox',
      title: 'checkbox',
      titleClass: 'center aligned',
      dataClass: 'center aligned'
    },
    {
      name: 'id',
      title: '<i class="unordered list icon"></i> Detail',
      dataClass: 'center aligned'
    },
    {
      name: 'name',
      title: '<i class="book icon"></i> Full Name',
      sortField: 'name'
    },
    {
      name: 'email',
      title: '<i class="mail outline icon"></i> Email',
      sortField: 'email',
      visible: true
    },
    {
      name: 'nickname',
      title: '<i class="paw icon"></i> Nickname',
      sortField: 'nickname'
    },
    {
      name: 'birthdate',
      title: '<i class="orange birthday icon"></i> Birthdate',
      sortField: 'birthdate'
    },
    {
      name: 'gender',
      title: 'Gender',
      sortField: 'gender',
      titleClass: 'center aligned',
      dataClass: 'center aligned'
    },
    {
      name: '__component:custom-actions',
      title: 'Actions',
      titleClass: 'center aligned',
      dataClass: 'center aligned'
    }
  ]*/
  import { mapGetters } from 'vuex'
  export default{
    data () {
      return {
        showTable: true,
        sortOrder: [{
          field: 'name',
          direction: 'asc',
        }]
      };
    },
    computed: {
      ...mapGetters({
        model: 'users/model',
        schema: 'users/schema',
        tableColumns: 'users/tableColumns'
      }),
      formModel () {
        let obj={}
        Object.assign(obj, this.model)
        return obj
      },
      formSchema () {
        let obj = {}
        Object.assign(obj, this.schema)
        return obj
      }
    },
    methods: {
      create () {
        this.showTable = false
      },
      edit () {
        this.showTable = false
      },
      backTo () {
        this.showTable = !this.showTable
      }
    }


  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/scss/form/_all";
</style>
