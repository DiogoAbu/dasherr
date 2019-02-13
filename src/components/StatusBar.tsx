import { inject } from 'mobx-react';
import React from 'react';
import { StatusBar as StatusBarNative } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { GeneralStore, Stores } from '../stores';

interface Props {
  theme?: GeneralStore['theme'];
  networkActivity?: GeneralStore['networkActivity'];
}

const StatusBar: React.FunctionComponent<Props> = ({ networkActivity }) => (
  <StatusBarNative
    barStyle={EStyleSheet.value('$statusBarStyle')}
    backgroundColor={EStyleSheet.value('$statusBarBgColor')}
    translucent={EStyleSheet.value('$statusBarTranslucent')}
    networkActivityIndicatorVisible={networkActivity}
  />
);

export default inject(({ general }: Stores) => ({
  theme: general.theme,
  networkActivity: general.networkActivity,
}))(StatusBar);
