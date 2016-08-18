import React, {Component} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class Icon extends Component {
  render() {
    const iconName = this.props.name;

    if (iconName.startsWith('#fa:')) {
      return (<FontAwesome {...this.props} name={iconName.substring(4)}/>);
    } else if (iconName.startsWith('#ma:')) {
      return (<MaterialIcon {...this.props} name={iconName.substring(4)}/>);
    } else if (iconName.startsWith('#io:')) {
      return (<Ionicon {...this.props} name={iconName.substring(4)}/>);
    }
  }
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired
};

export const MENU = '#ma:menu';
export const BACK = '#ma:arrow-back';
export const CLOSE = '#ma:close';

export const STAR = '#io:ios-star';
export const STAR_BORDER = '#io:ios-star-outline';

export const GIRL = '#fa:female';
export const BOY = '#fa:male';

export const ADD = '#ma:add';
export const SETTINGS = '#ma:settings';
export const INFO = '#ma:info-outline';
