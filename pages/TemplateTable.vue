<template>
  <div>
    <tk-table
      :data="tableData"
      style="width: 100%">
      <tk-table-column type="expand">
        <template slot-scope="props">
          <tk-table
            :data="tableData"
            style="width: 100%">
            <tk-table-column
              prop="date"
              label="日期"
              width="180">
            </tk-table-column>
            <tk-table-column
              prop="name"
              label="姓名"
              width="180">
            </tk-table-column>
            <tk-table-column
              prop="address"
              label="地址">
            </tk-table-column>
          </tk-table>

        </template>
      </tk-table-column>
      <tk-table-column
        prop="date"
        label="日期"
        width="180">
      </tk-table-column>
      <tk-table-column
        prop="name"
        label="姓名"
        width="180">
      </tk-table-column>
      <tk-table-column
        prop="address"
        label="地址">
      </tk-table-column>
    </tk-table>
    <div class="table">
      <h1>
        标题
      </h1>
      <p>
        这是内容
        <span>这是注释<a>百度</a></span>
        <a>链接1</a>
        <a>链接2</a>
        <a>链接3</a>

      </p>
      <span class="disabled">测试继承</span>
      <a>测试继承</a>

    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  $highlight-color: #F90;
  .table{
    color: $highlight-color
  }
  .table {
    h1 {
      font-weight: bold;
    }
    p {
      margin-bottom: 1.4em;
      span {color: red}
      > a {
        color: blue;
        &:hover {color: red}
      }
    }
  }
  .disabled{
    color: grey;
    @extend a
  }
</style>
