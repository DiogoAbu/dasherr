import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FloatingAction as Floating } from 'react-native-floating-action';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';

import { localize } from '../locales';

interface Props {
  navigation: NavigationScreenProp<any>;
  onPressFilterBy(filter: string): void;
}

class FloatingAction extends React.Component<Props> {
  onPressItem = (name?: string) => {
    switch (name) {
      case 'movie':
      case 'tvshows':
        this.props.onPressFilterBy(name);
        break;
      default:
        requestAnimationFrame(() => {
          this.props.navigation.navigate('Settings');
        });
        break;
    }
  };

  render() {
    const fontSize = EStyleSheet.value('$fontSizeXl');
    const brandSuccess = EStyleSheet.value('$brandSuccess');
    const brandSuccessText = EStyleSheet.value('$brandSuccessText');
    const brandInfo = EStyleSheet.value('$brandInfo');
    const brandInfoText = EStyleSheet.value('$brandInfoText');
    const brandWarning = EStyleSheet.value('$brandWarning');
    const brandWarningText = EStyleSheet.value('$brandWarningText');

    const actions = [
      {
        text: localize('Show Movies'),
        name: 'movies',
        color: brandSuccess,
        icon: <Icon name="movie" color={brandSuccessText} size={fontSize} />,
        textBackground: brandSuccess,
        textColor: brandSuccessText,
      },
      {
        text: localize('Show Series'),
        name: 'tvshows',
        color: brandInfo,
        icon: (
          <Icon
            name="television-classic"
            color={brandInfoText}
            size={fontSize}
          />
        ),
        textBackground: brandInfo,
        textColor: brandInfoText,
      },
      {
        text: localize('Settings'),
        name: 'settings',
        color: brandWarning,
        icon: (
          <Icon
            name="dots-horizontal"
            color={brandWarningText}
            size={fontSize}
          />
        ),
        textBackground: brandWarning,
        textColor: brandWarningText,
      },
    ];
    return (
      <Floating
        actions={actions}
        onPressItem={this.onPressItem}
        color={EStyleSheet.value('$brandPrimary')}
        position="right"
        distanceToEdge={24}
        actionsPaddingTopBottom={6}
      />
    );
  }
}

export default FloatingAction;
