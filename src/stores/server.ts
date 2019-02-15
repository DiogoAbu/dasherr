import * as Parallel from 'async-parallel';
import lodash from 'lodash';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { createTransformer } from 'mobx-utils';
import { stringify } from 'query-string';

import {
  Episode,
  EpisodeFileServer,
  Movie,
  MovieFileServer,
  MovieQueue,
  MovieQueueServer,
  MovieWanted,
  Series,
  SeriesQueueServer,
  Server,
  ServerAndMovie,
  ServerAndSeries,
  ServerError,
} from '../types';

import Stores from './stores';

export default class ServerStore {
  constructor(stores: Stores) {
    this.stores = stores;
  }

  stores: Stores;

  posterWidth: number = 333;
  posterHeight: number = 500;

  serverNameMaxLength = 48;

  @persist('map')
  @observable
  servers: Map<number, Server> = new Map();

  @persist('list')
  @observable
  movies: Movie[] = [];

  @persist('list')
  @observable
  series: Series[] = [];

  @persist('list')
  @observable
  episodes: Episode[] = [];

  @persist('list')
  @observable
  moviesQueue: MovieQueueServer[] = [];

  @persist('list')
  @observable
  seriesQueue: SeriesQueueServer[] = [];

  @persist('list')
  @observable
  moviesWanted: ServerAndMovie[] = [];

  @persist('list')
  @observable
  seriesWanted: ServerAndSeries[] = [];

  @persist('list')
  @observable
  moviesFiles: MovieFileServer[] = [];

  @persist('list')
  @observable
  seriesFiles: EpisodeFileServer[] = [];

  @persist('list')
  @observable
  moviesImages: ServerAndMovie[] = [];

  @persist('list')
  @observable
  seriesImages: ServerAndSeries[] = [];

  @computed
  get hasServer() {
    return this.servers.size !== 0;
  }

  @computed
  get serversData() {
    return [...this.servers.values()];
  }

  @computed
  get moviesImdb() {
    return this.movies.map(({ imdbId }) => imdbId);
  }

  @computed
  get moviesImdbWithFileByNew() {
    return lodash
      .sortBy(this.moviesFiles, [e => e.movieFile.dateAdded])
      .map(({ imdbId }) => imdbId);
  }

  @computed
  get moviesImdbQueuedByProgress() {
    return lodash
      .sortBy(this.moviesQueue, [e => e.sizeleft])
      .map(({ imdbId }) => imdbId);
  }

  getServer = createTransformer((id: number) => {
    // @ts-ignore
    return this.servers.get(id.toString());
  });

  // SERVER
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
    } else if (server.name.length > this.serverNameMaxLength) {
      err.name = `Name has a max of ${this.serverNameMaxLength}!`;
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

  // RADARR
  @action
  mockRadarr = () => {
    const serverId = 0;

    const movies: Movie[] = require('../../assets/movies.json');
    const moviesQueue: MovieQueue[] = require('../../assets/moviesQueue.json');
    const moviesWanted: MovieWanted = require('../../assets/moviesWanted.json');

    this.movies = movies;

    this.moviesFiles = movies
      .filter(e => e.hasFile === true && e.hasOwnProperty('movieFile'))
      .map(e => ({
        movieFile: e.movieFile!,
        serverId,
        imdbId: e.imdbId,
      }));

    this.moviesQueue = moviesQueue.map(({ movie, ...rest }) => ({
      ...rest,
      serverId,
      imdbId: movie!.imdbId,
    }));

    this.moviesWanted = moviesWanted.records.map(({ imdbId }) => ({
      serverId,
      imdbId,
    }));

    this.moviesImages = movies.map(({ imdbId }) => ({ serverId, imdbId }));
  };

  /**
   * @param serverId - Server's ID
   * @returns Whether Sync was successful
   */
  @action
  syncRadarr = async (serverId: number): Promise<boolean> => {
    try {
      // const movies: Movie[] = await this.fetchMovies(serverId);
      // const moviesQueue: MovieQueue[] = await this.fetchMoviesQueue(serverId);
      // const moviesWanted: MovieWanted = await this.fetchMoviesWanted(serverId);

      return true;
    } catch (err) {
      return false;
    }
  };

  /**
   * @param serverId - Server's ID
   * @returns Fetched movies
   */
  fetchMovies = (serverId: number): Promise<Movie[]> => {
    return this.fetch('movie', {}, serverId);
  };

  /**
   * @param serverId - Server's ID
   * @returns Fetched moviesQueue
   */
  fetchMoviesQueue = (serverId: number): Promise<MovieQueue[]> => {
    return this.fetch('moviesQueue', {}, serverId);
  };

  /**
   * @param serverId - Server's ID
   * @returns Fetched wanted records
   */
  fetchMoviesWanted = async (serverId: number): Promise<MovieWanted> => {
    const wantedParams = {
      sortKey: 'date',
      page: 1,
      pageSize: 0,
      sortDir: 'desc',
    };

    // Make request to get the total amount of records
    const wantedPre = await this.fetch(
      'wanted/missing',
      wantedParams,
      serverId,
    );

    // Make request passing total amount of records
    return this.fetch(
      'wanted/missing',
      { ...wantedParams, pageSize: wantedPre.totalRecords },
      serverId,
    );
  };
}
