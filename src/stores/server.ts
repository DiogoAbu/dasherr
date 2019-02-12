import * as Parallel from 'async-parallel';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { createTransformer } from 'mobx-utils';
import { stringify } from 'query-string';

import { Server, ServerError } from '../types';

import Stores from './stores';

export default class ServerStore {
  constructor(stores: Stores) {
    this.stores = stores;
  }

  stores: Stores;

  @persist('map')
  @observable
  servers: Map<number, Server> = new Map();

  nameMaxLength = 48;

  getServer = createTransformer((id: number) => {
    // @ts-ignore
    return this.servers.get(id.toString());
  });

  @computed
  get hasServer() {
    return this.servers.size !== 0;
  }

  @computed
  get serversData() {
    return [...this.servers.values()];
  }

  @action
  syncAll = (): Promise<void> => {
    const servers = [...this.servers.keys()];
    return Parallel.each(servers, (id: number) => this.sync(id));
  };

  @action
  sync = async (serverId: number): Promise<boolean> => true;

  @action
  add = (server: Server): number => {
    try {
      this.validate(server);

      console.log(server);

      // Has ID, update server
      if (typeof server.id === 'number') {
        // @ts-ignore
        this.servers.delete(server.id.toString());
        // @ts-ignore
        this.servers.set(server.id.toString(), server);
        return server.id;
      }

      // Check saved servers for unique values
      this.servers.forEach(value => {
        if (value.apiKey === server.apiKey) {
          throw { apiKey: 'Api Key already exists!' };
        }
      });

      const newServer = {
        ...server,
        id: this.getNewId(),
      };

      // @ts-ignore
      this.servers.set(newServer.id.toString(), newServer);

      return newServer.id;
    } catch (err) {
      throw err;
    }
  };

  @action
  remove = (serverId: number) => {
    // @ts-ignore
    if (this.servers.has(serverId.toString())) {
      // @ts-ignore
      this.servers.delete(serverId.toString());
    }
  };

  getNewId = () =>
    this.servers.size === 0 ? 0 : Math.max(...this.servers.keys()) + 1;

  validate = (server: Server) => {
    const err: ServerError = {};

    if (!server.name) {
      err.name = 'Required!';
    } else if (server.name.length > this.nameMaxLength) {
      err.name = `Name has a max of ${this.nameMaxLength}!`;
    } else if (server.name.length <= 0) {
      err.name = 'Name is too short!';
    }

    if (!server.uri) {
      err.uri = 'Required!';
    } else if (server.uri.length <= 0) {
      err.uri = 'Address is too short!';
    }

    if (!server.apiKey) {
      err.apiKey = 'Required!';
    } else if (server.apiKey.length <= 0) {
      err.apiKey = 'API Key is too short!';
    }

    if (Object.keys(err).length !== 0) {
      throw err;
    }
  };

  fetch = (
    endpoint: string,
    queryParams: object = {},
    serverId: number,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const { uri, apiKey } = this.servers.get(serverId.toString())!;
      const query = stringify(queryParams);

      const timeout = setTimeout(() => {
        reject(new TypeError('Network request timed out'));
      }, 2000);

      const options = {
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
      };
      fetch(`${uri}/${endpoint}${query && `?${query}`}`, options)
        .then(res => {
          clearTimeout(timeout);
          resolve(res.json());
        })
        .catch(err => reject(err));
    });
  };
}
