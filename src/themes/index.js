/* @flow */
import { Platform } from 'react-native';

import theme from './light';

export default Object.assign({}, theme, {

  // overrides
  inputFontSize: theme.fontSizeBase * 1.1,
  titleFontSize: (Platform.OS === 'ios') ? 20 : 22,
  toolbarHeight: (Platform.OS === 'ios') ? 72 : 64,
  toolbarIconSize: (Platform.OS === 'ios') ? 22 : 24,

  // my themes
  shadowColor: '#000000',
  shadowOpacity: 0.8,

  listNote: {
    color: theme.listNoteColor,
    fontSize: theme.fontSizeBase * 1.1,
    fontWeight: 'normal',
  },

  iconRight: {
    color: theme.listNoteColor,
    fontSize: theme.iconFontSize * 0.8,
    fontWeight: 'normal',
  }
});