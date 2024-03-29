import { inject } from 'mobx-react';
import moment from 'moment';
import 'moment-duration-format';
import React from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Stores } from '../stores';
import { Movie, MovieQueueServer, ServerAndMovie } from '../types';

import Poster from './Poster';

interface Props {
  imdbId: string;
  resizeMethod?: 'auto' | 'scale' | 'resize';
  shadowBorder?: number;
  shadowRadius?: number;
  width: number;
  height?: number;
  onPress?(event: GestureResponderEvent, idmbId: string): void;

  movie?: Movie;
  moviesQueue?: MovieQueueServer;
  moviesWanted?: ServerAndMovie;
  moviesImages?: ServerAndMovie;
}

const PosterInfo: React.FunctionComponent<Props> = ({
  movie,
  width,
  height,
  onPress,
  resizeMethod,
  shadowBorder,
  shadowRadius,
}) => {
  return (
    <View style={[styles.container, { width }]}>
      <Poster
        imdbId={movie!.imdbId}
        width={width}
        height={height}
        onPress={onPress}
        resizeMethod={resizeMethod}
        shadowBorder={shadowBorder}
        shadowRadius={shadowRadius}
      />

      <Text style={styles.title} numberOfLines={1}>
        {movie!.title}
      </Text>

      <Text style={styles.info} numberOfLines={1}>
        {movie!.hasFile ? movie!.movieFile!.quality.quality.name : null}
        {movie!.hasFile ? ' - ' : null}
        {moment.duration(movie!.runtime, 'minutes').format('h[h] m[m]')}
      </Text>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    paddingTop: 12,
    color: '$textColor',
    fontSize: '$fontSizeXl',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
  info: {
    paddingTop: 6,
    color: '$textColorFaded',
    fontSize: '$fontSizeLg',
    textShadowColor: '$textShadowColor',
    textShadowRadius: '$textShadowRadius',
    textShadowOffset: '$textShadowOffset',
  },
});

export default inject(({ server }: Stores, { imdbId }: Props) => ({
  movie: server.movies.find(e => e.imdbId === imdbId),
  moviesQueue: server.moviesQueue.find(e => e.imdbId === imdbId),
  moviesWanted: server.moviesWanted.find(e => e.imdbId === imdbId),
  moviesImages: server.moviesImages.find(e => e.imdbId === imdbId),
}))(PosterInfo);
