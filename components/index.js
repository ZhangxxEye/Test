import Affix from './affix';
import Alert from './alert'
import DemoBox from './DemoBox'
import Aside from './aside';
import Modal from './modal';
import Hamburger from './Hamburger';
import Iconsvg from './Iconsvg';
import Expanding from './Expanding';
import Vuetable from './vueTable';
import Vueform from './vueForm';
import { TkTable, TkTableColumn } from './tkTable/index';

const components = {
  Affix,
  Alert,
  Aside,
  DemoBox,
  Modal,
  Hamburger,
  Iconsvg,
  Expanding,
  Vuetable,
  Vueform,
  TkTable,
  TkTableColumn
}

const install = function (Vue, options) {
  //if (install.installed) return;

  Object.keys(components).forEach(key => Vue.component(key, components[key]));

  //Vue.prototype.$notify = Notify;
  //Vue.prototype.$modal = MessageModal;
};


export {
  install
};
