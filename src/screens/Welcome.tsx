import { inject, observer } from 'mobx-react';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions, NavigationScreenProp } from 'react-navigation';

import { Header, ListItem, TouchableItem } from '../components';
import { ListItemProps } from '../components/ListItem';
import { localize } from '../locales';
import { RadarrStore } from '../stores';

interface Props {
  radarr: RadarrStore;
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

@inject('radarr')
@observer
class Welcome extends React.Component<Props, State> {
  readonly state = initialState;

  onPressAdd = () => {
    requestAnimationFrame(() => {
      this.props.navigation.push('ServerEdit');
    });
  };

  onPressRemove = () => {
    this.state.selectedServers.map(serverId => {
      this.props.radarr.remove(serverId);
    });

    this.setState(initialState);
  };

  onPressDone = async () => {
    if (!this.props.radarr.hasServer) {
      return;
    }

    // Fetch server data
    await this.props.radarr.mock();

    // @ts-ignore
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: 'Home' })],
      0,
    );
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

  onPressGoToEdit = (serverId: number) => {
    this.props.navigation.push('ServerEdit', { serverId });
  };

  renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {localize(
          'Tap above to add a server, you can add as much as you want to',
        )}
      </Text>
      <Text style={styles.emptyText}>{localize('When done tap below')}</Text>
    </View>
  );

  renderItem = ({ item }: { item: ListItemProps }) => <ListItem {...item} />;

  render() {
    const { selectedServers } = this.state;

    const data = this.props.radarr.serversData.map(
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
          title={localize('Welcome').toUpperCase()}
          rightIcon={this.state.isSelecting ? 'delete-forever' : 'plus'}
          rightColor={this.state.isSelecting ? 'danger' : 'success'}
          rightOnPress={
            this.state.isSelecting ? this.onPressRemove : this.onPressAdd
          }
        />

        <FlatList
          data={data}
          renderItem={this.renderItem}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={this.renderEmpty}
        />

        <TouchableItem
          onPress={this.onPressDone}
          style={styles.finishedContainer}
          disabled={!this.props.radarr.hasServer}
        >
          <Text style={styles.finished}>{localize('Done').toUpperCase()}</Text>
        </TouchableItem>
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

  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '$textColorFaded',
    fontSize: '$fontSizeLg',
    textAlign: 'center',
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

export default Welcome;
