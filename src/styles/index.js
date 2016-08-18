import {StyleSheet} from 'react-native';

// const FONT_X_SMALL = 8;
const FONT_SMALL = 16;
const FONT_MEDIUM = 24;
const FONT_LARGE = 32;
const FONT_X_LARGE = 40;

const HEADER_BK_COLOR = '#4c07a7';
const DARK_COLOR = '#4c07a7';
const LIGHT_COLOR = '#ffffff';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  // drawer
  drawerHeader: {
    height: 120,
    backgroundColor: '#1e5f03'
  },

  drawerIcon: {
    fontSize: FONT_X_LARGE,
    color: LIGHT_COLOR
  },

  header: {
    height: 80,
    backgroundColor: HEADER_BK_COLOR
  },

  title: {
    fontSize: FONT_MEDIUM,
    color: '#FFFFFF'
  },
  icon: {
    fontSize: FONT_MEDIUM,
    color: '#FFFFFF'
  },

  // section header
  section: {
    backgroundColor: DARK_COLOR
  },
  sectionText: {
    color: LIGHT_COLOR,
    fontSize: FONT_SMALL
  },
  // task rows
  task: {
    color: DARK_COLOR,
    fontSize: FONT_SMALL
  },
  star: {
    color: DARK_COLOR,
    fontSize: FONT_LARGE
  }
});
