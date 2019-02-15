import { inject, observer } from 'mobx-react';
import React from 'react';
import { FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions, NavigationScreenProp } from 'react-navigation';

import { Header, ListItem } from '../components';
import { ListItemProps } from '../components/ListItem';
import { localize } from '../locales';
import { ServerStore } from '../stores';

interface Props {
  server: ServerStore;
  navigation: NavigationScreenProp<any>;
}

interface State {
  isSelecting: boolean;
  selectedServers: number[];
}

const initialState: State = {
  isSelecting: false,
  selectedServers: [],
};

@inject('server')
@observer
class Servers extends React.Component<Props, State> {
  readonly state = initialState;

  onPressBack = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  onPressRemove = () => {
    this.state.selectedServers.map(serverId => {
      this.props.server.remove(serverId);
    });

    if (!this.props.server.hasServer) {
      // @ts-ignore
      this.props.navigation.reset(
        [NavigationActions.navigate({ routeName: 'Welcome' })],
        0,
      );
    } else {
      this.setState(initialState);
    }
  };

  onPressGoToEdit = (serverId: number) => {
    this.props.navigation.push('ServerEdit', { serverId });
  };

  onPressItemLeft = (serverId: number) => {
    const selectedServers = [...this.state.selectedServers];

    const index = selectedServers.findIndex(e => e === serverId);
    if (index >= 0) {
      selectedServers.splice(index, 1);
    } else {
      selectedServers.push(serverId);
    }

    const isSelecting = selectedServers.length > 0;

    this.setState({ isSelecting, selectedServers });
  };

  renderItem = ({ item }: { item: ListItemProps }) => <ListItem {...item} />;

  render() {
    const { selectedServers } = this.state;

    const data = this.props.server.serversData.map(
      (server): ListItemProps => {
        const isSelected = selectedServers.includes(server.id!);
        return {
          key: server.id!.toString(),
          onPress: this.onPressGoToEdit,
          left: isSelected ? 'check' : server.icon,
          leftOnPress: this.onPressItemLeft,
          leftBgColor: isSelected ? 'success' : undefined,
          leftTextColor: isSelected ? 'success' : server.iconColor,
          center: server.name,
          centerBelow: server.uri!.replace('/api', ''),
          right: true,
          pressReturn: server.id,
        };
      },
    );

    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <Header
          title={localize('Servers').toUpperCase()}
          leftIcon={true}
          leftOnPress={this.onPressBack}
          rightIcon="delete-forever"
          rightColor="danger"
          rightOnPress={this.onPressRemove}
          rightIsShowing={this.state.isSelecting}
        />

        <FlatList
          data={data}
          renderItem={this.renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
  },

  finishedContainer: {
    margin: 12,
    marginHorizontal: 24,
    backgroundColor: '$brandSuccess',
    borderRadius: 12,
  },
  finished: {
    color: '$brandSuccessText',
    fontSize: '$fontSizeLg',
    textAlign: 'center',
    padding: 6,
  },
});

export default Servers;
