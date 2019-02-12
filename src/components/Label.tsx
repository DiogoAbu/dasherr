import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import sentenceCase from 'sentence-case';

import TouchableItem from './TouchableItem';

interface Props {
  value: string;
  icon?: string;
  brand?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  style?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

const Label: React.FunctionComponent<Props> = ({
  value,
  icon,
  brand = 'success',
  style,
  iconStyle,
  containerStyle,
  onPress,
}) => {
  const brandVariable = `$brand${sentenceCase(brand)}`;
  const brandVariableText = `${brandVariable}Text`;

  const brandColor = EStyleSheet.value(brandVariable);
  const brandColorText = EStyleSheet.value(brandVariableText);

  const renderIcon = () =>
    icon &&
    Icon.hasIcon(icon) && (
      <Icon
        name={icon}
        style={[styles.icon, { color: brandColorText }, iconStyle]}
      />
    );

  const renderText = () => (
    <Text style={[styles.text, { color: brandColorText }, style]}>{value}</Text>
  );

  return (
    <TouchableItem onPress={onPress} borderless={true} useForeground={true}>
      <View
        style={[
          styles.container,
          { backgroundColor: brandColor },
          containerStyle,
        ]}
      >
        {renderIcon()}
        {renderText()}
      </View>
    </TouchableItem>
  );
};

const styles = EStyleSheet.create({
  container: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingRight: 9,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    color: '$textColor',
  },
  text: {
    fontSize: '$fontSizeSm',
    lineHeight: '$fontSizeSm * 1.4',
  },
  icon: {
    fontSize: '$fontSize',
    paddingRight: 3,
  },
});

export default Label;
