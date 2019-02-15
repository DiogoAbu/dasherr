import colorsys from 'colorsys';
import isHexcolor from 'is-hexcolor';
import { inject } from 'mobx-react';
import React from 'react';
import { BackHandler, Keyboard, TextInput } from 'react-native';
import { ColorWheel } from 'react-native-color-wheel';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';

import { Header } from '../components';
import { localize } from '../locales';
import { Stores } from '../stores';

interface Params {
  icon: string;
  iconColor: string;
  onChangeIconColor(icon: string): void;
}

interface Props {
  windowWidth: number;
  navigation: NavigationScreenProp<any, Params>;
}

interface State {
  iconColor?: string;
  iconColorInput?: string;
}

const initialState: State = {
  iconColor: undefined,
  iconColorInput: undefined,
};

@inject(({ general }: Stores) => ({
  windowWidth: general.window.width,
}))
class IconColorPicker extends React.Component<Props, {}> {
  readonly state = initialState;

  input = React.createRef<any>();
  colorWheel = React.createRef<any>();

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const iconColor = this.props.navigation.getParam(
      'iconColor',
      EStyleSheet.value('$brandInfo'),
    );

    this.setState({ iconColor, iconColorInput: iconColor });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onPressBack();
    return true;
  };

  onPressBack = () => {
    this.props.navigation.getParam('onChangeIconColor')(this.state.iconColor!);
    requestAnimationFrame(() => {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    });
  };

  onColorChange = (color: { h: number; s: number; v: number }) => {
    const { h, s, v } = color;
    const iconColor = colorsys.hsv2Hex({ h, s, v });
    this.setState({ iconColor, iconColorInput: iconColor });
  };

  onChangeText = (iconColorInput: string) => {
    this.setState({ iconColorInput });
  };

  onInputDone = () => {
    // Sanitize
    let color = this.state.iconColorInput!.replace(/[^0-9a-fA-F]/g, '');
    color = `#${color}`;

    if (isHexcolor(color)) {
      // Convert from 3-digit to 6-digit
      if (color.length === 4) {
        color = color.replace(
          /([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/g,
          '$1$1$2$2$3$3',
        );
      }

      this.setState({ iconColor: color, iconColorInput: color });
      this.colorWheel.current.forceUpdate(color);
    }
  };

  render() {
    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    const { iconColor } = this.state;

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <Header
          title={localize('Icon Colors').toUpperCase()}
          leftIcon={true}
          leftOnPress={this.onPressBack}
        />

        <Icon
          name={this.props.navigation.getParam('icon')}
          style={[styles.icon, { color: iconColor }]}
        />

        <TextInput
          ref={this.input}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onInputDone}
          blurOnSubmit={false}
          value={this.state.iconColorInput}
          style={styles.input}
          underlineColorAndroid="transparent"
          maxLength={7}
        />

        <ColorWheel
          ref={this.colorWheel}
          initialColor={iconColor}
          onColorChange={this.onColorChange}
          style={{
            width: this.props.windowWidth * 0.75,
            height: this.props.windowWidth * 0.75,
          }}
        />
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: '$fontSizeMx',
    margin: 12,
    marginTop: 24,
  },

  input: {
    backgroundColor: '$bgColorContrast',
    margin: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: EStyleSheet.hairlineWidth,
    color: '$textColor',
    fontSize: '$fontSizeLg',
  },
});

export default IconColorPicker;
