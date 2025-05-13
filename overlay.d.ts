import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Size,
  WebContents,
  Display,
  Rectangle
} from 'electron';
import { EventEmitter } from 'events';

export declare type GameProcessInfo = {
  pid?: number;

  fullPath: string;

  commandLine?: string;

  is32Bit?: boolean;

  isElevated?: boolean;
};

export declare type GameInfo = {
  id: number;

  classId: number;

  name: string;

  supported: boolean;

  processInfo?: GameProcessInfo;

  flags?: any;

  type: 'Game' | 'Launcher';
};

export interface GamesFilter {
  all?: boolean;

  includeUnsupported?: boolean;

  gamesIds: number[];
}

/**
 * Input pass through
 * 'noPassThrough':  Window will handle input and block from game (Default)
 * 'passThrough':  window will not handle any input
 * 'passThroughAndNotify': Window will handle input and also pass it to the game.
 */
export type PassthroughType = "noPassThrough" | "passThrough" | "passThroughAndNotify";

/**
 * Overlay rendering Z-Order
 */
export type ZOrderType = "default" | "topMost" | "bottomMost";

/** Overlay ow-electron options */
export interface OverlayOptions {
  passthrough?: PassthroughType | number;

  zOrder?: ZOrderType | number; // backwards compatible
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

  /** */
  enableIsolation?:boolean;
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
  inject: () => void;
}

/**
 * TBD
 */
export interface OverlayBrowserWindow {
  window: BrowserWindow;

  readonly overlayOptions: OverlayOptions;

  readonly name: string;

  readonly id: number;
}

export interface InjectionError {
  error: string;
}

export interface GameWindowInfo {
  /** The dimensions of the game window. */
  readonly size: Size;

  /** The native window handle (HWND) of the game window. */
  readonly nativeHandle: number;

  /** Indicates whether the game window is currently focused. */
  readonly focused: boolean;

  /** The graphics API used by the game (e.g., Direct3D 9, 11, 12, Vulkan). */
  readonly graphics: 'd3d9' | 'd3d12' | 'd3d11' | 'vulkan' | string | undefined;

  /** Display information for the screen on which the game window resides.
   *  Available since version 1.5.11.
   */
  readonly screen?: Display;

  /** The bounding rectangle of the game window in screen coordinates.
   * Available since version 1.5.11.
   */
  readonly bounds?: Rectangle;
}

export interface GameInputInterception {
  /**
   * Can the Overlay window process input
   * Related to `mixed mode when available` and/or `exclusive only` games
   */
  readonly canInterceptInput?: boolean;
  /**
   * Overlay has full input control, blocking input from the game
   */
  readonly exclusiveMode?: boolean;
}

export interface ActiveGameInfo {
  readonly gameInfo: GameInfo;
  readonly gameWindowInfo: GameWindowInfo;
  readonly gameInputInfo: GameInputInterception;
}

export declare type GameWindowUpdateReason = undefined | 'resized' | 'focus';
export declare type HotkeyState = 'pressed' | 'released';

export declare type HotkeyCallback = (
  hotKey: IOverlayHotkey,
  state: HotkeyState
) => void;

export interface ExclusiveInputOptions {
  /**
   * Exclusive mode FadeIn / FadeOut duration in miliseconds.
   *
   * Use `0` to disable.
   * @default 100
   */
  fadeAnimateInterval?: number;

  /**
   * Exclusive mode overlay background color.
   * Use `rgba(0,0,0,0)` to disable background color
   *
   * Note: Using an invalid color format (e.g: not `rgba(...)`) will throw an Error.
   * @default 'rgba(12, 12, 12, , 0.5)'
   */
  backgroundColor?: string;
}

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
   * Enters Overlay "Exclusive Mode" - meaning, the game no longer receives user
   * input (all input will go to the overlay windows).
   * 
   * The `game-input-exclusive-mode-changed` event fires if exclusive mode was entered.
   *
   * NOTE: This is only supported when getActiveGameInfo returns
   * `"canInterceptInput" == false`. Calling this function when unsupported will
   * be ignored and will not throw an exception.
   */
  enterExclusiveMode(options?: ExclusiveInputOptions): void;

  /**
   * Exits Overlay Exclusive Mode, returning input control to the game.
   *
   * The `game-input-exclusive-mode-changed` event fires when exiting exclusive mode.
   */
  exitExclusiveMode(): void;

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

  /**
   * Fires when the game input interception state changes
   */
  on(
    eventName: 'game-input-interception-changed',
    listener: (info: GameInputInterception) => void
  ): this;

  /**
   * Fires when Overlay input Exclusive Mode changes.
   * Only relevant to `mixed mode when available` and/or `exclusive only` games
   */
  on(
    eventName: 'game-input-exclusive-mode-changed',
    listener: (info: GameInputInterception) => void
  ): this;
}
