import { inject, observer } from 'mobx-react';
import moment from 'moment';
import 'moment-duration-format';
import React from 'react';
import { Animated, BackHandler, FlatList, Text, View } from 'react-native';
import AnimatedHeaderScrollView from 'react-native-animated-header-scroll-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { Transition } from 'react-navigation-fluid-transitions';

import {
  ListItem,
  ListItemSeparator,
  Poster,
  TouchableItem,
} from '../components';
import { ListItemProps } from '../components/ListItem';
import { localize } from '../locales';
import { Stores } from '../stores';
import {
  Movie,
  MovieFileServer,
  MovieQueueServer,
  ServerAndMovie,
} from '../types';

interface Props {
  movie?: Movie;
  moviesQueue?: MovieQueueServer;
  moviesWanted?: ServerAndMovie;
  moviesFiles?: MovieFileServer[];
  moviesImages?: ServerAndMovie;
  posterWidth?: number;
  posterHeight?: number;
  windowWidth?: number;
  navigation: NavigationScreenProp<any>;
}

interface State {
  opacity: number;
  scale: number;
  fanartY: number;
}

const initialState: State = {
  opacity: 1,
  scale: 1,
  fanartY: 0,
};

@inject(({ server, general }: Stores, { navigation }: Props) => {
  const imdbId = navigation.getParam('imdbId');
  return {
    movie: server.movies.find(e => e.imdbId === imdbId),
    moviesQueue: server.moviesQueue.find(e => e.imdbId === imdbId),
    moviesWanted: server.moviesWanted.find(e => e.imdbId === imdbId),
    moviesFiles: server.moviesFiles.filter(e => e.imdbId === imdbId),
    moviesImages: server.moviesImages.find(e => e.imdbId === imdbId),
    posterWidth: server.posterWidth,
    posterHeight: server.posterHeight,
    windowWidth: general.window.width,
  };
})
@observer
class Details extends React.Component<Props, State> {
  readonly state = initialState;

  headerScroll: any = React.createRef<any>();

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const { headerScrollDistance } = this.headerScroll.current.getConfig();

    const scrollY = this.headerScroll.current.getScroll();
    this.setState({
      opacity: scrollY.interpolate({
        inputRange: [0, headerScrollDistance],
        outputRange: [this.state.opacity, 0],
        extrapolate: 'clamp',
      }),
      scale: scrollY.interpolate({
        inputRange: [0, headerScrollDistance],
        outputRange: [this.state.scale, 1.2],
        extrapolate: 'clamp',
      }),
      fanartY: scrollY.interpolate({
        inputRange: [0, headerScrollDistance],
        outputRange: [this.state.fanartY, headerScrollDistance * -1],
        extrapolate: 'clamp',
      }),
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.onPressIconUp();
    return true;
  };

  onPressIconUp = () => {
    this.headerScroll.current.scrollTo({ y: 0 });
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  renderHeader = () => (
    <Animated.View
      style={{
        height: 300,
        transform: [{ translateY: this.state.fanartY }],
        overflow: 'hidden',
      }}
    >
      <Transition appear="top" inline={true}>
        <Animated.Image
          style={[
            styles.fanart,
            {
              width: this.props.windowWidth,
              height: 300,
              transform: [{ scale: this.state.scale }],
            },
          ]}
          source={getFanart(this.props.movie!.imdbId)}
          resizeMode="cover"
        />
      </Transition>
    </Animated.View>
  );

  renderMiddle = () => {
    const { posterHeight, posterWidth } = this.props;

    const width = 150;
    const newHeight = (posterHeight! / posterWidth!) * width;
    const marginTop = (newHeight / 3) * -1;

    return (
      <Animated.View
        style={[
          styles.posterContainer,
          {
            marginTop: 30,
            opacity: this.state.opacity,
          },
        ]}
      >
        <View style={{ marginTop }}>
          <Poster
            imdbId={this.props.movie!.imdbId}
            width={width}
            resizeMethod="resize"
          />
        </View>

        <View style={styles.posterRight}>
          <Text style={styles.title}>{this.props.movie!.title}</Text>
          <Text style={styles.info} numberOfLines={1}>
            {this.props.movie!.hasFile
              ? this.props.movie!.movieFile!.quality.quality.name
              : null}
            {this.props.movie!.hasFile ? ' - ' : null}
            {moment
              .duration(this.props.movie!.runtime, 'minutes')
              .format('h[h] m[m]')}
          </Text>
        </View>
      </Animated.View>
    );
  };

  renderItem = ({ item }: { item: ListItemProps }) => <ListItem {...item} />;

  renderItemSeparator = () => <ListItemSeparator />;

  renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.empty}>
        {localize('Nothing downloaded or wanted')}
      </Text>
    </View>
  );

