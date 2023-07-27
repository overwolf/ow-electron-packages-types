import { BrowserWindow, BrowserWindowConstructorOptions, Size, WebContents } from 'electron';
import { EventEmitter } from 'events';

export declare type GameProcessInfo = {
  pid?: number;

  fullPath: string;

  commandLine?: string;

  is32Bit?: boolean;

  isElevated?: boolean;
}

export declare type GameInfo = {
  id: number;

  classId: number;

  name: string;

  supported: boolean

  processInfo?: GameProcessInfo;

  flags?: any

  type: 'Game' | 'Launcher';
};

export interface GamesFilter {
  all?: boolean;

  includeUnsupported?: boolean;

  gamesIds: number[];
}

/**
 * Input pass through
 */
export const enum PassthroughType {
  /**
   *  Window will handle input and block from game (Default)
   */
  NoPassThrough = 0,
  /**
   *  window will not handle any input
   */
  PassThrough,
}

/**
 * Overlay z-order
 */
export const enum ZOrderType {
  Default,
  TopMost
}

/** Overlay Specail options */
export interface OverlayOptions {
  passthrough?: PassthroughType;

  zOrder?: ZOrderType;
}

export interface OverlayWindowOptions
  extends BrowserWindowConstructorOptions,
    OverlayOptions {
  /**
   * unique name (id)
   */
  name: string;

  /** not supported yet */
  enableHWAcceleration?: boolean;
}

export interface IOverlayHotkey {
  name: string;
  keyCode: number;
  modifiers?: {
    alt?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    custom?: number; // custom modifier (i.e key code)
    meta?: boolean;
  };
  passthrough?: boolean;
}

export interface GameLaunchEvent {
  inject: (() => void);
}

/**
 * TBD
 */
export interface OverlayBrowserWindow {
  window: BrowserWindow;

  overlayOptions: OverlayOptions;

  readonly name: string;

  readonly id: number;
}

export interface InjectionError {
  error: string
}

export interface GameWindowInfo {
  size: Size,
  nativeHandle: number,
  focused: boolean,
  graphics: 'd3d9' | 'd3d12' | 'd3d11' | string | undefined
}

export interface ActiveGameInfo {
  gameInfo : GameInfo,
  gameWindowInfo: GameWindowInfo;
}

export declare type GameWindowUpdateReason = undefined | 'resized' | 'focus';
export declare type HotkeyState = 'pressed' | 'released';

export declare type HotkeyCallback = (
  hotKey: IOverlayHotkey,
  state: HotkeyState
) => void;

export interface IOverlayHotkeys {
  /**
   * Register new hotkey.
   * Throw error when hotkey already exits, or callback is missing
   */
  register(hotKey: IOverlayHotkey, callback: HotkeyCallback): void;

  /**
   * Update existing hotkey.
   * Return false if hotkey doesn't exits
   */
  update(hotKey: IOverlayHotkey): boolean;

  /**
   * Clear all hotkeys
   */
  unregisterAll(): void;

  /**
   * Remove hotkey by name.
   * Return false if doesn't exits.
   */
  unregister(name: string): boolean;

  /**
   * Get all active hotkeys.
   */
  all(): IOverlayHotkey[];
}

export interface IOverwolfOverlayApi extends EventEmitter {
  /**
   *  Create new Overlay window
   */
  createWindow(options: OverlayWindowOptions): Promise<OverlayBrowserWindow>;

  /**
   * Game launch registration
   */
  registerGames(filter: GamesFilter);

  /**
   *  injected Game inforamation
   */
  getActiveGameInfo(): ActiveGameInfo | undefined;

  /**
   * Get all open overlay windows
   */
  getAllWindows(): OverlayBrowserWindow[];

  /**
   * The overlay window that owns the given `webContents` or `null` if the contents are not
   * owned by a window.
   */
  fromWebContents(webContents: WebContents): OverlayBrowserWindow | null;

  /**
   * The overlay window that owns the given `BrowserWindow` or `null` if the browerWindow are not
   * owned by a window.
   */
  fromBrowserWindow(browserWindow: BrowserWindow): OverlayBrowserWindow | null;

  /**
   * Overlay hotkeys api
   */
  hotkeys: IOverlayHotkeys;

  /**
   *TODO(bFox) :replace ...args
   */
  on(eventName: 'error', listener: (...args: any[]) => void): this;

  /**
   * Fired when registered game is detected
   * call `event.inject()` to enable overlay for the game.
   */
  on(
    eventName: 'game-launched',
    listener: (event: GameLaunchEvent, gameInfo: GameInfo) => void
  ): this;

  /**
   * Fired on registered game process terminated.
   */
  on(
    eventName: 'game-exit',
    listener: (gameInfo: GameInfo, wasInjected: boolean) => void
  ): this;

  /**
   * Fired when overlay is ready for game.
   *
   */
  on(eventName: 'game-injected', listener: (gameInfo: GameInfo) => void): this;

  /**
   * TODO(bFox) :replace ...args
   */
  on(
    eventName: 'game-injection-error',
    listener: (gameInfo: GameInfo, error: string, ...args: any[]) => void
  ): this;

  /** */
  on(
    eventName: 'game-focus-changed',
    listener: (
      window: GameWindowInfo,
      gameInfo: GameInfo,
      focus: boolean
    ) => void
  ): this;

  /** */
  on(
    eventName: 'game-window-changed',
    listener: (
      window: GameWindowInfo,
      gameInfo: GameInfo,
      reason?: GameWindowUpdateReason
    ) => void
  ): this;
}
