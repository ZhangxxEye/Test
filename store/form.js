/**
 * Created by itw_liuyj01 on 2017/9/14.
 */
import axios from 'axios';

export const state = () => ({
  model: {
    id: 1,
    name: "John Doe",
    password: "J0hnD03!x4",
    skills: [
      "Javascript",
      "VueJS"
    ],
    email: "john.doe@gmail.com",
    status: true,
    submit: "提交"
  },
  schema: {
    fields: [
      {
        type: "input",
        inputType: "text",
        label: "ID",
        model: "id",
        readonly: true,
        featured: false,
        disabled: true
      },
      {
        type: "input",
        inputType: "text",
        label: "Name",
        model: "name",
        readonly: false,
        featured: true,
        required: true,
        disabled: false,
        placeholder: "User's name",
//              validator: VueFormGenerator.validators.string
      },
      {
        type: "input",
        inputType: "password",
        label: "Password",
        model: "password",
        min: 6,
        required: true,
        hint: "Minimum 6 characters",
//              validator: VueFormGenerator.validators.string
      },
      {
        type: "input",
        inputType: "email",
        label: "E-mail",
        model: "email",
        placeholder: "User's e-mail address",
//              validator: VueFormGenerator.validators.email
      },
      {
        type: "checklist",
        label: "Skills",
        model: "skills",
        required: true,
        values: [
          "HTML5",
          "Javascript",
          "CSS3",
          "CoffeeScript",
          "AngularJS",
          "ReactJS",
          "VueJS"
        ],
//              validator: VueFormGenerator.validators.array
      },
      {
        type: "checkbox",
        label: "Status",
        model: "status",
        multi: true,
        readonly: false,
        featured: false,
        disabled: false,
        default: true
      },
      {
        type: "submit",
        model: "submit",
        name: 'submitBtn',
        disabled: false,
        buttonText: '提交',
        onSubmit: function () {
          console.log('hello ,jiayou')
        }
      }
    ]
  },
  formOptions: {
    validateAfterLoad: true,
    validateAfterChanged: true
  },
  apiUrl: 'http://www.com.com'
})

export const getters = {
  modelGetter : state => state.model,
  schemaGetter : state => state.schema,
  formOptionsGetter : state => state.formOptions,
  apiUrlGetter: state => state.apiUrl
}

export const mutations = {

  // SUBMIT_MODEL_CHANGE: (state,newModel) => {
  //   state.model.opened = !state.sidebar.opened;
  // }
}



export const actions = {
  // async ToggleSideBar({ commit }){
  //   commit('TOGGLE_SIDEBAR')
  // }
  // async  SUBMIT_MODEL_CHANGE ({commit}) {
  // }
}
