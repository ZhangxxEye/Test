<template>
  <div>
    <el-form :model="formModel"
             :rules="rules"
             :ref="formRef?formRef:'ruleForm'"
             :label-width="labelWidth || '80px'"
             :label-position='labelPosition'>
      <template v-for="schema in schemas">
        <el-row :gutter="schema.gutter"
                :type="schema.rowType"
                :justify="schema.justify"
                :align="schema.align"
                :tag="schema.tag">
          <template v-if="schema.constructor.name === 'Object'">
            <el-col :span="schema.span ? schema.span : 24"
                    :offset="schema.offset"
                    :xs="schema.xs"
                    :sm="schema.sm"
                    :md="schema.md"
                    :lg="schema.lg"  >
              <el-form-item :label="schema.label"
                            :inline="schema.inline"
                            :prop="schema.prop?schema.prop:schema.model">
                <template v-if="schema.options" >
                  <component :is="getComponentTagName(schema,'group')"
                             v-model="model[schema.model]">
                    <template  v-for="option in schema.options">
                      <component :is="getComponentTagName(schema)"
                                 :size="schema.inputSize"
                                 :type="schema.inputType"
                                 :label="option.value">
                        {{option.label}}
                      </component>
                    </template>
                  </component>
                </template>
                <template v-else>
                  <component :is="getComponentTagName(schema)"
                             :size="schema.size"
                             :type="schema.inputType"
                             :placeholder="schema.placeholder"
                             v-model="model[schema.model]" >
                  </component>
                </template>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="schema.constructor.name === 'Array'">
            <template v-for="sch in schema">
              <el-col :span="sch.span"
                      :offset="sch.offset?sch.offset:0"
                      :xs="sch.xs"
                      :sm="sch.sm"
                      :md="sch.md"
                      :lg="sch.lg"  >
                <el-form-item :label="sch.label"
                              :inline="sch.inline" :prop="sch.prop?sch.prop:sch.model">
                  <template v-if="sch.options" >
                    <component :is="getComponentTagName(sch,'group')"
                               :size="sch.size"
                               :type="sch.inputType"
                               v-model="model[sch.model]">
                      <template  v-for="option in sch.options">
                        <component :is="getComponentTagName(sch)"
                                   :label="option.value">
                          {{option.label}}
                        </component>
                      </template>
                    </component>
                  </template>
                  <template v-else>
                    <component :is="getComponentTagName(sch)"
                               :size="sch.size"
                               :type="sch.inputType"
                               :placeholder="sch.placeholder"
                               v-model="model[sch.model]" >
                    </component>
                  </template>
                </el-form-item>
              </el-col>
            </template>
          </template>
        </el-row>
      </template>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立刻提交</el-button>
        <el-button type="success" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  export default {
    data(){
      return {
        formModel:{},
        formSchemas:[]
      }
    },
    mounted(){
      this.formModel = this.model
//      this.formSchemas = this.schemas
//      this.schemas.forEach((value) => {
//        this.formSchemas.push(Object.assign({}, value))
//      })
    },
    props: {
      type: '',
      model: {
        type: Object,
        default () {
          return {}
        }
      },
      rules:Object,
      schemas:Array,
      labelWidth:String,
      labelPosition:{type:String,default:'left'},
      formClassName: [String, Array],
      formStyle: Object,
      formAttrs: Object,
      formLabelPosition: String,
      formRef: String,
      formKey: String,
      storeAction: {
        type: String,
        default () {
          return ''
        }
      },
      editAction: {
        type: String,
        default () {
          return ''
        }
      }
    },
    methods: {
      getComponentTagName (schema) {
        if(arguments.length>1){
          return 'el-' + schema.type + '-group'
        }
        return 'el-' + schema.type
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid)=>{
          if(valid) {
            this.formModel['type'] = this.type
            this.$store.dispatch(this.storeAction, this.formModel).then(
              this.success,
              this.failed
            )
          } else {
            this.$message('有内容未填写，请填写完整')
          }
        })
      },
      resetForm () {
        this.formModel = this.model
      },
      success () {
        this.$emit('submitSuccess')
      },
      failed () {
        console.log('create failed')
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
