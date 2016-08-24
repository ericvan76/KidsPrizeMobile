import React, {Component} from 'react';
import {Text} from 'react-native';
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
  ...Text.propTypes,
  name: React.PropTypes.string.isRequired
};
