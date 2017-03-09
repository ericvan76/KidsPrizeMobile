import _ from 'lodash';
import RN from 'react-native';

import getTheme from '../src/native-base-theme/components';
import platformVariables from '../src/native-base-theme/variables/platform';

const variables = platformVariables;
const defaultTheme = getTheme(variables);
const platform = variables.platform;

const customisedTheme = {

  'NativeBase.Container': {
    backgroundColor: variables.cardDefaultBg
  },

  'NativeBase.Content': {
  },

  'NativeBase.Header': {
    backgroundColor: '#f4f4f4',
    height: (platform === 'ios') ? 72 : 56
  },

  'NativeBase.Body': {
    '.headerStyle': {
      borderBottomColor: 'transparent'
    }
  },

  'NativeBase.Footer': {
    backgroundColor: '#f4f4f4',
    height: 55
  },

  'NativeBase.FooterTab': {
    backgroundColor: (platform === 'ios') ? 'transparent' : variables.tabActiveBgColor,
    'NativeBase.Button': {
      '.active': {
        backgroundColor: (platform === 'ios') ? 'transparent' : variables.tabActiveBgColor
      }
    }
  },

  'NativeBase.ListItem': {
    overflow: 'hidden',
    '.icon': {
      height: 50,
      'NativeBase.Left': {
        height: 50,
        paddingRight: 0
      },
      'NativeBase.Body': {
        height: 50
      },
      'NativeBase.Right': {
        height: 50
      }
    },
    '.itemDivider': {
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 0.5
    },
    '.headerStyle': {
      height: 100,
      paddingTop: 10
    }
  },

  'NativeBase.Text': {

  },

  'NativeBase.Button': {
    '.deleteStyle': {
      margin: 10,
      marginTop: 60
    }
  },

  'KidsPrize.ScoreList': {
    section: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'flex-end',
      backgroundColor: variables.listDividerBg,
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 5,
      paddingRight: 5
    } as RN.ViewStyle,
    sectionText: {
      width: 36,
      textAlign: 'center',
      lineHeight: 18,
      fontSize: variables.noteFontSize,
      color: variables.subtitleColor
    } as RN.TextStyle,
    row: {
      overflow: 'hidden',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: 5,
      paddingRight: 5
    } as RN.ViewStyle,
    task: {
      margin: 5,
      marginBottom: 0
    } as RN.TextStyle,
    starRow: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    } as RN.ViewStyle,
    star: {
      color: '#333',
      width: 36,
      fontSize: 36,
      textAlign: 'center'
    } as RN.TextStyle,
    separator: {
      height: variables.borderWidth,
      alignSelf: 'stretch',
      backgroundColor: variables.listBorderColor
    } as RN.ViewStyle
  },

  icons: {
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
    addTask: 'add-circle',

    success: 'checkmark-circle',
    error: 'close-circle'
  } as { [key: string]: string }
};

export default _.merge(defaultTheme, customisedTheme);
