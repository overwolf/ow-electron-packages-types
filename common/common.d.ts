import {overwolf} from '@overwolf/ow-electron/'
import { IOverwolfRecordingApi } from '../recorder';
import { IOverwolfOverlayApi } from '../overlay';

// -----------------------------------------------------------------------------
export declare type GameProcessInfo = {
  pid?: number;

  fullPath: string;

  commandLine?: string;

  is32Bit?: boolean;

  isElevated?: boolean;
};

// -----------------------------------------------------------------------------
export declare type GameInfo = {
  id: number;

  classId: number;

  name: string;

  supported: boolean;

  processInfo?: GameProcessInfo;

  flags?: any;

  type: 'Game' | 'Launcher';
};

// -----------------------------------------------------------------------------
export interface GamesFilter {
  all?: boolean;

  includeUnsupported?: boolean;

  gamesIds: number[];
}

// -----------------------------------------------------------------------------
export interface OWPackages extends overwolf.packages.OverwolfPackageManager {
  recorder: IOverwolfRecordingApi;
  overlay: IOverwolfOverlayApi;
}