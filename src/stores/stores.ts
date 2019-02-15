import { AsyncStorage } from 'react-native';

import GeneralStore from './general';
import ServerStore from './server';

export default class Stores {
  general: GeneralStore;
  server: ServerStore;

  constructor() {
    this.general = new GeneralStore(this);
    this.server = new ServerStore(this);
  }

  purge = async (storeName: string) => {
    await AsyncStorage.removeItem(storeName);
  };

  purgeAll = async () => {
    await AsyncStorage.removeItem('general');
    await AsyncStorage.removeItem('server');
  };
}
