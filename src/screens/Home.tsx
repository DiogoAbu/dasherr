import { inject, observer } from 'mobx-react';
import React from 'react';
import {
  Animated,
  FlatList,
  GestureResponderEvent,
  ScrollView,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp } from 'react-navigation';

import {
  FloatingAction,
  HeaderMenu,
  Label,
  Poster,
  PosterInfo,
  TouchableItem,
} from '../components';
import { localize } from '../locales';
import { GeneralStore, RadarrStore } from '../stores';

interface Props {
  general: GeneralStore;
  radarr: RadarrStore;
  navigation: NavigationScreenProp<any>;
}

interface State {
  data: string[];
  filters: string[];
  showingAll: boolean;
  opacityMovieList: Animated.AnimatedValue;
}

const initialState: State = {
  data: [],
  filters: [],
  showingAll: false,
  opacityMovieList: new Animated.Value(1),
};

@inject('general', 'radarr')
@observer
class Home extends React.Component<Props, State> {
  readonly state = initialState;

  carousel = React.createRef<any>();

  componentWillMount() {
    this.setState({ data: this.props.radarr.moviesImdbWithFileByNew });
  }

  hideMovieList = (callback?: () => void) => {
    Animated.timing(this.state.opacityMovieList, {
      toValue: 0,
      duration: 200,
    }).start(callback);
  };

  showMovieList = (callback?: () => void) => {
    Animated.timing(this.state.opacityMovieList, {
      toValue: 1,
      duration: 200,
    }).start(callback);
  };

  onPressMenu = (sort: string) => {
    this.hideMovieList(() => {
      if (
        this.carousel &&
        this.carousel.current &&
        this.carousel.current.snapToItem
      ) {
        this.carousel.current.snapToItem(0);
      }

      requestAnimationFrame(() => {
        let data;
        let showingAll = false;

        if (sort === 'all') {
          data = this.props.radarr.moviesImdb;
          showingAll = true;
        } else if (sort === 'new') {
          data = this.props.radarr.moviesImdbWithFileByNew;
        } else {
          data = this.props.radarr.moviesImdbQueuedByProgress;
        }

        this.setState({ data, showingAll }, this.showMovieList);
      });
    });
  };

  onPressFilterBy = (filter: string) => null;

  onPressRemoveFilter = () => null;

  onPressPoster = (_event: GestureResponderEvent, imdbId: string) => {
    if (this.state.showingAll === false) {
      const currentImdbId = this.state.data[this.carousel.current.currentIndex];

      // Is not primary poster
      if (currentImdbId !== imdbId) {
        const index = this.state.data.findIndex(e => e === imdbId);
        this.carousel.current.snapToItem(index);
        return;
      }
    }

    requestAnimationFrame(() => {
      this.props.navigation.navigate('Details', { imdbId });
    });
  };

  onPressIconDown = () => {
    const imdbId = this.state.data[this.carousel.current.currentIndex];
    requestAnimationFrame(() => {
      this.props.navigation.navigate('Details', { imdbId });
    });
  };

  handleKeyExtractor = (item: string, index: number) => item;

  renderPoster = ({ item }: { item: string }) => (
    <Poster
      imdbId={item}
      width={this.props.general.window.width / 3}
      onPress={this.onPressPoster}
      shadowBorder={6}
      shadowRadius={12}
      resizeMethod="resize"
    />
  );

  renderPosterInfo = ({ item }: { item: string }) => (
    <PosterInfo
      imdbId={item}
      width={this.props.general.window.width - 84}
      onPress={this.onPressPoster}
    />
  );

  render() {
    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    return (
      <LinearGradient colors={colors} style={styles.container}>
        <HeaderMenu onPressMenuItem={this.onPressMenu} />

        <View>
          <ScrollView
            contentContainerStyle={styles.filterContainer}
            horizontal={true}
          >
            <Label
              containerStyle={styles.labelContainer}
              value={localize('Movies')}
              icon="close"
              onPress={this.onPressRemoveFilter}
            />
          </ScrollView>
        </View>

        <Animated.View
          style={[
            styles.listContainer,
            { opacity: this.state.opacityMovieList },
          ]}
        >
          {this.state.showingAll ? (
            <FlatList
              data={this.state.data}
              extraData={this.state.filters}
              renderItem={this.renderPoster}
              keyExtractor={this.handleKeyExtractor}
              numColumns={3}
              decelerationRate="fast"
              contentContainerStyle={styles.smallPosterListContainer}
            />
          ) : (
            <Carousel
              ref={this.carousel}
              data={this.state.data}
              extraData={this.state.filters}
              renderItem={this.renderPosterInfo}
              sliderWidth={this.props.general.window.width}
              itemWidth={this.props.general.window.width - 84}
              enableSnap={true}
              decelerationRate="fast"
            />
          )}
        </Animated.View>

        <View style={styles.iconContainer}>
          <TouchableItem
            onPress={this.onPressIconDown}
            borderless={true}
            useForeground={true}
            style={styles.iconTouch}
          >
            <Icon name="chevron-down" style={styles.icon} />
          </TouchableItem>
        </View>

        <FloatingAction
          navigation={this.props.navigation}
          onPressFilterBy={this.onPressFilterBy}
        />
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  listContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallPosterListContainer: {
    flexGrow: 1,
  },

  filterContainer: {
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 6,
  },
  labelContainer: {
    marginHorizontal: 3,
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 6,
  },
  iconTouch: { padding: 12 },
  icon: {
    color: '$textColor',
    fontSize: '$fontSizeMx',
  },
});

export default Home;
