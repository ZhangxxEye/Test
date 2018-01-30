<template>
  <div class="action-box">
    <span class="glyphicon glyphicon-plus" @click="create"><span class="action-name" >Create</span></span>
    <span class="glyphicon glyphicon-refresh" @click="refresh"><span class="action-name">Refresh</span></span>
  </div>

</template>
<script type="text/ecmascript-6">
  export default {
    methods: {
      create () {
        this.$emit('create')
      },
      refresh () {
        this.$emit('refresh')
      }
    }
  }
</script>
<style scoped>
  .action-box{
    font-size: 14px;
    color: blue;
  }
  .action-box > span{
    margin-right: 25px;
    cursor: pointer;
  }
  .action-name{
    padding-left: 5px;
  }

</style>
