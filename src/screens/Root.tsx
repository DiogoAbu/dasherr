import { inject, observer } from 'mobx-react';
import React from 'react';
import { Animated } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { createAppContainer } from 'react-navigation';
import { createFluidNavigator } from 'react-navigation-fluid-transitions';

import { Flasher, StatusBar } from '../components';
import { setupLocale } from '../locales';
import { GeneralStore, ServerStore } from '../stores';

import Details from './Details';
import Home from './Home';
import IconColorPicker from './IconColorPicker';
import IconPicker from './IconPicker';
import ServerEdit from './ServerEdit';
import Servers from './Servers';
import Settings from './Settings';
import Welcome from './Welcome';

interface Props {
  general?: GeneralStore;
  server?: ServerStore;
}

interface State {
  opacity: Animated.AnimatedValue;
}

const initialState: State = {
  opacity: new Animated.Value(0),
};

@inject('general', 'server')
@observer
class Root extends React.Component<Props, State> {
  readonly state = initialState;

  hasAnyServer = false;

  componentWillMount() {
    // This dereferences and just copies the value once
    // Future updates will not be tracked
    this.hasAnyServer = this.props.server!.hasServer;
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 750,
    }).start();
  }

  // Reacts to changes on props used in render
  componentWillReact() {
    setupLocale(this.props.general!.language, this.props.general!.isRtl);
    this.forceUpdate();
  }

  render() {
    // @ts-ignore
    const { language, isRtl } = this.props.general!;

    const route = this.hasAnyServer === false ? 'Welcome' : 'Home';
    const params = this.hasAnyServer === false ? { disableGoBack: true } : {};

    const RootNavigator = createFluidNavigator(
      {
        Details,
        Home,
        IconColorPicker,
        IconPicker,
        ServerEdit,
        Servers,
        Settings,
        Welcome,
      },
      {
        initialRouteName: route,
        initialRouteParams: params,
        cardStyle: {
          backgroundColor: EStyleSheet.value('$bgColor'),
        },
      },
    );
    const RootContainer = createAppContainer(RootNavigator);

    return (
      <Animated.View
        style={[styles.container, { opacity: this.state.opacity }]}
      >
        <StatusBar />
        <RootContainer />
        <Flasher />
      </Animated.View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '$bgColor',
    opacity: 0,
  },
});

export default Root;
