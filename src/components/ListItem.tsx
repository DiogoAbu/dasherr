import React from 'react';
import { StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import sentenceCase from 'sentence-case';

import TouchableItem from './TouchableItem';

export interface ListItemProps {
  key?: string;

  style?: StyleProp<ViewStyle>;
  pressReturn?: any;
  disabled?: boolean;
  onPress?: (pressReturn: any) => void;

  left?: string | React.ReactChild;
  leftBgColor?: string;
  leftTextColor?: string;
  leftStyle?: StyleProp<ViewStyle>;
  leftTextStyle?: StyleProp<TextStyle>;
  leftNumberOfLines?: number;
  leftDisabled?: boolean;
  leftOnPressAnimDuration?: number;
  leftOnPress?: (pressReturn: any) => void;

  center?: string | React.ReactChild;
  centerStyle?: StyleProp<ViewStyle>;
  centerTextStyle?: StyleProp<TextStyle>;
  centerNumberOfLines?: number;
  centerDisabled?: boolean;
  centerOnPress?: (pressReturn: any) => void;

  centerBelow?: string | React.ReactChild;
  centerBelowTextStyle?: StyleProp<TextStyle>;
  centerBelowNumberOfLines?: number;

  right?: string | React.ReactChild | boolean;
  rightStyle?: StyleProp<ViewStyle>;
  rightTextStyle?: StyleProp<TextStyle>;
  rightNumberOfLines?: number;
  rightDisabled?: boolean;
  rightOnPress?: (pressReturn: any) => void;
}

class ListItem extends React.PureComponent<ListItemProps> {
  static defaultProps: ListItemProps = {
    leftOnPressAnimDuration: 200,
    leftNumberOfLines: 1,
    centerNumberOfLines: 1,
    centerBelowNumberOfLines: 1,
    rightNumberOfLines: 1,
  };

  leftIconContainer = React.createRef<any>();

  onPress = (): void => {
    if (this.props.onPress) {
      this.props.onPress(this.props.pressReturn);
    }
  };

  leftOnPress = (): void => {
    if (this.props.leftOnPress) {
      this.leftIconContainer.current
        .flipOutY(this.props.leftOnPressAnimDuration)
        .then(() => {
          this.props.leftOnPress!(this.props.pressReturn);
          this.leftIconContainer.current.flipInY(
            this.props.leftOnPressAnimDuration,
          );
        });
    }
  };

  centerOnPress = (): void => {
    if (this.props.centerOnPress) {
      this.props.centerOnPress(this.props.pressReturn);
    }
  };

  rightOnPress = (): void => {
    if (this.props.rightOnPress) {
      this.props.rightOnPress(this.props.pressReturn);
    }
  };

  render() {
    let leftBgColorIsBrand = false;

    let leftBgColor: string = 'transparent';
    if (this.props.leftBgColor) {
      if (
        this.props.leftBgColor.startsWith('#') ||
        this.props.leftBgColor.startsWith('rgb')
      ) {
        leftBgColor = this.props.leftBgColor;
      } else {
        leftBgColorIsBrand = true;
        leftBgColor = EStyleSheet.value(
          `$brand${sentenceCase(this.props.leftBgColor)}`,
        );
      }
    }

    let leftTextColor: string = EStyleSheet.value('$textColor');
    if (this.props.leftTextColor) {
      if (
        this.props.leftTextColor.startsWith('#') ||
        this.props.leftTextColor.startsWith('rgb')
      ) {
        leftTextColor = this.props.leftTextColor;
      } else {
        leftTextColor = EStyleSheet.value(
          leftBgColorIsBrand
            ? `$brand${sentenceCase(this.props.leftTextColor)}Text`
            : `$brand${sentenceCase(this.props.leftTextColor)}`,
        );
      }
    }

    return (
      <TouchableItem
        onPress={this.onPress}
        disabled={this.props.disabled || !this.props.onPress}
        style={[styles.container, this.props.style]}
      >
        {this.props.left && (
          <TouchableItem
            onPress={this.leftOnPress}
            disabled={this.props.leftDisabled || !this.props.leftOnPress}
            borderless={true}
            style={styles.leftTouch}
          >
            <Animatable.View
              ref={this.leftIconContainer}
              style={[
                styles.left,
                { backgroundColor: leftBgColor },
                this.props.leftStyle,
              ]}
              useNativeDriver={true}
            >
              {typeof this.props.left === 'string' ? (
                <Icon
                  name={this.props.left}
                  style={[
                    styles.text,
                    styles.leftText,
                    { color: leftTextColor },
                    this.props.leftTextStyle,
                  ]}
                  numberOfLines={this.props.leftNumberOfLines}
                />
              ) : (
                this.props.left
              )}
            </Animatable.View>
          </TouchableItem>
        )}
        {this.props.center && (
          <TouchableItem
            onPress={this.centerOnPress}
            disabled={this.props.centerDisabled || !this.props.centerOnPress}
            style={[
              styles.center,
              !this.props.left && styles.centerNoLeft,
              !this.props.right && styles.centerNoRight,
              this.props.centerStyle,
            ]}
          >
            {typeof this.props.center === 'string' ? (
              <Text
                style={[
                  styles.text,
                  styles.centerText,
                  this.props.centerTextStyle,
                ]}
                numberOfLines={this.props.centerNumberOfLines}
              >
                {this.props.center}
              </Text>
            ) : (
              this.props.center
            )}
            {typeof this.props.centerBelow === 'string' ? (
              <Text
                style={[
                  styles.text,
                  styles.centerBelowText,
                  this.props.centerBelowTextStyle,
                ]}
                numberOfLines={this.props.centerBelowNumberOfLines}
              >
                {this.props.centerBelow}
              </Text>
            ) : (
              this.props.centerBelow
            )}
          </TouchableItem>
        )}
        {this.props.right && (
          <TouchableItem
            onPress={this.rightOnPress}
            disabled={this.props.rightDisabled || !this.props.rightOnPress}
            style={[styles.right, this.props.rightStyle]}
          >
            {this.props.right === true ? (
              <Icon
                name="chevron-right"
                style={[
                  styles.text,
                  styles.rightText,
                  this.props.rightTextStyle,
                ]}
                numberOfLines={this.props.rightNumberOfLines}
              />
            ) : typeof this.props.right === 'string' ? (
              <Icon
                name={this.props.right}
                style={[
                  styles.text,
                  styles.rightText,
                  this.props.rightTextStyle,
                ]}
                numberOfLines={this.props.rightNumberOfLines}
              />
            ) : (
              this.props.right
            )}
          </TouchableItem>
        )}
      </TouchableItem>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    // backgroundColor: '$bgColorContrast',
    minHeight: '$listItemHeight',
    borderBottomWidth: EStyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },

  text: {
    color: '$textColor',
    fontSize: '$fontSize',
  },

  left: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginHorizontal: 12,
    width: '$listItemIconHeight',
    minHeight: '$listItemIconHeight',
    borderRadius: '$listItemIconHeight/2',
    backgroundColor: '$brandSuccess',
  },

  leftText: {
    color: '$brandSuccessText',
    fontSize: '$fontSizeXx',
    textAlign: 'center',
    width: '$listItemIconHeight',
  },

  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    paddingLeft: 6,
    paddingVertical: 12,
  },

  centerText: {
    fontSize: '$fontSizeLg',
  },

  centerBelowText: {
    color: '$textColorFaded',
    fontSize: '$fontSizeSm',
  },

  centerNoLeft: {
    paddingLeft: 18,
  },

  centerNoRight: {
    paddingRight: 18,
  },

  right: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingHorizontal: 18,
  },

  rightText: {
    fontSize: '$fontSizeXx',
    textAlign: 'right',
  },
});

export default ListItem;
