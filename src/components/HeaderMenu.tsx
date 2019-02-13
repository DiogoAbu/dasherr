import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-navigation';

import { localize } from '../locales';

import TouchableItem from './TouchableItem';

interface Props {
  onPressMenuItem(type: string): void;
}

interface State {
  current: 'new' | 'soon' | 'all';
}

const initialState = {
  current: 'new' as State['current'],
};

class HeaderMenu extends React.Component<Props, State> {
  readonly state = initialState;

  new = React.createRef<any>();
  soon = React.createRef<any>();
  all = React.createRef<any>();

  current: string = 'new';

  onPressNew = () => {
    if (this.state.current !== 'new') {
      this.setState({ current: 'new' });
      this.new.current.transitionTo({ scale: 1.2 });
      this.soon.current.transitionTo({ scale: 1.0 });
      this.all.current.transitionTo({ scale: 1.0 });
    }
    this.props.onPressMenuItem('new');
  };

  onPressSoon = () => {
    if (this.state.current !== 'soon') {
      this.setState({ current: 'soon' });
      this.new.current.transitionTo({ scale: 1.0 });
      this.soon.current.transitionTo({ scale: 1.2 });
      this.all.current.transitionTo({ scale: 1.0 });
    }
    this.props.onPressMenuItem('soon');
  };

  onPressAll = () => {
    if (this.state.current !== 'all') {
      this.setState({ current: 'all' });
      this.new.current.transitionTo({ scale: 1.0 });
      this.soon.current.transitionTo({ scale: 1.0 });
      this.all.current.transitionTo({ scale: 1.2 });
    }
    this.props.onPressMenuItem('all');
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{ top: 'always', bottom: 'never', horizontal: 'always' }}
      >
        <View style={styles.container}>
          <TouchableItem
            borderless={true}
            useForeground={true}
            style={styles.textTouch}
            onPress={this.onPressNew}
          >
            <Animatable.Text
              ref={this.new}
              numberOfLines={1}
              style={[
                styles.text,
                this.state.current === 'new' && styles.textActive,
              ]}
              useNativeDriver={true}
            >
              {localize('New')}
            </Animatable.Text>
          </TouchableItem>

          <TouchableItem
            borderless={true}
            useForeground={true}
            style={styles.textTouch}
            onPress={this.onPressSoon}
          >
            <Animatable.Text
              ref={this.soon}
              numberOfLines={1}
              style={[
                styles.text,
                this.state.current === 'soon' && styles.textActive,
              ]}
              useNativeDriver={true}
            >
              {localize('Soon')}
            </Animatable.Text>
          </TouchableItem>

          <TouchableItem
            borderless={true}
            useForeground={true}
            style={styles.textTouch}
            onPress={this.onPressAll}
          >
            <Animatable.Text
              ref={this.all}
              numberOfLines={1}
              style={[
                styles.text,
                this.state.current === 'all' && styles.textActive,
              ]}
              useNativeDriver={true}
            >
              {localize('All')}
            </Animatable.Text>
          </TouchableItem>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 6,
    marginTop: 24,
  },
  textTouch: {
    padding: 12,
    flexWrap: 'nowrap',
  },
  text: {
    color: '$textColorFaded',
    fontSize: '$fontSizeLg',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
  textActive: {
    color: '$textColor',
    transform: [{ scale: 1.2 }],
  },
});

export default HeaderMenu;
