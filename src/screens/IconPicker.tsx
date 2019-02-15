import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, Keyboard, Text, TextInput, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';

import { Header, TouchableItem } from '../components';
import { localize } from '../locales';

interface Params {
  iconColor: string;
  onChangeIcon(icon: string): void;
}

interface Props {
  navigation: NavigationScreenProp<any, Params>;
}

interface State {
  query: string;
  icons: string[];
  page: number;
  size: number;
  noMoreIcons: boolean;
}

const initialState: State = {
  query: '',
  icons: [],
  page: 1,
  size: 20,
  noMoreIcons: false,
};

let iconNames: string[] = [];

@observer
class IconPicker extends React.Component<Props, State> {
  readonly state = initialState;

  componentWillMount() {
    // @ts-ignore DefinitelyTyped is not up-to-date
    iconNames = Object.keys(Icon.getRawGlyphMap());
  }

  loadMore = (pageAdd: number = 0) => {
    if (this.state.query.length === 0) {
      this.setState({ icons: [] });
      return;
    }

    const { query, page: oldPage, size } = this.state;

    const page = oldPage + pageAdd;

    const start = 0;
    const end = page * size;

    const iconsFiltered = iconNames.filter(val =>
      val.toLowerCase().includes(query.toLowerCase()),
    );

    const noMoreIcons = iconsFiltered.length - 1 <= end;

    const icons = iconsFiltered.slice(start, end);

    this.setState({ icons, page, noMoreIcons });
  };

  onPressIcon = (icon: string) => () => {
    this.props.navigation.getParam('onChangeIcon')(icon);
    this.props.navigation.goBack();
  };

  onPressBack = () => {
    requestAnimationFrame(() => {
      Keyboard.dismiss();
      this.props.navigation.goBack();
    });
  };

  onChangeTextQuery = (query: string) => {
    this.setState({ query, page: 1 }, () => this.loadMore());
  };

  onEndReached = () => {
    if (this.state.query.length > 0) {
      this.loadMore(1);
    }
  };

  handleKeyExtractor = (item: string, index: number) => item;

  renderRecommended = () => {
    // Render nothing if there is a query but no icons
    if (this.state.query.length > 0) {
      return null;
    }

    const color = this.props.navigation.getParam('iconColor', '');
    return (
      <View style={styles.recommendedContainer}>
        <Text style={styles.recommendedText}>{localize('Recommended')}</Text>

        <View style={styles.recommendedSection}>
          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>

          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>

          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>
        </View>

        <View style={styles.recommendedSection}>
          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>

          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>

          <TouchableItem
            style={styles.iconContainer}
            onPress={this.onPressIcon('server')}
          >
            <Icon
              name="server"
              style={[styles.icon, color ? { color } : null]}
            />
          </TouchableItem>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    if (this.state.query.length > 0) {
      return (
        <Text style={styles.moreIcons}>
          {localize(this.state.noMoreIcons ? 'No more icons' : 'Getting more')}
        </Text>
      );
    }

    return null;
  };

  renderIcon = ({ item }: { item: string }) => {
    const color = this.props.navigation.getParam('iconColor', '');
    return (
      <TouchableItem
        style={styles.itemContainer}
        onPress={this.onPressIcon(item)}
      >
        <Icon name={item} style={[styles.itemIcon, color ? { color } : null]} />
        <Text style={styles.itemName}>{item}</Text>
      </TouchableItem>
    );
  };

  render() {
    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <Header
          title={localize('Icons').toUpperCase()}
          leftIcon={true}
          leftOnPress={this.onPressBack}
        />

        <TextInput
          autoCapitalize="none"
          autoFocus={true}
          placeholder={localize('Search for an Icon')}
          placeholderTextColor={EStyleSheet.value('$textColorFaded')}
          onChangeText={this.onChangeTextQuery}
          value={this.state.query}
          style={styles.input}
        />

        <FlatList
          data={this.state.icons}
          extraData={this.state.noMoreIcons}
          renderItem={this.renderIcon}
          keyExtractor={this.handleKeyExtractor}
          onEndReached={this.onEndReached}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={this.renderRecommended}
          ListFooterComponent={this.renderFooter}
        />
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },

  input: {
    backgroundColor: '$bgColorContrast',
    marginHorizontal: 12,
    marginVertical: 6,
    marginTop: 24,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: EStyleSheet.hairlineWidth,
    color: '$textColor',
    fontSize: '$fontSize',
  },

  itemContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemIcon: {
    color: '$textColor',
    fontSize: '$fontSizeXx',
    paddingHorizontal: 12,
  },
  itemName: {
    color: '$textColor',
    fontSize: '$fontSize',
    paddingLeft: 6,
  },

  recommendedContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedText: {
    color: '$textColorFaded',
    fontSize: '$fontSizeLg',
    marginBottom: 12,
  },
  iconContainer: {
    margin: 12,
    padding: 12,
    backgroundColor: '$bgColorContrast',
    borderRadius: 6,
  },
  icon: {
    color: '$textColor',
    fontSize: '$fontSizeXx',
  },

  moreIcons: {
    textAlign: 'center',
    color: '$textColorFaded',
    fontSize: '$fontSizeSm',
    padding: 12,
    marginBottom: 6,
  },
});

export default IconPicker;
