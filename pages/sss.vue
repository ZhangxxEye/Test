<template>
  <vuetable store-action="users/getUsers" ref="myvuetale">
    <el-table-column v-for="title in tableLables"  :prop="title.prop" :label="title.label" :key="title.label"
                     :sortable="title.sortable">
    </el-table-column>
  </vuetable>

</template>
<script type="text/ecmascript-6">
</script>
<style>
</style>
