import { computed } from 'mobx';
import { inject } from 'mobx-react';
import React from 'react';
import { GestureResponderEvent, Platform, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-navigation';
import sentenceCase from 'sentence-case';

import { Stores } from '../stores';

import TouchableItem from './TouchableItem';

interface Props {
  title: string;

  left?: string;
  leftIcon?: string | boolean;
  leftColor?: string;
  leftSize?: string | number;
  leftIsShowing?: boolean;
  leftDisabled?: boolean;
  leftOnPress?(event: GestureResponderEvent): void;

  right?: string;
  rightIcon?: string | boolean;
  rightColor?: string;
  rightSize?: string | number;
  rightIsShowing?: boolean;
  rightDisabled?: boolean;
  rightOnPress?(event: GestureResponderEvent): void;

  isLandscape?: boolean;
}

@inject(({ general }: Stores) => ({
  isLandscape: general.isLandscape,
}))
class Header extends React.PureComponent<Props> {
  leftAnim = React.createRef<any>();
  rightAnim = React.createRef<any>();

  @computed
  get marginTop() {
    return Platform.OS === 'android' ? 24 : 24;
  }

  @computed
  get height() {
    if (Platform.OS === 'ios') {
      // @ts-ignore Platform.ios has 'isPad'
      return this.props.isLandscape && !Platform.isPad ? 32 : 44;
    } else {
      return 56;
    }
  }

  componentDidMount() {
    if (this.props.leftIsShowing === false) {
      this.leftAnim.current.slideOutLeft(1);
    } else if (this.props.leftIsShowing === true) {
      this.leftAnim.current.slideInLeft(1);
    }
    if (this.props.rightIsShowing === false) {
      this.rightAnim.current.slideOutRight(1);
    } else if (this.props.rightIsShowing === true) {
      this.rightAnim.current.slideInRight(1);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.leftIsShowing !== this.props.leftIsShowing) {
      if (this.props.leftIsShowing === false) {
        this.leftAnim.current.slideOutLeft(300);
      } else if (this.props.leftIsShowing === true) {
        this.leftAnim.current.slideInLeft(300);
      }
    }

    if (prevProps.rightIsShowing !== this.props.rightIsShowing) {
      if (this.props.rightIsShowing === false) {
        this.rightAnim.current.slideOutRight(300);
      } else if (this.props.rightIsShowing === true) {
        this.rightAnim.current.slideInRight(300);
      }
    }
  }

  renderLeft = () => {
    let leftColor: string = EStyleSheet.value('$textColor');
    if (this.props.leftColor) {
      if (
        this.props.leftColor.startsWith('#') ||
        this.props.leftColor.startsWith('rgb')
      ) {
        leftColor = this.props.leftColor;
      } else {
        leftColor = EStyleSheet.value(
          `$brand${sentenceCase(this.props.leftColor)}`,
        );
      }
    }

    let leftSize: number | undefined;
    if (this.props.leftSize) {
      if (typeof this.props.leftSize === 'string') {
        leftSize = EStyleSheet.value(this.props.leftSize);
      } else if (typeof this.props.leftSize === 'string') {
        leftSize = this.props.leftSize;
      }
    }

    return this.props.left || this.props.leftIcon ? (
      <Animatable.View
        ref={this.leftAnim}
        style={[
          styles.leftContainer,
          { width: this.height, height: this.height },
        ]}
        useNativeDriver={true}
      >
        <TouchableItem
          onPress={this.props.leftOnPress}
          disabled={this.props.leftDisabled}
          borderless={true}
          useForeground={true}
          style={[
            styles.leftTouch,
            { width: this.height, height: this.height },
          ]}
        >
          {this.props.leftIcon ? (
            <Icon
              name={
                this.props.leftIcon === true
                  ? 'chevron-left'
                  : this.props.leftIcon
              }
              style={[
                styles.leftIcon,
                leftSize && { fontSize: leftSize },
                leftColor && { color: leftColor },
              ]}
            />
          ) : (
            <Text
              style={[
                styles.leftText,
                leftSize && { fontSize: leftSize },
                leftColor && { color: leftColor },
              ]}
            >
              {this.props.left}
            </Text>
          )}
        </TouchableItem>
      </Animatable.View>
    ) : null;
  };

  renderRight = () => {
    let rightColor: string = EStyleSheet.value('$textColor');
    if (this.props.rightColor) {
      if (
        this.props.rightColor.startsWith('#') ||
        this.props.rightColor.startsWith('rgb')
      ) {
        rightColor = this.props.rightColor;
      } else {
        rightColor = EStyleSheet.value(
          `$brand${sentenceCase(this.props.rightColor)}`,
        );
      }
    }

    let rightSize: number | undefined;
    if (this.props.rightSize) {
      if (typeof this.props.rightSize === 'string') {
        rightSize = EStyleSheet.value(this.props.rightSize);
      } else if (typeof this.props.rightSize === 'string') {
        rightSize = this.props.rightSize;
      }
    }

    return this.props.right || this.props.rightIcon ? (
      <Animatable.View
        ref={this.rightAnim}
        style={[
          styles.rightContainer,
          { width: this.height, height: this.height },
        ]}
        useNativeDriver={true}
      >
        <TouchableItem
          onPress={this.props.rightOnPress}
          disabled={this.props.rightDisabled}
          borderless={true}
          useForeground={true}
          style={[
            styles.rightTouch,
            { width: this.height, height: this.height },
          ]}
        >
          {this.props.rightIcon ? (
            <Icon
              name={
                this.props.rightIcon === true
                  ? 'dots-vertical'
                  : this.props.rightIcon
              }
              style={[
                styles.rightIcon,
                rightSize && { fontSize: rightSize },
                rightColor && { color: rightColor },
              ]}
            />
          ) : (
            <Text
              style={[
                styles.rightText,
                rightSize && { fontSize: rightSize },
                rightColor && { color: rightColor },
              ]}
            >
              {this.props.right}
            </Text>
          )}
        </TouchableItem>
      </Animatable.View>
    ) : null;
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{ top: 'always', bottom: 'never', horizontal: 'always' }}
        style={[
          styles.container,
          { height: this.height, marginTop: this.marginTop },
        ]}
      >
        {this.renderLeft()}

        <Text style={styles.title}>{this.props.title}</Text>

        {this.renderRight()}
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  title: {
    flex: 1,
    color: '$textColor',
    fontSize: '$fontSizeXl',
    textAlign: 'center',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },

  leftContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    marginLeft: 6,
  },
  leftTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    color: '$textColor',
    fontSize: '$fontSizeSx',
    textAlign: 'center',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
  leftText: {
    color: '$textColor',
    fontSize: '$fontSize',
    textAlign: 'center',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },

  rightContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    marginRight: 6,
  },
  rightTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    color: '$textColor',
    fontSize: '$fontSizeSx',
    textAlign: 'center',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
  rightText: {
    color: '$textColor',
    fontSize: '$fontSize',
    textAlign: 'center',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
});

export default Header;
