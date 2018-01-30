<template>
  <div class="ui vertical segment">
    <div class="ui container">
      <div class="ui vertical stripe segment">
        <div :class="[{'vuetable-wrapper ui basic segment': true},loading]" style="font-size: 12px;">
          <div>
            <div class="title table">
              <div class="row">
                <div class="list-name cell">{{title}}</div>
                <div class="action cell"><Actions @refresh="refresh" @create="create"></Actions></div>
              </div>
            </div>
            <div class="filter-box">
              <form class="form-inline">
                <div class="form-group filter-content">
                  <label for="Search" style="padding-right: 3px">Search: </label>
                  <input type="text" class="form-control" id="Search" v-model="searchFor" @keyup.enter.prevent="setFilter">
                </div>
                <button  class="btn btn-primary" @click.prevent="setFilter">Go</button>
                <button  class="btn btn-default" @click.prevent="resetFilter">Reset</button>
              </form>
            </div><!-- ui grid -->
            <table :class="['vuetable', css.tableClass]">
              <thead>
              <tr>
                <template v-for="field in tableFields">
                  <template v-if="field.visible">
                    <template v-if="isSpecialField(field.name)">
                      <th v-if="extractName(field.name) == '__checkbox'"
                          :class="['vuetable-th-checkbox-'+trackBy, field.titleClass]">
                        <input type="checkbox" @change="toggleAllCheckboxes(field.name, $event)"
                               :checked="checkCheckboxesState(field.name)">
                      </th>
                      <th v-if="extractName(field.name) == '__component'"
                          @click="orderBy(field, $event)"
                          :class="['vuetable-th-component-'+trackBy, field.titleClass, {'sortable': isSortable(field)}]"
                          v-html="renderTitle(field)"
                      ></th>
                      <th v-if="extractName(field.name) == '__slot'"
                          @click="orderBy(field, $event)"
                          :class="['vuetable-th-slot-'+extractArgs(field.name), field.titleClass, {'sortable': isSortable(field)}]"
                          v-html="renderTitle(field)"
                      ></th>
                      <th v-if="extractName(field.name) == '__sequence'"
                          :class="['vuetable-th-sequence', field.titleClass || '']" v-html="renderTitle(field)">
                      </th>
                      <th v-if="notIn(extractName(field.name), ['__sequence', '__checkbox', '__component', '__slot'])"
                          :class="['vuetable-th-'+field.name, field.titleClass || '']" v-html="renderTitle(field)">
                      </th>
                    </template>
                    <template v-else>
                      <th @click="orderBy(field, $event)"
                          :id="'_' + field.name"
                          :class="['vuetable-th-'+field.name, field.titleClass,  {'sortable': isSortable(field)}]"
                          v-html="renderTitle(field)"
                      ></th>
                    </template>
                  </template>
                </template>
              </tr>
              </thead>
              <tbody v-cloak class="vuetable-body">
              <template v-for="(item, index) in tableData">
                <tr @dblclick="onRowDoubleClicked(item, $event)" :item-index="index" @click="onRowClicked(item, $event)" :render="onRowChanged(item)" :class="onRowClass(item, index)">
                  <template v-for="field in tableFields">
                    <template v-if="field.visible">
                      <template v-if="isSpecialField(field.name)">
                        <td v-if="extractName(field.name) == '__sequence'" :class="['vuetable-sequence', field.dataClass]"
                            v-html="renderSequence(index)">
                        </td>
                        <td v-if="extractName(field.name) == '__handle'" :class="['vuetable-handle', field.dataClass]"
                            v-html="renderIconTag(['handle-icon', css.handleIcon])"
                        ></td>
                        <td v-if="extractName(field.name) == '__checkbox'" :class="['vuetable-checkboxes', field.dataClass]">
                          <input type="checkbox"
                                 @change="toggleCheckbox(item, field.name, $event)"
                                 :checked="rowSelected(item, field.name)">
                        </td>
                        <td v-if="extractName(field.name) === '__component'" :class="['vuetable-component', field.dataClass]">
                          <component :is="extractArgs(field.name)"
                                     :row-data="item" :row-index="index" :row-field="field.sortField" @edit="edit"
                          ></component>
                        </td>
                        <td v-if="extractName(field.name) === '__slot'" :class="['vuetable-slot', field.dataClass]">
                          <slot :name="extractArgs(field.name)"
                                :row-data="item" :row-index="index" :row-field="field.sortField"
                          ></slot>
                        </td>
                      </template>
                      <template v-else>
                        <td v-if="hasCallback(field)" :class="field.dataClass"
                            @click="onCellClicked(item, field, $event)"
                            @dblclick="onCellDoubleClicked(item, field, $event)"
                            v-html="callCallback(field, item)"
                        >
                        </td>
                        <td v-else :class="field.dataClass"
                            @click="onCellClicked(item, field, $event)"
                            @dblclick="onCellDoubleClicked(item, field, $event)"
                            v-html="getObjectValue(item, field.name, '')"
                        >
                        </td>
                      </template>
                    </template>
                  </template>
                </tr>
                <template v-if="useDetailRow">
                  <tr v-if="isVisibleDetailRow(item[trackBy])"
                      @click="onDetailRowClick(item, $event)"
                      :class="[css.detailRowClass]"
                  >
                    <transition :name="detailRowTransition">
                      <td :colspan="countVisibleFields">
                        <component :is="detailRowComponent" :row-data="item" :row-index="index"></component>
                      </td>
                    </transition>
                  </tr>
                </template>
              </template>
              <template v-if="displayEmptyDataRow">
                <tr>
                  <td :colspan="countVisibleFields" class="vuetable-empty-result">{{noDataTemplate}}</td>
                </tr>
              </template>
              <template v-if="lessThanMinRows">
                <tr v-for="i in blankRows" class="blank-row">
                  <template v-for="field in tableFields">
                    <td v-if="field.visible">&nbsp;</td>
                  </template>
                </tr>
              </template>
              </tbody>
            </table>
            <div class="vuetable-pagination ui bottom attached segment grid">
              <vuetable-pagination-info ref="paginationInfo"
                                        :info-template="infoTemplate"  :no-data-template="noDataTemplate"
              ></vuetable-pagination-info>
              <!--<component :is="paginationComponent" ref="pagination"-->
              <!--@vuetable-pagination:change-page="onChangePage"-->
              <!--&gt;</component>-->
              <vuetable-pagination ref="pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
            </div>
          </div>
        </div><!-- vuetable-wrapper -->
      </div><!-- content -->
    </div><!-- app -->
  </div><!-- ui container -->

