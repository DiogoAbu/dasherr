import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { Dimensions, ScaledSize } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { dark } from '../themes';
import { FlashMessage } from '../types';

import Stores from './stores';

// Init
const windowSize = Dimensions.get('window');

export default class GeneralStore {
  constructor(stores: Stores) {
    this.stores = stores;
  }

  stores: Stores;

  @persist
  @observable
  theme: string = 'dark';

  @persist
  @observable
  language: string = 'en';

  @persist
  @observable
  isRtl: boolean = false;

  @observable
  networkActivity: boolean = false;

  window: ScaledSize = windowSize;

  @observable
  isLandscape: boolean = windowSize.width > windowSize.height;

  @observable
  flashQueue: FlashMessage[] = [];

  @persist('list')
  @observable
  flashHistory: FlashMessage[] = [];

  flashTimeout: number = 5000;
  flashHistoryMax: number = 100;

  @computed
  get isLightTheme(): boolean {
    return this.theme === 'light';
  }

  @action
  changeTheme = (): void => {
    EStyleSheet.build(dark);
    this.theme = 'dark';
  };

  @action
  setLanguage = (language: string, isRtl: boolean = false): void => {
    // check if language is available
    this.language = language;
    this.isRtl = isRtl;
  };

  @action
  setNetworkActivity = (networkActivity: boolean): void => {
    this.networkActivity = networkActivity;
  };

  @action
  setIsLandscape = (isLandscape: boolean): void => {
    this.isLandscape = isLandscape;
  };

  @action
  addFlash = (message: FlashMessage): void => {
    const date = new Date().toISOString();
    this.flashQueue.push({ ...message, date });
  };

  @action
  removeFlash = (): void => {
    const message = this.flashQueue.shift();
    this.flashHistory.unshift(message!);

    const length = this.flashHistory.length;
    const max = this.flashHistoryMax;

    // Limit history size
    if (length >= max) {
      this.flashHistory.splice(0, length - max);
    }
  };
}