  render() {
    const colors = [
      EStyleSheet.value('$bgColorContrast'),
      EStyleSheet.value('$bgColor'),
    ];

    const qualities: ListItemProps[] = [];

    if (this.props.moviesFiles!.length > 0) {
      qualities.push(
        ...this.props.moviesFiles!.map(
          (each, index): ListItemProps => ({
            key: (100 * index).toString(),
            left: 'cloud-download',
            leftTextColor: 'success',
            center: each.movieFile.quality.quality.name,
            centerBelow: each.movieFile.relativePath,
            centerTextStyle: styles.qualityItemText,
            style: styles.qualityItem,
            centerNumberOfLines: 0,
            centerBelowNumberOfLines: 0,
          }),
        ),
      );
    }

    return (
      <LinearGradient colors={colors.reverse()} style={styles.container}>
        <AnimatedHeaderScrollView
          headerChildren={this.renderHeader()}
          rootChildren={this.renderMiddle()}
          headerMinHeight={0}
          headerMaxHeight={300}
          rootChildrenPadding={130}
          ref={this.headerScroll}
        >
          <View style={styles.overviewContainer}>
            <Text style={styles.overview}>{this.props.movie!.overview}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {localize('Qualities').toUpperCase()}
              </Text>
              <View style={styles.sectionLine} />
            </View>

            {this.props.movie!.monitored === false && (
              <View style={styles.monitoredContainer}>
                <Text style={styles.monitored}>
                  {localize('This movie is not monitored')}
                </Text>
              </View>
            )}

            <FlatList
              data={qualities}
              renderItem={this.renderItem}
              ListEmptyComponent={this.renderEmpty}
              ItemSeparatorComponent={this.renderItemSeparator}
            />
          </View>
        </AnimatedHeaderScrollView>

        <SafeAreaView
          forceInset={{ top: 'never', bottom: 'always', horizontal: 'always' }}
          style={styles.iconContainer}
        >
          <TouchableItem
            onPress={this.onPressIconUp}
            borderless={true}
            useForeground={true}
            style={styles.iconTouch}
          >
            <Icon name="chevron-up" style={styles.icon} />
          </TouchableItem>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  iconContainer: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  iconTouch: { padding: 12 },
  icon: {
    color: '$textColor',
    fontSize: '$fontSizeMx',
  },

  posterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  posterRight: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  title: {
    color: '$textColor',
    fontSize: '$fontSizeLg',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 1 },
  },
  info: {
    color: '$textColorFaded',
    fontSize: '$fontSize',
  },

  overviewContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  overview: {
    color: '$textColor',
    fontSize: '$fontSize',
    textAlign: 'justify',
  },

  section: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '$textColorFaded',
    fontSize: '$fontSize',
  },
  sectionLine: {
    flex: 1,
    height: EStyleSheet.hairlineWidth,
    backgroundColor: '$brandInfo',
    marginLeft: 12,
  },

  monitoredContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  monitored: {
    color: '$brandDanger',
    fontSize: '$fontSize',
  },

  qualityItem: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  qualityItemText: {
    fontSize: '$fontSize',
  },

  emptyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  empty: {
    color: '$textColorFaded',
    fontSize: '$fontSize',
  },
});

export default Details;

const getFanart = (imdbId: string) => {
  switch (imdbId) {
    case 'tt1727824':
      return require('../../assets/images/tt1727824.fanart.jpg');
    case 'tt4154664':
      return require('../../assets/images/tt4154664.fanart.jpg');
    case 'tt4154796':
      return require('../../assets/images/tt4154796.fanart.jpg');
  }
};
