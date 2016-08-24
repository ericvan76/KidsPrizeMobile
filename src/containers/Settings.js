import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Cell, Section, TableView} from 'react-native-tableview-simple';

import Header from '../components/Header';
import * as routes from '../routes';

class Settings extends Component {
  handleEditChild(id) {
    this.props.navigator.push(new routes.EditChildRoute(id));
  }
  render() {
    const childrenRows = Object.values(this.props.children).map(c => {
      return <Cell accessory='DisclosureIndicator' key={c.id} title={c.name} onPress={this.handleEditChild.bind(this, c.id)}/>;
    });
    return (
      <View style={styles.conntainer}>
        <Header title='Settings' leftButton='#ma:arrow-back' onLeftPress={() => this.props.navigator.pop()}/>
        <ScrollView style={styles.conntainer}>
          <TableView>
            <Section header="CHILDREN">
              {childrenRows}
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}

Settings.propTypes = {
  children: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    gender: React.PropTypes.oneOf(['M', 'F']).isRequired
  })).isRequired,
  navigator: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    children: Object.values(state.children).map(c => {
      return {id: c.id, name: c.name, gender: c.gender};
    })
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      //todo: add actions here
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  conntainer: {
    flex: 1,
    backgroundColor: '$section.backgroundColor'
  }
});
