import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { dark } from '../themes';

const Loading: React.FunctionComponent<{}> = () => {
  // Get dark theme values
  let bgColor = dark.$bgColor;
  let textColor = dark.$textColor;
  let statusBarStyle = dark.$statusBarStyle;
  let statusBarBgColor = dark.$statusBarBgColor;
  let statusBarTranslucent = dark.$statusBarTranslucent;
  // Use try-catch because Extended StyleSheet may not be intialized yet
  try {
    // Get current theme values
    bgColor = EStyleSheet.value('$bgColor');
    textColor = EStyleSheet.value('$textColor');
    statusBarStyle = EStyleSheet.value('$statusBarStyle');
    statusBarBgColor = EStyleSheet.value('$statusBarBgColor');
    statusBarTranslucent = EStyleSheet.value('$statusBarTranslucent');
  } catch (e) {
    //
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBgColor}
        translucent={statusBarTranslucent}
      />
      <Icon name="loading" size={36} color={textColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
