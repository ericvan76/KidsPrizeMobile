/* @flow */
import { Dimensions } from 'react-native';
import theme from './light';

const {height, width} = Dimensions.get('window');

export default Object.assign({}, theme, {

  // overrides
  inputFontSize: theme.fontSizeBase * 1.1,

  // my themes
  screenWidth: width,
  screenHeight: height,

  shadowColor: '#000000',
  shadowOpacity: 0.8,

  taskFontSize: theme.fontSizeBase * 1.1,
  starSize: theme.fontSizeBase * 2.2,

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