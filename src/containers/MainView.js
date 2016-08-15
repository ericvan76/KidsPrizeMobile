import React, {Component} from 'react';
import {View} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';
import {Actions} from '../actions';
import Header from '../components/Header';
import TaskListView from '../components/TaskListView';
import DrawerMenu from '../components/DrawerMenu';
import styles from '../styles';

class MainView extends Component {
  _closeDrawer() {
    this._drawer.close();
  }
  _openDrawer() {
    this._drawer.forceUpdate();
    this._drawer.open();
  }
  _renderDrawer() {
    let items = [
      ...this.props.childList.map(c => {
        return {
          icon: (c.gender.toLowerCase() === 'male')
            ? 'male'
            : 'female',
          title: c.name
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
    return (
      <Drawer ref={(ref) => this._drawer = ref} content={this._renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        <View style={styles.container}>
          <Header
            style={styles.header}
            iconStyle={styles.icon}
            titleStyle={styles.title}
            icon='bars'
            title={this.props.child.name}
            onIconPress={() => this._openDrawer()}/>
          <TaskListView child={this.props.child} actions={this.props.actions}/>
        </View>
      </Drawer>
    );
  }
}

MainView.propTypes = {
  user: React.PropTypes.object.isRequired,
  child: React.PropTypes.object.isRequired,
  childList: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
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
    actions: bindActionCreators(Actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
