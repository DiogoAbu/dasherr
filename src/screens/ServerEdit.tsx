import { inject, observer } from 'mobx-react';
import React from 'react';
import { Keyboard, ScrollView, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';

import { Header, ListInput, TouchableItem } from '../components';
import { localize } from '../locales';
import { ServerStore } from '../stores';
import { Server } from '../types';

interface Params {
  serverId: number;
}

interface Props {
  server: ServerStore;
  navigation: NavigationScreenProp<any, Params>;
}

interface State {
  id?: number;
  name?: string;
  icon?: string;
  iconColor?: string;
  uri?: string;
  apiKey?: string;

  shouldGuessIcon: boolean;

  errorName?: string;
  errorIcon?: string;
  errorIconColor?: string;
  errorUri?: string;
  errorApiKey?: string;

  isWaiting: boolean;
}

const initialState: State = {
  shouldGuessIcon: true,
  isWaiting: false,
};

@inject('server')
@observer
class ServerEdit extends React.Component<Props, State> {
  readonly state = initialState;

  componentWillMount() {
    const serverId = this.props.navigation.getParam('serverId', -1);
    if (serverId > -1) {
      const server = this.props.server.getServer(serverId);

      this.setState({
        id: server.id,
        name: server.name,
        icon: server.icon,
        iconColor: server.iconColor,
        uri: server.uri,
        apiKey: server.apiKey,
      });
    } else {
      this.setState({
        icon: 'server-network',
        iconColor: EStyleSheet.value('$brandInfo'),
      });
    }
  }

  guessIcon = (name: string): string => {
    const icon = name.toLowerCase();

    if (Icon.hasIcon(icon)) {
      return icon;
    }

    return this.state.icon!;
  };

  onPressBack = () => {
    requestAnimationFrame(() => {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    });
  };

  onPressDone = () => {
    this.setState({ isWaiting: true });

    try {
      const server: Server = {
        id: typeof this.state.id === 'number' ? this.state.id : undefined,
        name: this.state.name!,
        icon: this.state.icon!,
        iconColor: this.state.iconColor!,
        uri: this.state.uri!,
        apiKey: this.state.apiKey!,
      };

      this.props.server.add(server);

      requestAnimationFrame(() => {
        Keyboard.dismiss();
        this.props.navigation.goBack();
      });
    } catch (err) {
      this.setState({
        isWaiting: false,
        errorName: err.name || undefined,
        errorIcon: err.icon || undefined,
        errorIconColor: err.iconColor || undefined,
        errorUri: err.uri || undefined,
        errorApiKey: err.apiKey || undefined,
      });
    }
  };

  onPressGoToIcon = () => {
    requestAnimationFrame(() => {
      this.props.navigation.push('IconPicker', {
        iconColor: this.state.iconColor,
        onChangeIcon: this.onChangeIcon,
      });
    });
  };

  onPressGoToIconColor = () => {
    requestAnimationFrame(() => {
      this.props.navigation.push('IconColorPicker', {
        icon: this.state.icon,
        iconColor: this.state.iconColor,
        onChangeIconColor: this.onChangeIconColor,
      });
    });
  };

  onChangeTextName = (name: string) => {
    let icon = this.state.icon;

    if (this.state.shouldGuessIcon) {
      icon = this.guessIcon(name);
    }

    this.setState({ name, icon });
  };

  onChangeIcon = (icon: string) => {
    this.setState({ icon, shouldGuessIcon: false });
  };

  onChangeIconColor = (iconColor: string) => {
    this.setState({ iconColor, shouldGuessIcon: false });
  };

  onChangeTextUri = (uri: string) => {
    this.setState({ uri });
  };

  onChangeTextApiKey = (apiKey: string) => {
    this.setState({ apiKey });
  };

  render() {
    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    const {
      errorName,
      errorIcon,
      errorIconColor,
      errorUri,
      errorApiKey,
    } = this.state;

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <Header
          title={localize('Server').toUpperCase()}
          leftIcon={true}
          leftOnPress={this.onPressBack}
          leftDisabled={this.state.isWaiting}
          right={localize(typeof this.state.id === 'number' ? 'Save' : 'Add')}
          rightColor="success"
          rightOnPress={this.onPressDone}
          rightDisabled={this.state.isWaiting}
        />

        <ScrollView style={styles.contentContainer}>
          <ListInput
            label={localize('Name')}
            message={errorName}
            placeholder={localize('Name Placeholder')}
            maxLength={this.props.server.serverNameMaxLength}
            onChangeText={this.onChangeTextName}
            value={this.state.name}
            containerStyle={styles.inputContainer}
            hasError={!!errorName}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <ListInput
                label={localize('Icon')}
                message={errorIcon}
                hasTextInput={false}
              />

              <View style={styles.iconSection}>
                <TouchableItem
                  style={styles.iconContainer}
                  onPress={this.onPressGoToIcon}
                >
                  <Icon
                    name={this.state.icon!}
                    style={[styles.icon, { color: this.state.iconColor }]}
                  />
                </TouchableItem>
              </View>
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <ListInput
                label={localize('Icon Color')}
                message={errorIconColor}
                hasTextInput={false}
              />

              <View style={styles.iconSection}>
                <TouchableItem
                  style={styles.iconContainer}
                  onPress={this.onPressGoToIconColor}
                >
                  <View
                    style={[
                      styles.iconColor,
                      { backgroundColor: this.state.iconColor },
                    ]}
                  />
                </TouchableItem>
              </View>
            </View>
          </View>

          <ListInput
            label={localize('Connection Address')}
            message={errorUri}
            placeholder={localize('Connection Address Placeholder')}
            autoCapitalize="none"
            onChangeText={this.onChangeTextUri}
            value={this.state.uri}
            containerStyle={styles.inputContainer}
            hasError={!!errorUri}
          />

          <ListInput
            label={localize('API Key')}
            message={errorApiKey}
            placeholder={localize('API Key Placeholder')}
            autoCapitalize="none"
            onChangeText={this.onChangeTextApiKey}
            value={this.state.apiKey}
            containerStyle={styles.inputContainer}
            hasError={!!errorApiKey}
          />
        </ScrollView>
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

  inputContainer: {
    marginBottom: 12,
  },

  iconSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 6,
  },
  iconContainer: {
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: '$bgColorContrast',
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: EStyleSheet.hairlineWidth,
  },
  icon: {
    color: '$textColor',
    fontSize: '$fontSizeXx',
  },

  iconColor: {
    width: '$fontSizeXx',
    height: '$fontSizeXx',
    borderRadius: '$fontSizeXx / 2',
  },
});

export default ServerEdit;
