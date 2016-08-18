import React, {Component} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Drawer from 'react-native-drawer';
import {switchChild, refresh, fetchMore, setScore} from '../actions';
import HeadBar from '../components/HeadBar';
import ScoreListView from '../components/ScoreListView';
import DrawerMenu from '../components/DrawerMenu';
import * as routes from '../routes';
import * as icons from '../components/Icon';
//import styles from '../styles';

class MainView extends Component {

  _switchChild(id) {
    if (this.props.child.id != id) {
      this.refs.listView.scrollToTop();
      this.props.actions.switchChild(id);
    }
  }
  _renderDrawer() {
    const items = [
      ...this.props.children.map(c => {
        return {
          icon: (c.gender.toLowerCase() === 'male')
            ? icons.BOY
            : icons.GIRL,
          title: c.name,
          onPress: () => {
            this._switchChild(c.id);
            this.refs.drawer.close();
          }
        };
      }), {
        title: '-'
      }, {
        icon: icons.ADD,
        title: 'Add Child',
        onPress: () => {
          this.props.navigator.push(new routes.ChildViewRoute());
          this.refs.drawer.close();
        }
      }, {
        title: '-'
      }, {
        icon: icons.SETTINGS,
        title: 'Settings',
        onPress: () => {
          this.props.navigator.push(new routes.ChildListViewRoute());
          this.refs.drawer.close();
        }
      }, {
        icon: icons.INFO,
        title: 'About'
      }
    ];
    return (
      <View style={styles.container}>
        <DrawerMenu items={items}/>
      </View>
    );
  }
  render() {
    if (!this.props.user || !this.props.child) {
      return null;
    }
    const leftButton = {
      icon: icons.MENU,
      handler: () => {
        this.refs.drawer.open();
      }
    };
    const title = {
      text: this.props.child.name
    };
    return (
      <Drawer ref='drawer' content={this._renderDrawer()} openDrawerOffset={0.2} tapToClose={true}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => this.refs.listView.scrollToTop()}>
            <View>
              <HeadBar leftButton={leftButton} title={title}/>
            </View>
          </TouchableWithoutFeedback>
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
  navigator: React.PropTypes.object.isRequired,
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
