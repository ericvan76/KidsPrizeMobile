import React, {Component} from 'react';
import {View, TouchableHighlight} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';
import {switchChild, refresh, fetchMore, setScore} from '../actions';
import Header from '../components/Header';
import ScoreListView from '../components/ScoreListView';
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
    if (this.props.child.id != id) {
      this.refs.listView.scrollToTop();
      this.props.actions.switchChild(id);
    }
    this._closeDrawer();
  }
  _renderDrawer() {
    const items = [
      ...this.props.children.map(c => {
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
    if (!this.props.user || !this.props.child) {
      return null;
    }
    return (
      <Drawer ref='drawer' content={this._renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        <View style={styles.container}>
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
          <ScoreListView
            ref='listView'
            styles={styles}
            child={this.props.child}
            scores={this.props.scores}
            actions={this.props.actions}/>
        </View>
      </Drawer>
    );
  }
}

MainView.propTypes = {
  user: React.PropTypes.object,
  children: React.PropTypes.arrayOf(React.PropTypes.shape({id: React.PropTypes.string.isRequired, name: React.PropTypes.string.isRequired, gender: React.PropTypes.string.isRequired})).isRequired,
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
