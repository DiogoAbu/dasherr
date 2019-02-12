import { AsyncStorage } from 'react-native';

import GeneralStore from './general';
import RadarrStore from './radarr';

export default class Stores {
  general: GeneralStore;
  radarr: RadarrStore;

  constructor() {
    this.general = new GeneralStore(this);
    this.radarr = new RadarrStore(this);
  }

  purge = async (storeName: string) => {
    await AsyncStorage.removeItem(storeName);
  };

  purgeAll = async () => {
    await AsyncStorage.removeItem('general');
    await AsyncStorage.removeItem('radarr');
  };
}
