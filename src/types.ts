export interface Movie {
  title: string;
  alternativeTitles: MovieAlternativeTitle[];
  secondaryYearSourceId?: number;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  physicalRelease?: string;
  images: MovieImage[];
  website: string;
  downloaded: boolean;
  year: number;
  hasFile: boolean;
  youTubeTrailerId: string;
  studio: string;
  path: string;
  profileId: number;
  pathState: string;
  monitored: boolean;
  minimumAvailability: string;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  lastInfoSync: string;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: MovieRatings;
  movieFile?: MovieFile;
  qualityProfileId: number;
  id: number;
}

export interface MovieAlternativeTitle {
  sourceType: string;
  movieId: number;
  title: string;
  sourceId: number;
  votes: number;
  voteCount: number;
  language: string;
  id: number;
}

export interface MovieImage {
  coverType: 'poster' | 'fanart';
  url: string;
}

export interface MovieFile {
  movieId: number;
  relativePath: string;
  size: number;
  dateAdded: string;
  sceneName: string;
  quality: MovieFileQuality;
  edition: string;
  mediaInfo: MovieMediaInfo;
  id: number;
}

export interface MovieMediaInfo {
  containerFormat: string;
  videoFormat: string;
  videoCodecID: string;
  videoProfile: string;
  videoCodecLibrary: string;
  videoBitrate: number;
  videoBitDepth: number;
  videoMultiViewCount: number;
  videoColourPrimaries: string;
  videoTransferCharacteristics: string;
  width: number;
  height: number;
  audioFormat: string;
  audioCodecID: string;
  audioCodecLibrary: string;
  audioAdditionalFeatures: string;
  audioBitrate: number;
  runTime: string;
  audioStreamCount: number;
  audioChannels: number;
  audioChannelPositions: string;
  audioChannelPositionsText: string;
  audioProfile: string;
  videoFps: number;
  audioLanguages: string;
  subtitles: string;
  scanType: string;
  schemaRevision: number;
}

export interface MovieFileQuality {
  quality: MovieQualityInfo;
  customFormats: any[];
  revision: MovieRevision;
}

export interface MovieQualityInfo {
  id: number;
  name: string;
  source: string;
  resolution: string;
  modifier: string;
}

export interface MovieRevision {
  version: number;
  real: number;
}

export interface MovieRatings {
  votes: number;
  value: number;
}

export interface MovieQueue {
  movie?: Movie;
  quality: MovieFileQuality;
  size: number;
  title: string;
  sizeleft: number;
  timeleft: string;
  estimatedCompletionTime: string;
  status: string;
  trackedDownloadStatus: string;
  statusMessages: any[];
  downloadId: string;
  protocol: string;
  id: number;
}

export interface MovieWanted {
  page: number;
  pageSize: number;
  sortKey: string;
  sortDirection: string;
  totalRecords: number;
  records: Movie[];
}

// Series
export interface Series {
  title: string;
  alternateTitles?: any[];
  sortTitle: string;
  seasonCount: number;
  totalEpisodeCount?: number;
  episodeCount?: number;
  episodeFileCount?: number;
  sizeOnDisk?: number;
  status: string;
  overview: string;
  nextAiring?: string;
  previousAiring?: string;
  network: string;
  airTime: string;
  images: SeriesImage[];
  seasons: SeriesSeason[];
  year: number;
  path: string;
  profileId: number;
  seasonFolder: boolean;
  monitored: boolean;
  useSceneNumbering: boolean;
  runtime: number;
  tvdbId: number;
  tvRageId: number;
  tvMazeId: number;
  firstAired: string;
  lastInfoSync: string;
  seriesType: string;
  cleanTitle: string;
  imdbId: string;
  titleSlug: string;
  certification: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: SeriesRatings;
  qualityProfileId: number;
  id: number;
}

export interface SeriesImage {
  coverType: 'poster' | 'fanart' | 'banner';
  url: string;
}

export interface SeriesRatings {
  votes: number;
  value: number;
}

export interface SeriesSeason {
  seasonNumber: number;
  monitored: boolean;
  statistics: SeriesStatistics;
}

export interface SeriesStatistics {
  episodeFileCount: number;
  episodeCount: number;
  totalEpisodeCount: number;
  sizeOnDisk: number;
  percentOfEpisodes: number;
  nextAiring?: string;
  previousAiring?: string;
}

