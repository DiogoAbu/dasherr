/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const ANDROID_VERSION_LOLLIPOP = 21;

interface Props extends TouchableNativeFeedbackProps {
  pressColor?: string;
  borderless?: boolean;
}

class TouchableItem extends React.Component<Props> {
  static defaultProps = {
    borderless: false,
  };

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props;
      return (
        <TouchableNativeFeedback
          {...rest}
          delayLongPress={500}
          style={null}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor || EStyleSheet.value('$pressColor'),
            this.props.borderless,
          )}
        >
          <View style={style}>{this.props.children}</View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity {...this.props} delayLongPress={500}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export default TouchableItem;