</template>

<script>
import axios from 'axios'
import Actions from './Actions.vue'
import VuetablePagination from './VuetablePagination.vue'
import VuetablePaginationDropdown from './VuetablePaginationDropdown.vue'
import VuetablePaginationInfo from './VuetablePaginationInfo.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    infoTemplate: {
      type: String
    },
    noDataTemplate: {
      type: String
    },
    title: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      required: true
    },
    loadOnStart: {
      type: Boolean,
      default: true
    },
    apiUrl: {
        type: String,
        default: ''
    },
    httpMethod: {
        type: String,
        default: 'get',
        validator: (value) => {
          return ['get', 'post'].indexOf(value) > -1
        }
    },
    reactiveApiUrl: {
        type: Boolean,
        default: true
    },
    apiMode: {
      type: Boolean,
      default: true
    },
    data: {
      type: [Array, Object],
      default () {
        return null
      }
    },
    dataTotal: {
      type: Number,
      default: 0
    },
    dataManager: {
      type: Function,
      default () {
        return null
      }
    },
    dataPath: {
        type: String,
        default: 'data'
    },
    paginationPath: {
        type: String,
        default: 'pagination'
    },
    queryParams: {
      type: Object,
      default () {
        return {
          sort: 'sort',
          page: 'page',
          perPage: 'per_page'
        }
      }
    },
    httpOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    perPage: {
        type: Number,
        default () {
            return 10
        }
    },
    sortOrder: {
      type: Array,
      default () {
        return []
      }
    },
    multiSort: {
      type: Boolean,
      default () {
        return false
      }
    },
    /*
     * physical key that will trigger multi-sort option
     * possible values: 'alt', 'ctrl', 'meta', 'shift'
     * 'ctrl' might not work as expected on Mac
     */
    multiSortKey: {
      type: String,
      default: 'alt'
    },
    /* deprecated */
    rowClassCallback: {
      type: [String, Function],
      default: ''
    },
    rowClass: {
      type: [String, Function],
      default: ''
    },
    detailRowComponent: {
      type: String,
      default: ''
    },
    detailRowTransition: {
      type: String,
      default: ''
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    css: {
      type: Object,
      default () {
        return {
          tableClass: 'ui blue selectable celled stackable attached table',
          loadingClass: 'loading',
          ascendingIcon: 'blue chevron up icon',
          descendingIcon: 'blue chevron down icon',
          detailRowClass: 'vuetable-detail-row',
          handleIcon: 'grey sidebar icon',
        }
      }
    },
    minRows: {
      type: Number,
      default: 0
    },
    silent: {
      type: Boolean,
      default: false
    },
    noDataTemplate: {
      type: String,
      default() {
        return 'No Data Available'
      }
    },
    component: {
      type: String
    }
  },
  components: {
    Actions,
    VuetablePagination,
    VuetablePaginationInfo
  },
  data () {
    return {
      eventPrefix: 'vuetable:',
      tableFields: [],
      tableData: null,
      tablePagination: null,
      currentPage: 1,
      selectedTo: [],
      visibleDetailRows: [],
      loading: '',
      searchFor: '',
      appendParams: {}
    }
  },
  mounted () {
    this.normalizeFields()
    this.normalizeSortOrder()
    this.$nextTick(function() {
      this.fireEvent('initialized', this.tableFields)
    })

    if (this.loadOnStart) {
      this.loadData()
    }
  },
  computed: {
    useDetailRow () {
      if (this.tableData && this.tableData[0] && this.detailRowComponent !== '' && typeof this.tableData[0][this.trackBy] === 'undefined') {
        this.warn('You need to define unique row identifier in order for detail-row feature to work. Use `track-by` prop to define one!')
        return false
      }

      return this.detailRowComponent !== ''
    },
    countVisibleFields () {
      return this.tableFields.filter(function(field) {
        return field.visible
      }).length
    },
    countTableData () {
      if (this.tableData === null) {
        return 0
      }
      return this.tableData.length
    },
    displayEmptyDataRow () {
      return this.countTableData === 0 && this.noDataTemplate.length > 0
    },
    lessThanMinRows () {
      if (this.tableData === null || this.tableData.length === 0) {
        return true
      }
      return this.tableData.length < this.minRows
    },
    blankRows () {
      if (this.tableData === null || this.tableData.length === 0) {
        return this.minRows
      }
      if (this.tableData.length >= this.minRows) {
        return 0
      }

      return this.minRows - this.tableData.length
    },
    isApiMode () {
      return this.apiMode
    },
    isDataMode () {
      return ! this.apiMode
    }
  },
  methods: {
    create () {
      this.createUser();
//      this.$router.push({path: '/form/formgenerator', query: { type: 'create' }})
      this.$emit("create")
    },
    ...mapActions({
      createUser: 'user/create',
      editUser: 'user/edit'
    }),
    edit (data) {
      this.editUser(data)
      this.$emit("edit")
    },
    setFilter () {
      this.appendParams = {
        'filter': this.searchFor
      }
      this.loadData();
    },
    resetFilter () {
      this.searchFor = ''
      this.setFilter()
    },
    onChangePage (page) {
      this.changePage(page)
    },
    normalizeFields () {
      if (typeof(this.fields) === 'undefined') {
        this.warn('You need to provide "fields" prop.')
        return
      }

      this.tableFields = []
      let self = this
      let obj
      this.fields.forEach(function(field, i) {
        if (typeof (field) === 'string') {
          obj = {
            name: field,
            title: self.setTitle(field),
            titleClass: '',
            dataClass: '',
            callback: null,
            visible: true,
          }
        } else {
          obj = {
            name: field.name,
            title: (field.title === undefined) ? self.setTitle(field.name) : field.title,
            sortField: field.sortField,
            titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
            dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
            callback: (field.callback === undefined) ? '' : field.callback,
            visible: (field.visible === undefined) ? true : field.visible,
          }
        }
        self.tableFields.push(obj)
      })
    },
    setData (data) {
      this.apiMode = false
      if (Array.isArray(data)) {
        this.tableData = data
        return
      }

//      this.fireEvent('loading')
      this.loading = 'loading'

      this.tableData = this.getObjectValue(data, this.dataPath, null)
      this.tablePagination = this.getObjectValue(data, this.paginationPath, null)

      this.$nextTick(function() {
//        this.fireEvent('pagination-data', this.tablePagination)
        this.onPaginationData(this.tablePagination)
//        this.fireEvent('loaded')
        this.loading = ''
      })
    },
    setTitle (str) {
      if (this.isSpecialField(str)) {
        return ''
      }

      return this.titleCase(str)
    },
    renderTitle (field) {
      let title = (typeof field.title === 'undefined') ? field.name.replace('.', ' ') : field.title

      if (title.length > 0 && this.isInCurrentSortGroup(field)) {
        let style = `opacity:${this.sortIconOpacity(field)};position:relative;float:right`
        return title + ' ' + this.renderIconTag(['sort-icon', this.sortIcon(field)], `style="${style}"`)
      }

    return title
    },
    renderSequence (index) {
      return this.tablePagination
        ? this.tablePagination.from + index
        : index
    },
    isSpecialField (fieldName) {
      return fieldName.slice(0, 2) === '__'
    },
    titleCase (str) {
      return str.replace(/\w+/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },
    camelCase (str, delimiter = '_') {
      let self = this
      return str.split(delimiter).map(function(item) {
        return self.titleCase(item)
      }).join('')
    },
    notIn (str, arr) {
      return arr.indexOf(str) === -1
    },
    loadData (success = this.loadSuccess, failed = this.loadFailed) {
      if (this.isDataMode) {
        this.callDataManager()
        return
      }
      this.loading = 'loading'
      this.httpOptions['params'] = this.getAllQueryParams()
      axios["get"](this.apiUrl, this.httpOptions).then(
          success,
          failed
      ).catch(() => failed())
    },
    loadSuccess (response) {
      this.fireEvent('load-success', response)
      let body = this.transform(response.data)
      this.tableData = this.getObjectValue(body, this.dataPath, null)
      this.tablePagination = this.getObjectValue(body, this.paginationPath, null)
      if (this.tablePagination === null) {
        this.warn('vuetable: pagination-path "' + this.paginationPath + '" not found. '
          + 'It looks like the data returned from the sever does not have pagination information '
          + "or you may have set it incorrectly.\n"
          + 'You can explicitly suppress this warning by setting pagination-path="".'
        )
      }

      this.$nextTick(function() {
//        this.fireEvent('pagination-data', this.tablePagination)
        this.onPaginationData(this.tablePagination)
//        this.fireEvent('loaded')
        this.loading = ''
      })
    },
    loadFailed (response) {
      console.error('load-error', response)
      this.fireEvent('load-error', response)
//      this.fireEvent('loaded')
      this.loading = ''
    },
    transform (data) {
      let transformed = {}
      transformed.pagination = {
        total: data.total,
        per_page: data.per_page,
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url,
        from: data.from,
        to: data.to
      }

      transformed.data = []
      data = data.data
      for (let i = 0; i < data.length; i++) {
        transformed['data'].push({
          id: data[i].id,
          name: data[i].name,
          nickname: data[i].nickname,
          email: data[i].email,
          age: data[i].age,
          birthdate: data[i].birthdate,
          gender: data[i].gender,
          address: data[i].address.line1 + ' ' + data[i].address.line2 + ' ' + data[i].address.zipcode
        })
      }

      return transformed
    },
    parentFunctionExists (func) {
      return (func !== '' && typeof this.$parent[func] === 'function')
    },
    callParentFunction (func, args, defaultValue = null) {
      if (this.parentFunctionExists(func)) {
        return this.$parent[func].call(this.$parent, args)
      }

      return defaultValue
    },
    fireEvent (eventName, args) {
      this.$emit(this.eventPrefix + eventName, args)
    },
    warn (msg) {
      if (!this.silent) {
        console.warn(msg)
      }
    },
    getAllQueryParams () {
      let params = {}
      params[this.queryParams.sort] = this.getSortParam()
      params[this.queryParams.page] = this.currentPage
      params[this.queryParams.perPage] = this.perPage

      for (let x in this.appendParams) {
        params[x] = this.appendParams[x]
      }

      return params
    },
    getSortParam () {
      if (!this.sortOrder || this.sortOrder.field == '') {
        return ''
      }

      if (typeof this.['getSortParam'] == 'function') {
        return this.$parent[$parent'getSortParam'].call(this.$parent, this.sortOrder)
      }

      return this.getDefaultSortParam()
    },
    getDefaultSortParam () {
      let result = '';

      for (let i = 0; i < this.sortOrder.length; i++) {
        let fieldName = (typeof this.sortOrder[i].sortField === 'undefined')
          ? this.sortOrder[i].field
          : this.sortOrder[i].sortField;

        result += fieldName + '|' + this.sortOrder[i].direction + ((i+1) < this.sortOrder.length ? ',' : '');
      }

      return result;
    },
    extractName (string) {
      return string.split(':')[0].trim()
    },
    extractArgs (string) {
      return string.split(':')[1]
    },
    isSortable (field) {
      return !(typeof field.sortField === 'undefined')
    },
    isInCurrentSortGroup (field) {
      return this.currentSortOrderPosition(field) !== false;
    },
    currentSortOrderPosition (field) {
      if ( ! this.isSortable(field)) {
        return false
      }

      for (let i = 0; i < this.sortOrder.length; i++) {
        if (this.fieldIsInSortOrderPosition(field, i)) {
          return i;
        }
      }

      return false;
    },
    fieldIsInSortOrderPosition (field, i) {
      return this.sortOrder[i].field === field.name && this.sortOrder[i].sortField === field.sortField
    },
    orderBy (field, event) {
      if ( ! this.isSortable(field) ) return

      let key = this.multiSortKey.toLowerCase() + 'Key'
      if (this.f && event[key]) { //adding column to multisort
        this.multiColumnSort(field)
      } else {
        //no multisort, or resetting sort
        this.singleColumnSort(field)
      }
//
      this.currentPage = 1    // reset page index
      this.loadData()
    },
    multiColumnSort (field) {
      let i = this.currentSortOrderPosition(field);

      if(i === false) { //this field is not in the sort array yet
        this.sortOrder.push({
          field: field.name,
          sortField: field.sortField,
          direction: 'asc'
        });
      } else { //this field is in the sort array, now we change its state
        if(this.sortOrder[i].direction === 'asc') {
          // switch direction
          this.sortOrder[i].direction = 'desc'
        } else {
          //remove sort condition
          this.sortOrder.splice(i, 1);
        }
      }
    },
    singleColumnSort (field) {
      if (this.sortOrder.length === 0) {
        this.clearSortOrder()
      }

      this.sortOrder.splice(1); //removes additional columns

      if (this.fieldIsInSortOrderPosition(field, 0)) {
        // change sort direction
        this.sortOrder[0].direction = this.sortOrder[0].direction === 'asc' ? 'desc' : 'asc'
      } else {
        // reset sort direction
        this.sortOrder[0].direction = 'asc'
      }
      this.sortOrder[0].field = field.name
      this.sortOrder[0].sortField = field.sortField
    },
    clearSortOrder () {
      this.sortOrder.push({
        field: '',
        sortField: '',
        direction: 'asc'
      });
    },
    sortIcon (field) {
      let cls = ''
      let i = this.currentSortOrderPosition(field)

      if (i !== false) {
        cls = (this.sortOrder[i].direction == 'asc') ? this.css.ascendingIcon : this.css.descendingIcon
      }

      return cls;
    },
    sortIconOpacity (field) {
      /*
       * fields with stronger precedence have darker color
       *
       * if there are few fields, we go down by 0.3
       * ex. 2 fields are selected: 1.0, 0.7
       *
       * if there are more we go down evenly on the given spectrum
       * ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3
       */
      let max = 1.0,
          min = 0.3,
          step = 0.3

      let count = this.sortOrder.length;
      let current = this.currentSortOrderPosition(field)


      if(max - count * step < min) {
        step = (max - min) / (count-1)
      }

      let opacity = max - current * step

      return opacity
    },
    hasCallback (item) {
      return item.callback ? true : false
    },
    callCallback (field, item) {
      if ( ! this.hasCallback(field)) return

      if(typeof(field.callback) == 'function') {
       return field.callback(this.getObjectValue(item, field.name))
      }

      let args = field.callback.split('|')
      let func = args.shift()

      if (typeof this.$parent[func] === 'function') {
        let value = this.getObjectValue(item, field.name)

        return (args.length > 0)
          ? this.$parent[func].apply(this.$parent, [value].concat(args))
          : this.$parent[func].call(this.$parent, value)
      }

      return null
    },
    getObjectValue (object, path, defaultValue) {
      defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue

      let obj = object
      if (path.trim() != '') {
        let keys = path.split('.')
        keys.forEach(function(key) {
          if (obj !== null && typeof obj[key] !== 'undefined' && obj[key] !== null) {
            obj = obj[key]
          } else {
            obj = defaultValue
            return
          }
        })
      }
      return obj
    },
    toggleCheckbox (dataItem, fieldName, event) {
      let isChecked = event.target.checked
      let idColumn = this.trackBy

      if (dataItem[idColumn] === undefined) {
        this.warn('__checkbox field: The "'+this.trackBy+'" field does not exist! Make sure the field you specify in "track-by" prop does exist.')
        return
      }

      let key = dataItem[idColumn]
      if (isChecked) {
        this.selectId(key)
      } else {
        this.unselectId(key)
      }
      this.$emit('vuetable:checkbox-toggled', isChecked, dataItem)
    },
    selectId (key) {
      if ( ! this.isSelectedRow(key)) {
        this.selectedTo.push(key)
      }
    },
    unselectId (key) {
      this.selectedTo = this.selectedTo.filter(function(item) {
        return item !== key
      })
    },
    onPaginationData (tablePagination) {
      this.$refs.paginationInfo.setPaginationData(tablePagination)
      this.$refs.pagination.setPaginationData(tablePagination)
    },
    isSelectedRow (key) {
      return this.selectedTo.indexOf(key) >= 0
    },
    rowSelected (dataItem, fieldName){
      let idColumn = this.trackBy
      let key = dataItem[idColumn]

      return this.isSelectedRow(key)
    },
    checkCheckboxesState (fieldName) {
      if (! this.tableData) return

      let self = this
      let idColumn = this.trackBy
      let selector = 'th.vuetable-th-checkbox-' + idColumn + ' input[type=checkbox]'
      let els = document.querySelectorAll(selector)

      //fixed:document.querySelectorAll return the typeof nodeList not array
      if (els.forEach===undefined)
        els.forEach=function(cb){
          [].forEach.call(els, cb);
        }

      // count how many checkbox row in the current page has been checked
      let selected = this.tableData.filter(function(item) {
        return self.selectedTo.indexOf(item[idColumn]) >= 0
      })

      // count == 0, clear the checkbox
      if (selected.length <= 0) {
        els.forEach(function(el) {
          el.indeterminate = false
        })
        return false
      }
      // count > 0 and count < perPage, set checkbox state to 'indeterminate'
      else if (selected.length < this.perPage) {
        els.forEach(function(el) {
          el.indeterminate = true
        })
        return true
      }
      // count == perPage, set checkbox state to 'checked'
      else {
        els.forEach(function(el) {
          el.indeterminate = false
        })
        return true
      }
    },
    toggleAllCheckboxes (fieldName, event) {
      let self = this
      let isChecked = event.target.checked
      let idColumn = this.trackBy

      if (isChecked) {
        this.tableData.forEach(function(dataItem) {
          self.selectId(dataItem[idColumn])
        })
      } else {
        this.tableData.forEach(function(dataItem) {
          self.unselectId(dataItem[idColumn])
        })
      }
      this.$emit('vuetable:checkbox-toggled-all', isChecked)
    },
    gotoPreviousPage () {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadData()
      }
    },
    gotoNextPage () {
      if (this.currentPage < this.tablePagination.last_page) {
        this.currentPage++
        this.loadData()
      }
    },
    gotoPage (page) {
      if (page != this.currentPage && (page > 0 && page <= this.tablePagination.last_page)) {
        this.currentPage = page
        this.loadData()
      }
    },
    isVisibleDetailRow (rowId) {
      return this.visibleDetailRows.indexOf( rowId ) >= 0
    },
    showDetailRow (rowId) {
      if (!this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.push(rowId)
      }
    },
    hideDetailRow (rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.visibleDetailRows.splice(
          this.visibleDetailRows.indexOf(rowId),
          1
        )
      }
    },
    toggleDetailRow (rowId) {
      if (this.isVisibleDetailRow(rowId)) {
        this.hideDetailRow(rowId)
      } else {
        this.showDetailRow(rowId)
      }
    },
    showField (index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = true
    },
    hideField (index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = false
    },
    toggleField (index) {
      if (index < 0 || index > this.tableFields.length) return

      this.tableFields[index].visible = ! this.tableFields[index].visible
    },
    renderIconTag (classes, options = '') {
      return typeof(this.css.renderIcon) === 'undefined'
        ? `<i class="${classes.join(' ')}" ${options}></i>`
        : this.css.renderIcon(classes, options)
    },
    makePagination (total = null, perPage = null, currentPage = null) {
      let pagination = {}
      total = total === null ? this.dataTotal : total
      perPage = perPage === null ? this.perPage : perPage
      currentPage = currentPage === null ? this.currentPage : currentPage

      return {
        'total': total,
        'per_page': perPage,
        'current_page': currentPage,
        'last_page': Math.ceil(total / perPage) || 0,
        'next_page_url': '',
        'prev_page_url': '',
        'from': (currentPage -1) * perPage +1,
        'to': Math.min(currentPage * perPage, total)
      }
    },
    normalizeSortOrder () {
      this.sortOrder.forEach(function(item) {
        item.sortField = item.sortField || item.field
      })
    },
    callDataManager () {
      if (this.dataManager === null && this.data === null) return

      if (Array.isArray(this.data)) {
        console.log('data mode: array')
        this.setData(this.data)
      } else {
        this.normalizeSortOrder()
        this.setData(this.dataManager(this.sortOrder, this.makePagination()))
      }
    },
    onRowClass (dataItem, index) {
      if (this.rowClassCallback !== '') {
        this.warn('"row-class-callback" prop is deprecated, please use "row-class" prop instead.')
        return
      }

      if (typeof(this.rowClass) === 'function') {
        return this.rowClass(dataItem, index)
      }

      return this.rowClass
    },
    onRowChanged (dataItem) {
      this.fireEvent('row-changed', dataItem)
      return true
    },
    onRowClicked (dataItem, event) {
      this.$emit(this.eventPrefix + 'row-clicked', dataItem, event)
      return true
    },
    onRowDoubleClicked (dataItem, event) {
      this.$emit(this.eventPrefix + 'row-dblclicked', dataItem, event)
    },
    onDetailRowClick (dataItem, event) {
      this.$emit(this.eventPrefix + 'detail-row-clicked', dataItem, event)
    },
    onCellClicked (dataItem, field, event) {
      this.$emit(this.eventPrefix + 'cell-clicked', dataItem, field, event)
    },
    onCellDoubleClicked (dataItem, field, event) {
      this.$emit(this.eventPrefix + 'cell-dblclicked', dataItem, field, event)
    },
    /*
     * API for externals
     */
    changePage (page) {
      if (page === 'prev') {
        this.gotoPreviousPage()
      } else if (page === 'next') {
        this.gotoNextPage()
      } else {
        this.gotoPage(page)
      }
    },
    reload () {
      this.loadData()
    },
    refresh () {
      console.log('refresh')
      this.currentPage = 1
      this.loadData()
    },
    resetData () {
      this.tableData = null
      this.tablePagination = null
      this.fireEvent('data-reset')
    }
  }, // end: methods
  watch: {
    'multiSort' (newVal, oldVal) {
      if (newVal === false && this.sortOrder.length > 1) {
        this.sortOrder.splice(1);
        this.loadData();
      }
    },
    'apiUrl'  (newVal, oldVal) {
      if(this.reactiveApiUrl && newVal !== oldVal)
        this.refresh()
    }
  },
}
</script>

