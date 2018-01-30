<!--<script src="../../store/users.js"></script>-->
<script type="text/babel">
  import { mapGetters, mapActions } from 'vuex'
  var _this = null
  function handleEdit (index, row) {
    _this.$emit('edit', row)
  }

  function handleDelete (index, row) {
    _this.$emit('delete', row)
  }
  export default{
    render (h, context) {
      return (
        <div class="tk-table">
          {
            this.showActionBar ? (
              <el-row class="tool-bar">
                <el-col span={5}>
                  <el-input
                    icon="search" on-change={this.setFilter}>
                  </el-input>
                </el-col>
                <el-col span={19} class="buttons">
                  <el-button type="primary" nativeOnClick={this.handleCreate}>创建</el-button>
                  <el-button type="primary" nativeOnClick={this.batchDelete}>批量删除</el-button>
                </el-col>
              </el-row>
            ) : ''
          }
          {this.$slots.customToolBar}
          <el-table
            data={this.tableData}
            style="width: 100%"
            height={this.height}
            ref="multipleTable"
            on-selection-change={this.handleSelectionChange}>
            {
              this.showCheckBox ? <el-table-column
                type="selection"
                width="55">
              </el-table-column> : ''
            }
            {this.$slots.default}
            {
              this.tableLabels.map((column, index) => {
                if (column.callback) {
                  return <el-table-column
                    prop={column.prop}
                    label={column.label}
                    sortable={column.sortable}
                    scopedSlots={
                      {
                        default: function (props) {
                          return column.callback(props.row[column.prop])
                        }
                      }
                    }
                >
                </el-table-column>
                } else {
                  return <el-table-column
                    prop={column.prop}
                    label={column.label}
                    sortable={column.sortable}
                  >
                  </el-table-column>
                }
              })
            }
            {
              this.actionColShow() ? <el-table-column label="操作" scopedSlots={
                {
                  default: function (props) {
                    return _this.actionColDef.map((button, index) =>
                    <el-button size="small" onClick={($event) => button.handler(props.row)} type={button.type || "text"}
                    icon={button.icon}>{button.name}</el-button>,
                    )
                  }
                }}>
              </el-table-column> : ''
            }

          </el-table>
          <div class="footBar">
            <div class="leftButton">
              {this.showCheckBox ? <el-button on-click={ () => this.toggleSelection()}>取消选择</el-button> : ''}
            </div>
            <div class="page">
              <el-pagination class="page" style="display:inline-block"
                             on-size-change={this.handleSizeChange}
                             on-current-change={this.handleCurrentChange}
                             current-page={this.currentPage}
                             page-size={this.pageSize}
                             page-sizes={this.pageSizes}
                             layout={"total, sizes, prev, pager, next, jumper"}
                             total={this.totalItems}>
              </el-pagination>
            </div>
          </div>
        </div>
      )
    },
    props: {
      appendColumnInfo: {
        type: Array,
        default() {
          return []
        }
      },
      actionColDef: {
        type: Array,
        default() {
          return []
        }
      },
      showActionBar: {
        type: Boolean,
        default: true
      },
      showCheckBox: {
        type: Boolean,
        default: true
      },
      storeAction: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      columns: {
        type: Array,
        default: function () {
          return [];
        }
      },
      height: {
        type: String,
        default: ''
      },
      pageSizes: {
        type: Array,
        default: function () {
          return [5, 10, 20, 30];
        }
      },
      appendParams: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {
        defaultParams: {},
        httpOptions: {},
        queryParams: {},
        tableData: [],
        tableLabels: [],
        totalItems: 0,
        currentPage: 1,
        pageSize: 10,
        multipleSelection: []
      };
    },
    mounted () {
      this.loadData()
      _this = this
    },
    methods: {
      actionColShow() {
        return this.actionColDef.length > 0
      },
      handleCreate () {
        this.$emit('create')
      },
      batchDelete () {
        this.$emit('delete', this.multipleSelection)
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.currentPage = 1
        this.loadData()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.loadData()
      },
      setFilter (value) {
        this.currentPage = 1
        this.defaultParams = {
          'search': value
        }
        this.loadData();
      },
      getAllQueryParams () {
        let params = {}
        params['current'] = this.currentPage
        params['size'] = this.pageSize
        for (let x in this.appendParams) {
          params[x] = this.appendParams[x]
        }
        for (let x in this.defaultParams) {
          params[x] = this.defaultParams[x]
        }

        return params
      },
      loadData (success = this.loadSuccess, failed = this.loadFailed) {
        this.queryParams['current'] = this.currentPage
        this.queryParams['size'] = this.pageSize
        this.httpOptions['params'] = this.getAllQueryParams()
        this.$store.dispatch(this.storeAction, this.httpOptions).then(
          success,
          failed
        )
      },
      loadSuccess (data) {
        this.tableData = data.records
        this.totalItems = data.total
        this.tableLabels = this.assignColumns(data.tableLables, this.appendColumnInfo)
        console.log('tableLabels', this.tableLabels)
      },
      loadFailed (error) {
        console.log(error)
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      assignColumns(oldarray, newarray) {
        if (newarray) {
          oldarray.map(function (value, index, array) {
            return Object.assign(value, newarray[index]);
          });
        }
        return oldarray;
      }
    }
  }
</script>
<style>
  .tk-table > .tool-bar {
    margin-bottom: 20px;
  }

  .tk-table > .tool-bar > .search {
    width: 30%;
  }

  .tk-table > .tool-bar > .buttons {
    text-align: right;
  }

  .tk-table > .page {
    text-align: center;
    margin-top: 10px;
  }

  .footBar {
    padding: 8px 0;
  }

  .footBar .leftButton {
    float: left;
  }

  .footBar .page {
    float: right;
  }
</style>
