import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createRedeemAsync, fetchRedeemsAsync } from '../actions/redeems';
import * as routes from '../routes';
import theme from '../theme';
import { Child, Redeem } from '../types/api';
import { AppState, ChildState } from '../types/states';

export interface OwnProps {
  navigator: RN.Navigator;
}

interface StateProps {
  child: Child;
  redeems: Array<Redeem>;
}

interface DispatchProps {
  createRedeemAsync: typeof createRedeemAsync;
  fetchRedeemsAsync: typeof fetchRedeemsAsync;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  refreshing: boolean;
  dataSource: RN.ListViewDataSource;
}

class RedeemListView extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      dataSource: this.createDataSource()
    };
  }

  private createDataSource = () => {
    return new RN.ListView.DataSource({
      rowHasChanged: (r1: Redeem, r2: Redeem) => {
        return r1 !== r2;
      }
    });
  }

  private renderRow = (redeem: Redeem) => {
    return (
      <NB.ListItem>
        <NB.Body>
          <NB.Text ellipsizeMode="middle" numberOfLines={1}>{redeem.description}</NB.Text>
          <NB.Text note>{moment(redeem.timestamp).format('DD-MMM-YYYY HH:mm')}</NB.Text>
        </NB.Body>
        <NB.Right>
          <NB.Text>{redeem.value}</NB.Text>
        </NB.Right>
      </NB.ListItem>
    );
  }
  private onAddRedeem = () => {
    const child = this.props.child;
    this.props.navigator.push(routes.addRedeemRoute({
      navigator: this.props.navigator,
      child,
      onSubmit: (description: string, value: number) => {
        this.props.createRedeemAsync(child.id, description, value);
        this.props.navigator.pop();
      }
    }));
  }
  private onEndReached = () => {
    if (!this.state.refreshing) {
      this.setState({ ...this.state, refreshing: true });
      this.props.fetchRedeemsAsync(this.props.child.id);
      this.setState({ ...this.state, refreshing: false });
    }
  }
  private onClose = () => {
    this.props.navigator.pop();
  }

  public componentDidMount() {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRows([])
    });
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...this.state,
      dataSource: this.state.dataSource.cloneWithRows(nextProps.redeems)
    });
  }

  public render() {
    return (
      <NB.StyleProvider style={theme}>
        <NB.Container>
          <NB.Header>
            <NB.Left>
              <NB.Button transparent onPress={this.onClose}>
                <NB.Icon name={theme.icons.back} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.child.name}</NB.Title>
            </NB.Body>
            <NB.Right>
              <NB.Button transparent onPress={this.onAddRedeem}>
                <NB.Text>Add</NB.Text>
              </NB.Button>
            </NB.Right>
          </NB.Header>
          <RN.ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            pageSize={1}
            enableEmptySections={true}
          />
          <NB.Footer>
            <NB.FooterTab>
              <NB.Button onPress={this.onClose}>
                <NB.Icon name={theme.icons.tabMain} />
                <NB.Text>Main</NB.Text>
              </NB.Button>
              <NB.Button active>
                <NB.Icon name={theme.icons.tabRedeem} active />
                <NB.Text>Redeem</NB.Text>
              </NB.Button>
            </NB.FooterTab>
          </NB.Footer>
        </NB.Container>
      </NB.StyleProvider>
    );
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps> = (state: AppState) => {
  const childState = [...state.children.values()].find(c => c.isCurrent) as ChildState;
  return {
    child: childState.child,
    redeems: childState.redeems
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch) => {
  return bindActionCreators(
    {
      createRedeemAsync,
      fetchRedeemsAsync
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(RedeemListView);
