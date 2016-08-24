import React, {Component} from 'react';
import {View, ScrollView, TouchableWithoutFeedback} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';
import {Section, TableView} from 'react-native-tableview-simple';

import {switchChild, refresh, fetchMore, setScore} from '../actions';
import Header from '../components/Header';
import ScoreListView from '../components/ScoreListView';
import MenuCell from '../components/MenuCell';
import * as routes from '../routes';

class MainView extends Component {
  handleSwitchChild(id) {
    this.props.actions.switchChild(id);
    this.refs.drawer.close();
  }
  handleAddChild() {
    this.props.navigator.push(new routes.EditChildRoute());
    this.refs.drawer.close();
  }
  handleSettings() {
    this.props.navigator.push(new routes.SettingsRoute());
    this.refs.drawer.close();
  }
  handleAbout() {
    // todo: push about ui
    this.refs.drawer.close();
  }
  handleScrollToTop() {
    this.refs.listView.scrollToTop();
  }
  renderDrawer() {
    const childrenRows = Object.values(this.props.children).map(c => {
      const icon = c.gender === 'M'
        ? '#fa:male'
        : '#fa:female';
      return <MenuCell key={c.id} icon={icon} title={c.name} onPress={this.handleSwitchChild.bind(this, c.id)}/>;
    });
    return (
      <ScrollView style={styles.drawerContainer}>
        <TableView>
          <Section header='CHILDREN'>
            {childrenRows}
          </Section>
          <Section header='ADD'>
            <MenuCell icon='#ma:add' title='Add Child' onPress={this.handleAddChild.bind(this)}/>
          </Section>
          <Section header='OTHERS'>
            <MenuCell icon='#ma:settings' title='Settings' onPress={this.handleSettings.bind(this)}/>
            <MenuCell icon='#ma:info-outline' title='About' onPress={this.handleAbout.bind(this)}/>
          </Section>
        </TableView>
      </ScrollView>
    );
  }
  render() {
    if (!this.props.user || !this.props.child) {
      return null;
    }
    return (
      <Drawer ref='drawer' content={this.renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.handleScrollToTop.bind(this)}>
            <View>
              <Header title={this.props.child.name} leftButton='#ma:menu' onLeftPress={() => this.refs.drawer.open()}/>
            </View>
          </TouchableWithoutFeedback>
          <ScoreListView ref='listView' child={this.props.child} scores={this.props.scores} actions={this.props.actions}/>
        </View>
      </Drawer>
    );
  }
}

MainView.propTypes = {
  navigator: React.PropTypes.object.isRequired,
  user: React.PropTypes.object,
  children: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    gender: React.PropTypes.oneOf(['M', 'F']).isRequired
  })).isRequired,
  child: React.PropTypes.object,
  scores: React.PropTypes.object,
  actions: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    children: Object.values(state.children).map(c => {
      return {id: c.id, name: c.name, gender: c.gender};
    }),
    child: state.children[state.currentChildId],
    scores: state.scores[state.currentChildId]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      switchChild,
      refresh,
      fetchMore,
      setScore
    }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$normal.backgroundColor'
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '$section.backgroundColor'
  }
});
