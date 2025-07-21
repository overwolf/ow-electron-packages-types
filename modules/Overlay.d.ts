

// -----------------------------------------------------------------------------
// ow-electron packages
/**
 * Represents information about a game process.
 *
 * This type is used to describe metadata related to a running game process,
 * such as its PID, execution path, and other process attributes.
 *
 * @owpackage Overlay
 */
type GameProcessInfo = {
  /**
   * The process ID (PID) of the game, if available.
   */
  pid?: number;

  /**
   * The full file system path to the game's executable.
   */
  fullPath: string;

  /**
   * The full command line used to start the game process, if available.
   */
  commandLine?: string;

  /**
   * Indicates whether the game process is running in 32-bit mode.
   */
  is32Bit?: boolean;

  /**
   * Indicates whether the game process is running with elevated (administrator) privileges.
   */
  isElevated?: boolean;
};


// -----------------------------------------------------------------------------
/**
 * @owpackage Overlay
 */
type GameInfo = {
  id: number;

  classId: number;

  name: string;

  supported: boolean;

  processInfo?: GameProcessInfo;

  flags?: any;

  type: 'Game' | 'Launcher';
};



// -----------------------------------------------------------------------------
/**
 * @owpackage Overlay
 */
type GameInfoType = 'Game' | 'Launcher' | undefined;



/**
 * @owpackage Overlay
 */
type InstalledGameInfo = {
  /**
   * Game overwolf class id
   */
  id: number;

  /**
   * Game Install location
   */
  path?: string;

  /**
   * Game Name
   */
  name?: string;

  /**
   * Game info type
   */
  type?: GameInfoType,

  /**
   * Overlay supported game
   */
  supported?: boolean; 
}




// -----------------------------------------------------------------------------
/**
 * @owpackage Overlay
 */
interface GamesFilter {
  /**
   * Track also unsupported (overlay) games (Default is false)
   */
  includeUnsupported?: boolean;

  /**
   * Set games id's to track
   *
   * when null or empty, will filter all games
   */
  gamesIds?: number[];

  /**
   * when set to all, will also filter all games ()
   */
  all?: boolean;
}



/**
 * Input pass through
 *
 * 'noPassThrough':  Window will handle input and block from game (Default)
 * 'PassThrough':  window will not handle any input
 * 'passThroughAndNotify': Window will handle input and also pass it to the game.
 * 
 * @owpackage Overlay
 */
type PassthroughType = "noPassThrough" | "passThrough" | "passThroughAndNotify";



/**
 * Overlay rendering Z-Order
 * 
 * @owpackage Overlay
 */
type ZOrderType = "default" | "topMost" | "bottomMost";



/** Overlay ow-electron options
 * 
 * @owpackage Overlay
 */
interface OverlayOptions {
  /**
   * Controls how input events are handled by the overlay window
   * @default 'noPassThrough'
   */
  passthrough?: PassthroughType;

  /**
   * Controls the Z-order (stacking order) of the overlay window relative to other window
   * @default 'default'
   */
  zOrder?: ZOrderType;

  /**
   * If true, the overlay will not intercept keyboard input.
   * @default false
   */
  ignoreKeyboardInput?: boolean;
}



/**
 * Overlay window options
 * 
 * @owpackage Overlay
 */
interface OverlayWindowOptions
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

  /**
   * If true, the overlaywindow will be DPI aware (Main monitor DPI).
   * @default false
   * @since 1.7.0
  */
  dpiAware?: boolean;
}


/**
 * Hotkey overlay
 * 
 * @owpackage Overlay
 */
interface IOverlayHotkey {
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



/**
 * options for the `GameLaunchEvent`. 
 * ability to override some game settings in runtime.
 *
 * @see GameLaunchEvent
 * @since 1.8.0
 * 
 * /**
 * Hotkey overlay
 * 
 * @owpackage Overlay
 */
export interface GameLaunchEventOptions {
  /**
   * Force OOPO mode (when oopo is false in game list).
   * @default false
   */
  forceOOPO?: boolean;

  /**
   * Force OOPO mouse Mixed mode control.
   * @default false
   */
  forceOOPOMixedMode?: boolean;
}



/**
 * @owpackage Overlay
 */
interface GameLaunchEvent {
  /**
   * Inject the overlay into the game.
   * @param options - options for the `GameLaunchEvent` since 1.8.0.
   */
  inject: (options?: GameLaunchEventOptions) => void;

  /**
   * Dismiss the overlay.
   */
  dismiss: () => void;
}


/**
 * Overlay browser window
 * 
 * TBD
 * 
 * @owpackage Overlay
 * 
 */
interface OverlayBrowserWindow {
  window: BrowserWindow;

  readonly overlayOptions: OverlayOptions;

  readonly name: string;

  readonly id: number;
}



/**
 * @owpackage Overlay
 */
interface InjectionError {
  error: string;
}



/**
 * @owpackage Overlay
 */
interface GameWindowInfo {
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



/**
 * @owpackage Overlay
 */
interface GameInputInterception {
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


/**
 * @owpackage Overlay
 */
interface ActiveGameInfo {
  readonly gameInfo: GameInfo;
  readonly gameWindowInfo: GameWindowInfo;
  readonly gameInputInfo: GameInputInterception;
}



/**
 * @owpackage Overlay
 */
type GameWindowUpdateReason = undefined | 'resized' | 'focus';



/**
 * @owpackage Overlay
 */
type HotkeyState = 'pressed' | 'released';



/**
 * @owpackage Overlay
 */
type HotkeyCallback = (
  hotKey: IOverlayHotkey,
  state: HotkeyState
) => void;



/**
 * @owpackage Overlay
 */
interface ExclusiveInputOptions {
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



/**
 * @owpackage Overlay
 */
interface IOverlayHotkeys {
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



/**
 * @owpackage Overlay
 */
interface IOverwolfOverlayApi extends EventEmitter {
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
   * Overlay package version
   * @since 1.7.0
  */
  readonly version: string;

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