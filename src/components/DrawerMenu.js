import React, {Component} from 'react';
import {View, Text, ListView, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Seperator from '../components/Seperator';

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  seperatorContainer: {
    height: 20,
    justifyContent: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  icon: {
    flex: 0.3,
    fontSize: 24,
    textAlign: 'center'
  },
  title: {
    flex: 0.7,
    fontSize: 16,
    textAlign: 'left',
    paddingRight: 20
  }
});

export default class DrawerMenu extends Component {
  _buildDataSource() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1 !== r2;
      }
    });
    return ds.cloneWithRows(this.props.items, Object.keys(this.props.items));
  }
  _renderRow(rowData, sectionID, rowID) {
    let elements = [];
    if (rowData.title === '-') {
      return (
        <View style={styles.seperatorContainer}><Seperator/></View>
      );
    }
    if (rowData.icon !== undefined) {
      elements.push(<Icon key={`${rowID}-icon`} style={styles.icon} name={rowData.icon}/>);
    } else {
      elements.push(<Text key={`${rowID}-icon`} style={styles.icon}/>);
    }
    elements.push(
      <Text key={rowID} style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{rowData.title}</Text>
    );
    return (
      <TouchableHighlight underlayColor='white' onPress={rowData.onPress}>
        <View style={styles.itemContainer}>
          {elements}
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    return (<ListView
      style={styles.container}
      dataSource={this._buildDataSource()}
      renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}
      removeClippedSubviews={false}/>);
  }
}

DrawerMenu.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({icon: React.PropTypes.string, title: React.PropTypes.string.isRequired}))
};
