import { inject, observer } from 'mobx-react';
import React from 'react';
import { Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-navigation';

import { GeneralStore, Stores } from '../stores';
import { FlashMessage } from '../types';

interface Props {
  flashQueue?: GeneralStore['flashQueue'];
  removeFlash?: GeneralStore['removeFlash'];
  flashTimeout?: GeneralStore['flashTimeout'];
}

const SafeAreaViewAnim = Animatable.createAnimatableComponent(SafeAreaView);

@inject(({ general }: Stores) => ({
  flashQueue: general.flashQueue,
  removeFlash: general.removeFlash,
  flashTimeout: general.flashTimeout,
}))
@observer
class Flasher extends React.Component<Props> {
  container: any = React.createRef<any>();
  message: any = React.createRef<any>();
  timeout: any;

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  hide = () => {
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);

      const { flashQueue, removeFlash } = this.props;
      // If it's the last message, hide the whole container
      if (flashQueue!.length === 1) {
        this.container.current.fadeOut(500).then(removeFlash);
      } else {
        this.message.current.fadeOutLeft(500).then(removeFlash);
      }
    }, this.props.flashTimeout);
  };

  renderIcon(type: FlashMessage['type']) {
    let icon = '';
    switch (type) {
      case 'info':
        icon = 'information';
        break;
      case 'warning':
        icon = 'alert-circle';
        break;
      case 'danger':
        icon = 'bug';
        break;
      default:
        icon = 'check-circle';
        break;
    }
    return <Icon name={icon} style={[styles.icon, styles[type]]} />;
  }

  render() {
    if (this.props.flashQueue!.length === 0) {
      return null;
    }

    return (
      <SafeAreaViewAnim
        ref={this.container}
        forceInset={{
          top: 'never',
          bottom: 'always',
          horizontal: 'always',
        }}
        style={styles.outerContainer}
        animation="fadeIn"
        useNativeDriver={true}
      >
        {this.props.flashQueue!.map((each, index) => (
          <Animatable.View
            key={each.title + index}
            ref={index === 0 ? this.message : undefined}
            style={styles.container}
            animation={index === 0 ? 'fadeInLeft' : undefined}
            onAnimationEnd={this.hide}
            useNativeDriver={true}
          >
            {this.renderIcon(each.type)}
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
              {each.title}
            </Text>
          </Animatable.View>
        ))}
      </SafeAreaViewAnim>
    );
  }
}

const DEFAULT_HEIGHT = 49;
// const COMPACT_HEIGHT = 29;

const styles = EStyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: DEFAULT_HEIGHT,
    backgroundColor: '$statusBarBgColor',
    zIndex: 1,
    paddingHorizontal: 12,
    height: 30,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 30,
  },
  icon: {
    color: '$textColor',
    fontSize: '$fontSizeLg',
    marginRight: 6,
  },
  text: {
    color: '$textColor',
    fontSize: '$fontSizeSm',
    flex: 1,
    flexWrap: 'wrap',
  },
  success: {
    color: '$brandSuccess',
  },
  info: {
    color: '$brandInfo',
  },
  warning: {
    color: '$brandWarning',
  },
  danger: {
    color: '$brandDanger',
  },
});

export default Flasher;
