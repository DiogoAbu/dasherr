import lodash from 'lodash';
import { action, computed, observable } from 'mobx';
import { persist } from 'mobx-persist';

import {
  Movie,
  MovieFileServer,
  MovieQueue,
  MovieQueueServer,
  MovieWanted,
  ServerAndMovie,
} from '../types';

import ServerStore from './server';

export default class RadarrStore extends ServerStore {
  @persist('list')
  @observable
  movies: Movie[] = [];

  @persist('list')
  @observable
  queue: MovieQueueServer[] = [];

  @persist('list')
  @observable
  wanted: ServerAndMovie[] = [];

  @persist('list')
  @observable
  files: MovieFileServer[] = [];

  @persist('list')
  @observable
  images: ServerAndMovie[] = [];

  posterWidth: number = 333;
  posterHeight: number = 500;

  @computed
  get moviesImdb() {
    return this.movies.map(({ imdbId }) => imdbId);
  }

  @computed
  get moviesImdbWithFileByNew() {
    return lodash
      .sortBy(this.files, [e => e.movieFile.dateAdded])
      .map(({ imdbId }) => imdbId);
  }

  @computed
  get moviesImdbQueuedByProgress() {
    return lodash
      .sortBy(this.queue, [e => e.sizeleft])
      .map(({ imdbId }) => imdbId);
  }

  @action
  mock = () => {
    const serverId = 0;

    const movies: Movie[] = require('../../assets/movies.json');
    const queue: MovieQueue[] = require('../../assets/queue.json');
    const wanted: MovieWanted = require('../../assets/wanted.json');

    this.movies = movies;

    this.files = movies
      .filter(e => e.hasFile === true && e.hasOwnProperty('movieFile'))
      .map(e => ({
        movieFile: e.movieFile!,
        serverId,
        imdbId: e.imdbId,
      }));

    this.queue = queue.map(({ movie, ...rest }) => ({
      ...rest,
      serverId,
      imdbId: movie!.imdbId,
    }));
    this.wanted = wanted.records.map(({ imdbId }) => ({ serverId, imdbId }));
    this.images = movies.map(({ imdbId }) => ({ serverId, imdbId }));
  };

  /**
   * @param serverId - Server's ID
   * @returns Whether Sync was successful
   */
  @action
  sync = async (serverId: number): Promise<boolean> => {
    try {
      // const movies: Movie[] = await this.fetchMovies(serverId);
      // const queue: MovieQueue[] = await this.fetchQueue(serverId);
      // const wanted: MovieWanted = await this.fetchWanted(serverId);

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
   * @returns Fetched queue
   */
  fetchQueue = (serverId: number): Promise<MovieQueue[]> => {
    return this.fetch('queue', {}, serverId);
  };

  /**
   * @param serverId - Server's ID
   * @returns Fetched wanted records
   */
  fetchWanted = async (serverId: number): Promise<MovieWanted> => {
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
