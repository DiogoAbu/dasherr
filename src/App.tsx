import { configure } from 'mobx';
import { create } from 'mobx-persist';
import { Provider } from 'mobx-react';
import React from 'react';
import { AsyncStorage } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { setupLocale } from './locales';
import { Root } from './screens';
import stores from './stores';
import { dark } from './themes';

configure({ enforceActions: 'observed' });

interface State {
  loading: boolean;
}

const initialState: State = {
  loading: true,
};

export default class App extends React.Component<{}, State> {
  readonly state = initialState;

  async componentDidMount() {
    const hydrate = create({ storage: AsyncStorage, jsonify: true });

    // await stores.purgeAll();

    await hydrate('general', stores.general);
    await hydrate('server', stores.server);

    // Build with persisted theme
    EStyleSheet.build(dark);

    setupLocale(stores.general.language, stores.general.isRtl);

    // this.prePopulate();

    this.setState({ loading: false });
  }

  prePopulate() {
    if (__DEV__) {
      try {
        stores.server.add({
          id: 0,
          name: 'Remote Seedbox',
          icon: 'ubuntu',
          iconColor: '#e67e22',
          uri: 'http://192.168.1.33:7878',
          uriLocal: 'http://192.168.1.33:7878',
          localNetworks: ['Gilson'],
          apiKey: '57a25eff0d0f4d76880baf33727030de',
        });
      } catch (err) {
        // Already added
      }
    }

    stores.server.mockRadarr();
  }

  render() {
    if (this.state.loading === true) {
      return null;
    }

    return (
      <Provider {...stores}>
        <Root />
      </Provider>
    );
  }
}
