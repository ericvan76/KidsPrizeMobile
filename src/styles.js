import {Dimensions} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

const {width} = Dimensions.get('window');

StyleSheet.build({

  rem: width > 375
    ? 18
    : 16,

  header: {
    textColor: '#FFFFFF',
    backgroundColor: '#424242'
  },
  normal: {
    textColor: '#000000',
    backgroundColor: '#FFFFFF'
  },
  section: {
    textColor: '#6d6d72',
    backgroundColor: '#EFEFF4'
  },
  seperator: {
    color: '#c8c7cc'
  },
  cell: {
    titleColor: '#000000',
    detailColor: '#8E8E93'
  }
});

// todo: put overrided styles here
export default StyleSheet.create({
  container: {
    flex: 1
  }
});
