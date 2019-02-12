import { inject } from 'mobx-react';
import React from 'react';
import { GestureResponderEvent, Image, TouchableOpacity } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { Transition } from 'react-navigation-fluid-transitions';

import { Stores } from '../stores';

interface Props {
  imdbId: string;
  resizeMethod?: 'auto' | 'scale' | 'resize';
  shadowBorder?: number;
  shadowRadius?: number;
  width: number;
  height?: number;
  onPress?(event: GestureResponderEvent, idmbId: string): void;

  posterWidth?: number;
  posterHeight?: number;
}

const Poster: React.FunctionComponent<Props> = ({
  imdbId,
  posterWidth,
  posterHeight,
  resizeMethod,
  shadowBorder,
  shadowRadius,
  width,
  height,
  onPress,
}) => {
  const newWidth = width - 24;
  const newHeight = height ? height : (posterHeight! / posterWidth!) * newWidth;
  const shadowOpt = {
    width: newWidth,
    height: newHeight,
    color: '#000',
    border: shadowBorder || 12,
    radius: shadowRadius || 24,
    opacity: 0.3,
    x: 0,
    y: 0,
    style: { margin: 12 },
  };

  const onPressPoster = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event, imdbId);
    }
  };

  return (
    <Transition shared={`poster${imdbId}`} inline={true}>
      <TouchableOpacity
        onPress={onPressPoster}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <BoxShadow setting={shadowOpt}>
          <Image
            style={{
              width: newWidth,
              height: newHeight,
              borderRadius: shadowOpt.radius,
            }}
            source={getPoster(imdbId)}
            resizeMode="cover"
            resizeMethod={resizeMethod || 'auto'}
          />
        </BoxShadow>
      </TouchableOpacity>
    </Transition>
  );
};

export default inject(({ radarr }: Stores) => ({
  posterWidth: radarr.posterWidth,
  posterHeight: radarr.posterHeight,
}))(Poster);

const getPoster = (imdbId: string) => {
  switch (imdbId) {
    case 'tt1727824':
      return require('../../assets/images/tt1727824.poster.jpg');
    case 'tt4154664':
      return require('../../assets/images/tt4154664.poster.jpg');
    case 'tt4154796':
      return require('../../assets/images/tt4154796.poster.jpg');
  }
};
