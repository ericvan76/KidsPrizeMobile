import _ from 'lodash';
import RN from 'react-native';

import getTheme from '../src/native-base-theme/components';
import platformVariables from '../src/native-base-theme/variables/material';

// tslint:disable-next-line:no-any
const variables: any = platformVariables;
variables.iconFamily = 'MaterialCommunityIcons';

const defaultTheme = getTheme(variables);
const platform = variables.platform;

const customisedTheme = {

  'NativeBase.Container': {
    backgroundColor: '#fff'
  },

  'NativeBase.Content': {
  },

  'NativeBase.Header': {
    backgroundColor: '#3B5998',
    height: (platform === 'ios') ? 96 : 64,
    paddingTop: (platform === 'ios') ? 20 : 0
  },

  'NativeBase.Body': {
    '.headerStyle': {
      borderBottomColor: 'transparent'
    }
  },

  'NativeBase.Footer': {
    backgroundColor: '#3B5998',
    height: (platform === 'ios') ? 72 : 56
  },

  'NativeBase.FooterTab': {
    backgroundColor: (platform === 'ios') ? 'transparent' : variables.tabActiveBgColor,
    'NativeBase.Button': {
      'NativeBase.Text': {
        color: '#ADBAD4'
      },
      'NativeBase.Icon': {
        color: '#ADBAD4'
      },
      '.active': {
        backgroundColor: (platform === 'ios') ? 'transparent' : variables.tabActiveBgColor
      }
    }
  },

  'NativeBase.ListItem': {
    '.icon': {
      height: 50,
      'NativeBase.Left': {
        height: 50,
        'NativeBase.Icon': {
          width: variables.iconFontSize - 3,
          fontSize: variables.iconFontSize - 3
        },
        'NativeBase.IconNB': {
          width: variables.iconFontSize - 3,
          fontSize: variables.iconFontSize - 3
        }
      },
      'NativeBase.Body': {
        height: 50,
        marginLeft: 0
      },
      'NativeBase.Right': {
        height: 50,
        'NativeBase.PickerNB': {
          width: 100,
          justifyContent: 'flex-end',
          marginRight: (platform === 'ios') ? undefined : -20
        }
      }
    },
    '.itemDivider': {
      paddingTop: 10,
      paddingBottom: 10,
      borderWidth: 0.5
    },
    '.headerStyle': {
      height: 96,
      marginTop: 20
    },
    overflow: 'hidden'
  },
  'NativeBase.Badge': {
    backgroundColor: '#4E6CAA'
  },
  'NativeBase.Text': {
    color: '#444'
  },
  'NativeBase.Icon': {
    color: '#444'
  },
  'NativeBase.Button': {
    '.deleteStyle': {
      margin: 10,
      marginTop: 60
    },
    '.transparent': {
      'NativeBase.Text': {
        color: '#4E6CAA'
      },
      'NativeBase.Icon': {
        color: '#4E6CAA'
      }
    }
  },

  'NativeBase.Spinner': {
    '.middle': {
      flex: 1
    } as RN.ViewStyle
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
      backgroundColor: 'transparent'
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
    back: 'arrow-left',
    close: 'close',

    tabMain: 'apps',
    tabRedeem: 'cart',

    face: 'face',
    gender: 'gender-male-female',

    addChild: 'account-plus',
    signOut: 'exit-to-app',

    star: 'star',
    star_o: 'star-outline',

    formTasks: 'view-list',

    remove: 'minus-circle',
    drag: 'drag',
    addTask: 'add-circle',

    success: 'check-circle',
    error: 'close-circle',

    trash: 'delete-forever'

  } as { [key: string]: string }
};

export default _.merge(defaultTheme, customisedTheme);
