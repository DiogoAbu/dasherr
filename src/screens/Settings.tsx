import { inject, observer } from 'mobx-react';
import React from 'react';
import { FlatList } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationScreenProp } from 'react-navigation';

import { Header, ListItem } from '../components';
import { ListItemProps } from '../components/ListItem';
import { localize } from '../locales';
import { GeneralStore } from '../stores';

interface Props {
  general: GeneralStore;
  navigation: NavigationScreenProp<any>;
}

@inject('general')
@observer
class Settings extends React.Component<Props, {}> {
  onPressBack = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  onPressGoToSettings = () => {
    this.props.navigation.navigate('Servers');
  };

  onPressChangeLanguage = () => {
    const language = this.props.general.language !== 'pt-BR' ? 'pt-BR' : 'en';
    const isRtl = false;
    this.props.general.setLanguage(language, isRtl);
  };

  renderItem = ({ item }: { item: ListItemProps }) => <ListItem {...item} />;

  render() {
    const data: ListItemProps[] = [
      {
        key: '100',
        onPress: this.onPressGoToSettings,
        left: 'server',
        leftTextColor: 'warning',
        center: localize('Servers'),
        right: true,
      },
      {
        key: '200',
        onPress: this.onPressChangeLanguage,
        left: 'earth',
        leftTextColor: 'info',
        center: localize('Change Language'),
        centerBelow: localize('Current: {val}', {
          val: this.props.general.language,
        }),
        right: 'refresh',
      },
    ];

    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <Header
          title={localize('Settings').toUpperCase()}
          leftIcon={true}
          leftOnPress={this.onPressBack}
        />

        <FlatList
          data={data}
          renderItem={this.renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
  },
});

export default Settings;
