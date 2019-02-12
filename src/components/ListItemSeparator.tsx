import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import sentenceCase from 'sentence-case';

interface Props {
  brandIcon?:
    | 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | null;
}

const ListItemSeparator: React.FunctionComponent<Props> = props => {
  let backgroundColor;

  if (props.brandIcon) {
    backgroundColor = EStyleSheet.value(
      `$brand${sentenceCase(props.brandIcon)}`,
    );
  }

  return <View style={[styles.line, backgroundColor && { backgroundColor }]} />;
};

const styles = EStyleSheet.create({
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: EStyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default ListItemSeparator;
