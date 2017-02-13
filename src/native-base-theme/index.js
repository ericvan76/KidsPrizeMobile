/* @flow */

import getTheme from './components';
import variables from './variables/platform';

// override variables
if (variables.platform === 'ios') {

  variables.toolbarDefaultBg = '#f4f4f4';
  variables.toolbarHeight = 72;

  variables.footerDefaultBg = '#f4f4f4';
  variables.footerHeight = 55;
  variables.tabActiveBgColor = undefined;

}

// new variables
variables.starColor = '#333';
variables.starSize = 36;

const theme = getTheme(variables);

// override default styles
theme['NativeBase.Container'].backgroundColor = variables.cardDefaultBg;

theme.icons = {
  menu: 'menu',
  settings: 'settings',
  back: 'arrow-back',
  close: 'close',

  tabMain: 'apps',
  tabRedeem: 'cart',

  male: 'man',
  female: 'woman',
  addChild: 'person-add',
  signOut: 'exit',

  star: 'star',

  formName: 'person',
  formTasks: 'list',

  remove: 'remove-circle',
  reorder: 'reorder',
  addTask: 'add-circle'
};

export default theme;