export interface Episode {
  seriesId: number;
  episodeFileId: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  airDate: string;
  airDateUtc: string;
  overview: string;
  episodeFile?: EpisodeFile;
  hasFile: boolean;
  monitored: boolean;
  absoluteEpisodeNumber: number;
  unverifiedSceneNumbering: boolean;
  id: number;
}

export interface EpisodeFile {
  seriesId: number;
  seasonNumber: number;
  relativePath: string;
  path: string;
  size: number;
  dateAdded: string;
  sceneName: string;
  quality: EpisodeFileQuality;
  mediaInfo: EpisodeMediaInfo;
  qualityCutoffNotMet: boolean;
  id: number;
}

export interface EpisodeMediaInfo {
  audioChannels: number;
  audioCodec: string;
  videoCodec: string;
}

export interface EpisodeFileQuality {
  quality: EpisodeQualityInfo;
  revision: EpisodeRevision;
}

export interface EpisodeQualityInfo {
  id: number;
  name: string;
  source: string;
  resolution: number;
}

export interface EpisodeRevision {
  version: number;
  real: number;
}

export interface SeriesQueue {
  series?: Series;
  episode?: Episode;
  quality: EpisodeFileQuality;
  size: number;
  title: string;
  sizeleft: number;
  timeleft: string;
  estimatedCompletionTime: string;
  status: string;
  trackedDownloadStatus: string;
  statusMessages: any[];
  downloadId: string;
  protocol: string;
  id: number;
}

export interface SeriesWanted {
  page: number;
  pageSize: number;
  sortKey: string;
  sortDirection: string;
  totalRecords: number;
  records: EpisodeWithSeries[];
}

export interface EpisodeWithSeries extends Episode {
  series?: Series;
}

// Movies - Used on Stores
export interface ServerAndMovie {
  serverId: number;
  imdbId: string;
}

export interface MovieQueueServer extends MovieQueue, ServerAndMovie {}

export interface MovieFileServer extends ServerAndMovie {
  movieFile: MovieFile;
}

// Series - Used on Stores
export interface ServerAndSeries {
  serverId: number;
  imdbId: string;
  episodeId: number;
}

export interface SeriesQueueServer extends SeriesQueue, ServerAndSeries {}

export interface EpisodeFileServer extends ServerAndSeries {
  episodeFile: EpisodeFile;
}

// Other
export interface FlashMessage {
  type: 'success' | 'info' | 'warning' | 'danger';
  title: string;
  text?: string;
  date?: string;
  stack?: string;
}

export interface Server {
  id?: number;
  name: string;
  icon: string;
  iconColor: string;
  uri: string;
  uriLocal?: string;
  localNetworks?: string[];
  apiKey: string;
}

export interface ServerError {
  [key: string]: string;
}

// Theme
export interface Theme {
  $theme: 'dark' | 'light';

  $bgColor: string;
  $bgColorContrast: string;

  $textColor: string;
  $textColorContrast: string;
  $textColorFaded: string;

  $listItemHeight: number;
  $listItemIconHeight: number;

  $statusBarStyle: 'default' | 'light-content' | 'dark-content' | undefined;
  $statusBarBgColor: string;
  $statusBarTranslucent: boolean;

  $tabFontSize: string;
  $tabActiveColor: string;
  $tabInactiveColor: string;
  $tabActiveBgColor: string;
  $tabInactiveBgColor: string;
  $tabBorderTopColor: string;

  $brandDefault: string;
  $brandPrimary: string;
  $brandSuccess: string;
  $brandInfo: string;
  $brandWarning: string;
  $brandDanger: string;

  $brandDefaultText: string;
  $brandPrimaryText: string;
  $brandSuccessText: string;
  $brandInfoText: string;
  $brandWarningText: string;
  $brandDangerText: string;

  $pressColor: string;

  $textShadowColor: string;
  $textShadowRadius: number;
  $textShadowOffset: { width: number; height: number };

  $fontSize: number;
  $fontSizeMx: string;
  $fontSizeSx: string;
  $fontSizeXx: string;
  $fontSizeXl: string;
  $fontSizeLg: string;
  $fontSizeSm: string;
  $fontSizeXs: string;
  $fontSizeSs: string;
}

// Localization
export interface TranslationGetters {
  [locale: string]: () => any;
}