<style scoped>
  .filter-box button,.filter-content{
    margin-right: 5px;
  }
  .ui.vertical.stripe h3 {
    font-size: 2em;
  }
  .secondary.pointing.menu .toc.item {
    display: none;
  }
  .vuetable {
    margin-top: 1em !important;
  }
  .vuetable-wrapper.ui.basic.segment {
    padding: 0em;
  }
  .vuetable button.ui.button {
    padding: .5em .5em;
    font-weight: 400;
  }
  .vuetable button.ui.button i.icon {
    margin: 0;
  }
  .vuetable td i.handle-icon:hover {
    cursor: pointer;
  }
  .vuetable-actions {
    /*width: 15%;*/
    padding: 12px 0px;
    text-align: center;
  }
  .vuetable-pagination {
    background: #f9fafb !important;
  }
  .vuetable-pagination-info {
    margin-top: auto;
    margin-bottom: auto;
  }
  .highlight {
    background-color: yellow;
  }
  .vuetable-detail-row {
    height: 200px;
  }
  .detail-row {
    margin-left: 40px;
  }
  .expand-transition {
    transition: all .5s ease;
  }
  .expand-enter, .expand-leave {
    height: 0;
    opacity: 0;
  }
  tr.odd {
    background-color: #e6f5ff;
  }
  body {
    overflow-y: scroll;
  }
  [v-cloak] {
    display: none;
  }
  .vuetable th.sortable:hover {
    color: #2185d0;
    cursor: pointer;
  }
  .vuetable-pagination {
    background: #f9fafb !important;
  }
  .vuetable-pagination-info {
    margin-top: auto;
    margin-bottom: auto;
  }
  .vuetable-empty-result {
    text-align: center;
  }
  .title .action{
    display: table-cell;
    text-align: right;
  }
  .table {
    display: table;
    width: 100%;
  }
  .row {
    display: table-row;
  }
  .cell {
    display: table-cell;
  }
</style>
