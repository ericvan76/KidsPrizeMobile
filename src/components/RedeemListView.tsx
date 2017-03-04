import moment from 'moment';
import * as NB from 'native-base';
import React from 'react';
import RN from 'react-native';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createRedeemAsync, getRedeemsAsync } from '../actions/child';
import * as routes from '../routes';
import theme from '../theme';
import { Child, Redeem } from '../types/api';
import { AppState } from '../types/states';

export interface OwnProps {
  navigator: RN.Navigator;
}

interface StateProps {
  child: Child;
  redeems: Array<Redeem>;
}

interface DispatchProps {
  createRedeemAsync: typeof createRedeemAsync;
  getRedeemsAsync: typeof getRedeemsAsync;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  dataSource: RN.ListViewDataSource;
}

class RedeemListView extends React.PureComponent<Props, State> {

  public constructor(props: Props) {
    super(props);
    this.state = {
      dataSource: this.createDataSource()
    };
  }

  private createDataSource() {
    return new RN.ListView.DataSource({
      rowHasChanged: (r1: Redeem, r2: Redeem) => {
        return r1 !== r2;
      }
    });
  }

  private renderRow(redeem: Redeem) {
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
              <NB.Button transparent onPress={() => this.props.navigator.pop()}>
                <NB.Icon name={theme.icons.back} />
              </NB.Button>
            </NB.Left>
            <NB.Body>
              <NB.Title ellipsizeMode="tail" numberOfLines={1}>{this.props.child.name}</NB.Title>
              <NB.Text note>Available: {this.props.child.totalScore}</NB.Text>
            </NB.Body>
            <NB.Right>
              <NB.Button transparent onPress={() => {
                const child = this.props.child;
                this.props.navigator.push(routes.addRedeemRoute({
                  navigator: this.props.navigator,
                  child,
                  onSubmit: (description: string, value: number) => {
                    this.props.createRedeemAsync(child.id, description, value);
                    this.props.navigator.pop();
                  }
                }));
              }}>
                <NB.Text>Add</NB.Text>
              </NB.Button>
            </NB.Right>
          </NB.Header>
          <RN.ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
            onEndReached={() => this.props.getRedeemsAsync(this.props.child.id)}
            onEndReachedThreshold={0}
          />
          <NB.Footer>
            <NB.FooterTab>
              <NB.Button onPress={() => this.props.navigator.pop()}>
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
  const childState = Object.keys(state.children).map(k => state.children[k]).find(c => c.isCurrent);
  if (!childState) {
    throw new Error('Attempt to render Redeems without child.');
  }
  return {
    child: childState.child,
    redeems: childState.redeems
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, OwnProps> = (dispatch) => {
  return bindActionCreators(
    {
      createRedeemAsync,
      getRedeemsAsync
    },
    dispatch);
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(RedeemListView);
