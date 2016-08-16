import React, {Component} from 'react';
import {View, TouchableHighlight} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';
import * as actions from '../actions';
import Header from '../components/Header';
import TaskListView from '../components/TaskListView';
import DrawerMenu from '../components/DrawerMenu';
import styles from '../styles';

class MainView extends Component {
  _openDrawer() {
    this.refs.drawer.open();
  }
  _closeDrawer() {
    this.refs.drawer.close();
  }
  _switchChild(id) {
    if (this.props.user.currentChildId != id) {
      this.props.actions.switchChild(id);
      this.refs.listView.scrollToTop();
    }
    this._closeDrawer();
  }
  _renderDrawer() {
    let items = [
      ...this.props.childList.map(c => {
        return {
          icon: (c.gender.toLowerCase() === 'male')
            ? 'male'
            : 'female',
          title: c.name,
          onPress: () => this._switchChild(c.id)
        };
      }), {
        title: '-'
      }, {
        icon: 'plus',
        title: 'Add Child'
      }, {
        title: '-'
      }, {
        icon: 'cog',
        title: 'Settings'
      }, {
        icon: 'info',
        title: 'About'
      }
    ];
    return (
      <View style={styles.container}>
        <Header style={styles.drawerHeader} iconStyle={styles.drawerIcon} icon='user' title={this.props.user.name}/>
        <DrawerMenu items={items}/>
      </View>
    );
  }
  render() {
    let mainView = null;
    if (this.props.child !== undefined) {
      mainView = <View style={styles.container}>
        <TouchableHighlight onPress={() => this.refs.listView.scrollToTop()}>
          <View>
            <Header
              style={styles.header}
              iconStyle={styles.icon}
              titleStyle={styles.title}
              icon='bars'
              title={this.props.child.name}
              onIconPress={() => this._openDrawer()}/>
          </View>
        </TouchableHighlight>
        <TaskListView ref='listView' child={this.props.child} actions={this.props.actions}/></View>;
    }
    return (
      <Drawer ref='drawer' content={this._renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        {mainView}
      </Drawer>
    );
  }
}

MainView.propTypes = {
  user: React.PropTypes.object.isRequired,
  child: React.PropTypes.object,
  childList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  actions: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    child: state.children[state.user.currentChildId],
    childList: Object.values(state.children).map(c => {
      return {id: c.id, name: c.name, gender: c.gender};
    })
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
