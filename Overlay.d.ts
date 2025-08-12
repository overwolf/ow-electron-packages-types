/**
 * APIs for controlling and creating overlays in games. Overlay is the ability to show windows on top of the current game window.
 * 
 * ## Standard mode
 * Standard mode is available in games where the mouse is enabled when playing the game. For example, in MOBA games such as League of Legends, Dota 2, and others, the mouse cursor is available, and therefore you are able to interact with the app windows without the need to pull keyboard and mouse focus input from the game.
* 
* ## Exclusive mode
* Exclusive mode is available in games where the mouse is disabled when playing the game. For example, in FPS games such as CS2, Fortnite and others, there’s no mouse cursor, so the only way to interact with the Overwolf app window is by activating exclusive mode. This will show a semi-transparent window overlaid on the game window and doesn't allow keyboard or mouse input to pass into the game.
 * 
 * @packageDocumentation
 */

// -----------------------------------------------------------------------------
// ow-electron packages
/**
 * Information about a running game process.
 *
 * This type is used to describe data related to a running game process,
 * such as its PID, execution path, and other process attributes.
 *
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
   * The command line used to start the game process, if available.
   */
  commandLine?: string;

  /**
   * Indicates if the game process is running in 32-bit mode.
   */
  is32Bit?: boolean;

  /**
   * Indicates if the game process is running with elevated (administrator) privileges.
   */
  isElevated?: boolean;
};


// -----------------------------------------------------------------------------
/**
 * Information about a detected or running game.
 */
type GameInfo = {
  /**
   * Game Id.
   */
  id: number;

  classId: number;
  
  /**
   * Name of the game detected or running.
   */
  name: string;

  supported: boolean;

  /**
   * `GameProcessInfo` type.
   */
  processInfo?: GameProcessInfo;

  flags?: any;

  /**
   * Detected type. 
   * `Game`&mdash;detected as a game.
   * `Launcher`&mdash;detected as a launcher of the game.
   */
  type: 'Game' | 'Launcher';
};



// -----------------------------------------------------------------------------
/**
 * Type of the detected game.
 *
 * Used to differentiate whether the currently tracked process
 * is a standalone game, a game launcher, or undefined.
 *
 * @example
 * ```ts
 * function handleType(type: GameInfoType) {
 *   if (type === 'Game') {
 *     // Launch overlay
 *   } else if (type === 'Launcher') {
 *     // Track launcher status only
 *   }
 * }
 * ```
 */
type GameInfoType = 'Game' | 'Launcher' | undefined;



/**
 * Information about a game installed on the user's system.
 * 
 * Includes:
 * - Game unique ID.
 * - Location.
 * - Display name.
 * - Type (`game` or `launcher`).
 * - Overlay support status.
 * 
 */
type InstalledGameInfo = {
  /**
   * Overwolf game class id.
   */
  id: number;

  /**
   * Game installation path.
   */
  path?: string;

  /**
   * Name of the game.
   */
  name?: string;

  /**
   * `GameInfoType`&mdash;type of the detected game.
   */
  type?: GameInfoType,

  /**
   * Overlay supported game.
   */
  supported?: boolean; 
}




// -----------------------------------------------------------------------------
/**
 * Filter used to specify overlay support in games.
 * 
 */
interface GamesFilter {
  /**
   * Track supported or unsupported overlay games. (Default: false)
   */
  includeUnsupported?: boolean;

  /**
   * Set games id's to track.
   * `null` or empty filters all games.
   */
  gamesIds?: number[];

  /**
   * `true` will filter all games.
   */
  all?: boolean;
}



/**
 * Input passthrough settings:
 *
 * - `noPassThrough`&mdash;window will handle input and block from game (Default).
 * - `PassThrough`&mdash;window will not handle any input.
 * - `passThroughAndNotify`&mdash;window will handle input and also pass it to the game.
 * 
 */
type PassthroughType = "noPassThrough" | "passThrough" | "passThroughAndNotify";



/**
 * Overlay layering of overlapping windows along the z-axis (depth).
 * 
 * - `default`&mdash;the default setting in Windows.
 * - `topMost`&mdash;bring overlay to the top most position.
 * - `bottomMost`&mdash;put window in the bottom most position.
 * 
 */
type ZOrderType = "default" | "topMost" | "bottomMost";



/**
 * Configuration options for creating or modifying an overlay window.
 *
 * Control over:
 * - User input.
 * - Window stacking.
 * - Keyboard event handling.
 *
 * @example
 * ```ts
 * const options: OverlayOptions = {
 *   passthrough: 'mouseOnly',
 *   zOrder: 'alwaysOnTop',
 *   ignoreKeyboardInput: true
 * };
 * ```
 */
interface OverlayOptions {
  /**
   * Controls how input events are handled by the overlay window.
   * @default 'noPassThrough' 
   * @see {@link PassthroughType}.
   *
   */
  passthrough?: PassthroughType;

  /**
   * Controls the Z-order (stacking order) of the overlay window relative to other window.
   * @default 'default' 
   * @see {@link ZOrderType}.
   */
  zOrder?: ZOrderType;

  /**
   * `true`&mdash;the overlay won't intercept keyboard input.
   * @default false
   */
  ignoreKeyboardInput?: boolean;
}



/**
 * Configuration options for an overlay window.
 * 
 * Combines standard Electron `BrowserWindowConstructorOptions` with additional
 * overlay specific behaviors defined in `OverlayOptions`.
 *
 * Used to define overlay window:
 * - Rendering.
 * - Stacking.
 * - Input behavior.
 * - Hardware acceleration.
 */
interface OverlayWindowOptions
  extends BrowserWindowConstructorOptions,
    OverlayOptions {
  /**
   * Unique name (id) for the window.
   */
  name: string;

  /** 
   * 
   * This option is not currently supported and has no effect. It is reserved for future use.
   * 
   */
  enableHWAcceleration?: boolean;
  
  
  /** 
   * Enables Chromium process isolation (sandboxing).
   * Used to enforce stricter security policies or prevent resource sharing between renderer processes.
  */
  enableIsolation?:boolean;

  /**
   * `true`&mdash;the overlay window will be DPI aware (Main monitor DPI).
   * 
   * @default false
   * 
   * @since 1.7.0
  */
  dpiAware?: boolean;
}

/**
 * Hotkey configuration used by the overlay.
 *
 * Defines:
 * - Main key.
 * - Optional modifier keys.
 * - Passthrough behavior.
 *
 * @example
 * ```ts
 * const screenshotHotkey: IOverlayHotkey = {
 *   name: 'screenshot',
 *   keyCode: 44, // Print Screen
 *   modifiers: { ctrl: true, alt: true },
 *   passthrough: false
 * };
 * ```
 */
interface IOverlayHotkey {
  /**
   * Unique name of the hotkey.
   */
  name: string;
  /**
   * Primary key code for the hotkey. Use standard keyboard codes.
   */
  keyCode: number;
  /**
   * Modifier keys that must be pressed along with the main key.
   */
  modifiers?: {
    /**
     * Used for `alt` ket.
     */
    alt?: boolean;
    /**
     * Used for `ctrl` key.
     */
    ctrl?: boolean;
    /**
     * Used for `shift` key.
     */
    shift?: boolean;
    /**
     * Custom key binding. Use key code.
     */
    custom?: number;
    /**
     * Use for the `windows` or `command` key.
     */
    meta?: boolean;
  };
  /**
   * `true`&mdash;the hotkey will be passed through to the underlying game.
   * `false`&mdash;the hotkey will be captured exclusively by the overlay.
   */
  passthrough?: boolean;
}




/**
 * Configuration flags for launching or injecting the overlay into a game process.
 *
 * Overrides default behavior related to *Overwolf's Out-of-Process Overlay* (OOPO) for compatibility or debugging.
 *
 * @example
 * ```ts
 * const options: GameLaunchEventOptions = {
 *   forceOOPO: true,
 *   forceOOPOMixedMode: true
 * };
 * ```
 * 
 * @see {@link GameLaunchEvent}.
 * @since 1.8.0
 */
export interface GameLaunchEventOptions {
  /**
   * Force OOPO mode (when OOPO is false in game list).
   * @default false
   */
  forceOOPO?: boolean;

  /**
   * Force OOPO mixed-mode mouse control.
   * Use for debugging or enabling hybrid input behavior in games that don't support it.
   * @default false
   */
  forceOOPOMixedMode?: boolean;
}



/**
 * Event fired when a supported game is launched.
 *
 * Provides handlers to inject or dismiss the overlay at game detection.
 *
 * @example
 * ```ts
 * overlay.on('game-launched', (event, gameInfo) => {
 *   if (gameInfo.isSupported) {
 *     event.inject(); // Inject overlay immediately
 *   } else {
 *     event.dismiss(); // Skip unsupported games
 *   }
 * });
 * ```
 */
interface GameLaunchEvent {
  /**
   * Inject the overlay into the game.
   * @param options - Injection of configuration options. 
   * @since 1.8.0.
   */
  inject: (options?: GameLaunchEventOptions) => void;

  /**
   * Dismiss the overlay. Used to skip injection if the detected game doesn't meet the required conditions.
   */
  dismiss: () => void;
}


/**
 * Active overlay window instance.
 * 
 *  Wraps an Electron `BrowserWindow` with metadata and configuration
 * specific to the overlay:
 * - ID.
 * - Name.
 * - Display behavior.
 * 
 */
interface OverlayBrowserWindow {
  window: BrowserWindow;
  
  /**
   * Overlay specific configuration options used when this window was created.
   * @see {@ink OverlayOptions}.
   */
  readonly overlayOptions: OverlayOptions;
  
  /**
   * Unique name for the overlay window.
   */
  readonly name: string;
  /**
   * ID assigned to the overlay window.
   */
  readonly id: number;
}

/**
 * Error handler for the overlay injection process.
 * 
 * Used in event callbacks or API responses to describe issues
 * preventing successful injection into a game.
 *
 * @example
 * ```ts
 * overlay.on('game-injection-error', (gameInfo, error) => {
 *   console.error('Injection failed:', error.error);
 * });
 * ```
 */
interface InjectionError {
  error: string;
}

/**
 * Information about a running game's window.
 * 
 * Used to determine:
 * - Window focus.
 * - Screen location.
 * - Rendering context
 * - Integration details for display or input interception.
 *
 * @example
 * ```ts
 * overlay.on('game-focus-changed', (windowInfo, gameInfo, isFocused) => {
 *   if (windowInfo.focused) {
 *     console.log(`Game window is focused. Size: ${windowInfo.size.width}x${windowInfo.size.height}`);
 *   }
 * });
 * ```
 */
interface GameWindowInfo {
  /** 
   * The dimensions of the game window. 
   */
  readonly size: Size;

  /** 
   * The native window handle (HWND) of the game window.
   */
  readonly nativeHandle: number;

  /** 
   * Indicates if the game window is currently in focus.
   */
  readonly focused: boolean;

  /** 
   * The graphics API used by the game (e.g., Direct3D 9, 11, 12, Vulkan).
   */
  readonly graphics: 'd3d9' | 'd3d12' | 'd3d11' | 'vulkan' | string | undefined;

  /** Display information for the screen on which the game window resides.
   *  @since 1.5.11.
   */
  readonly screen?: Display;

  /** 
   * The bounding rectangle of the game window in screen coordinates.
   * @since 1.5.11.
   */
  readonly bounds?: Rectangle;
}

/**
 * State of input handling between the game and the overlay system.
 * 
 * Used for determining whether the overlay can intercept input events,
 * or whether it has fully taken control over user input in exclusive mode.
 *
 * @example
 * ```ts
 * overlay.on('game-input-interception-changed', (info) => {
 *   if (info.canInterceptInput) {
 *     console.log('Overlay can now intercept input.');
 *   }
 * });
 * ```
 */
interface GameInputInterception {
  /**
   * Can the overlay window process input.
   * Related to `mixed mode when available` and/or `exclusive only` games.
   */
  readonly canInterceptInput?: boolean;
  /**
   * `true`&mdash;overlay has full input control blocking input from the game.
   */
  readonly exclusiveMode?: boolean;
}


/**
 * Current state of an actively running and detected game.
 *
 * Combines general game metadata, window information, and input interception state,
 * allowing the overlay to assess readiness and manage behavior accordingly.
 *
 * @example
 * ```ts
 * const activeGame = overlay.getActiveGameInfo();
 * if (activeGame?.gameInputInfo.canInterceptInput) {
 *   console.log(`Overlay input active for ${activeGame.gameInfo.title}`);
 * }
 * ```
 */
interface ActiveGameInfo {
  /**
   * Information about the currently running game.
   * @see {@link GameInfo}.
   */
  readonly gameInfo: GameInfo;
  /**
   * Window-specific details for the running game.
   * @see {@link GameWindowInfo}.
   */
  readonly gameWindowInfo: GameWindowInfo;
  /**
   * Input interception state between the overlay and the game.
   * @see {@link GameInputInterception}.
   */
  readonly gameInputInfo: GameInputInterception;
}

/**
 * Reason for a game window update event.
 * 
 * Used in callbacks where the overlay needs to respond to
 * changes in the game window's state, such as resizing or focus change.
 *
 * ```ts
 * overlay.on('game-window-changed', (window, game, reason) => {
 *   if (reason === 'resized') {
 *     console.log('Game window was resized.');
 *   }
 * });
 * ```
 */
type GameWindowUpdateReason = undefined | 'resized' | 'focus';

/**
 * Indicates the state of a hotkey event.
 * 
 * @example
 * ```ts
 * function handleHotkey(state: HotkeyState) {
 *   if (state === 'pressed') {
 *     console.log('Hotkey pressed!');
 *   } else {
 *     console.log('Hotkey released.');
 *   }
 * }
 * ```
 */
type HotkeyState = 'pressed' | 'released';



/**
 * Callback for handling hotkey events.
 * 
 * Triggered when a registered overlay hotkey is pressed or released.
 * @param hotKey - The hotkey object containing key code, modifiers, and metadata.
 * @param state - The current state of the hotkey (`pressed` or `released`).
 *
 * @example
 * ```ts
 * const onHotkey: HotkeyCallback = (hotKey, state) => {
 *   if (state === 'pressed' && hotKey.name === 'screenshot') {
 *     captureScreenshot();
 *   }
 * };
 * ```
 */
type HotkeyCallback = (
  hotKey: IOverlayHotkey,
  state: HotkeyState
) => void;

/**
 * Configuration options for entering exclusive input mode in the overlay.
 *
 * These settings control the visual and behavioral aspects of the overlay
 * when it takes exclusive control over input, preventing the game from receiving user input.
 */
interface ExclusiveInputOptions {
  /**
   * Exclusive mode FadeIn / FadeOut duration in milliseconds.
   *
   * Use `0` to disable.
   *
   * @default 100
   */
  fadeAnimateInterval?: number;

  /**
   * Exclusive mode overlay background color.
   * 
   * Use `rgba(0,0,0,0)` to disable background color
   *
   * **NOTE**
   * Using an invalid color format (e.g: not `rgba(...)`) will throw an Error.
   * 
   * @default 'rgba(12, 12, 12, , 0.5)'
   */
  backgroundColor?: string;
}



/**
 * Manages the registration, update, and removal of overlay hotkeys.
 *
 * Handling of user-defined or programmatically
 * assigned hotkeys that interact with the overlay during gameplay.
 *
 * Hotkeys are identified by unique names and support modifier keys and passthrough options.
 *
 * @example
 * ```ts
 * const hotkey: IOverlayHotkey = {
 *   name: 'toggleOverlay',
 *   keyCode: 192, // `
 *   modifiers: { ctrl: true },
 *   passthrough: false
 * };
 *
 * overlay.hotkeys.register(hotkey, (hotKey, state) => {
 *   if (state === 'pressed') toggleOverlay();
 * });
 * ```
 */
interface IOverlayHotkeys {
  /**
   * Register new hotkey.
   * Throw error when hotkey already exits, or callback is missing.
   */
  register(hotKey: IOverlayHotkey, callback: HotkeyCallback): void;

  /**
   * Update existing hotkey.
   * Return `false` if hotkey doesn't exist.
   */
  update(hotKey: IOverlayHotkey): boolean;

  /**
   * Clear all hotkeys.
   */
  unregisterAll(): void;

  /**
   * Remove hotkey by name.
   * Return `false` if doesn't exits.
   */
  unregister(name: string): boolean;

  /**
   * Get all active hotkeys.
   */
  all(): IOverlayHotkey[];
}



/**
 * API managing Overwolf overlay windows, hotkeys, input modes, and game integration.
 *
 * Enables apps to:
 * - Register and track game activity.
 * - Inject overlays into supported games.
 * - Manage hotkeys.
 * - Control input interception behavior.
 *
 * Extends the `EventEmitter` interface to allow for subscription to overlay-related events such as
 * game launch, focus changes, and input mode transitions.
 *
 * @example
 * ```ts
 * const overlay: IOverwolfOverlayApi = getOverlayApi();
 *
 * overlay.on('game-launched', (event, gameInfo) => {
 *   if (gameInfo.isSupported) {
 *     event.inject();
 *   }
 * });
 * ```
 */
interface IOverwolfOverlayApi extends EventEmitter {
  /**
   *  Create new Overlay window.
   * @param options - Window configuration including name, z-order, passthrough, etc. 
   * @returns A promise that resolves to the created `OverlayBrowserWindow`.
   * @see {@link OverlayWindowOptions}.
   * @see {@link OverlayBrowserWindow}.
   */
  createWindow(options: OverlayWindowOptions): Promise<OverlayBrowserWindow>;

  /**
   * Game launch registration.
   * @param filter - Configuration specifying which games to register and whether to include unsupported titles.
   * @see {@link GamesFilter}.
   */
  registerGames(filter: GamesFilter);

  /**
   * Retrieves information about the currently active game, if available.
   * @see {@link ActiveGameInfo}.
   */
  getActiveGameInfo(): ActiveGameInfo | undefined;

  /**
   * Get all open overlay windows.
   * @returns An array of `OverlayBrowserWindow` instances.
   * @see {@link OverlayBrowserWindow}.
   */
  getAllWindows(): OverlayBrowserWindow[];

  /**
   * Returns the overlay window associated with a given `WebContents` instance.
   * @param webContents - The Electron WebContents to query. 
   * @see {@link OverlayBrowserWindow}.
   * @returns The corresponding overlay window or `null` if not found. 
   */
  fromWebContents(webContents: WebContents): OverlayBrowserWindow | null;

  
  /**
   * Returns the overlay window associated with a given `BrowserWindow`.
   *
   * @param browserWindow - The Electron `BrowserWindow` to query.
   * @returns The corresponding overlay window or `null` if not owned by the overlay system.
   * @see {@link OverlayBrowserWindow}.
   */
  fromBrowserWindow(browserWindow: BrowserWindow): OverlayBrowserWindow | null;

 /**
   * The hotkeys API used to register, update, and remove overlay hotkeys.
   * @see {@link IOverlayHotkeys}.
   */
  hotkeys: IOverlayHotkeys;

  /**
   * The current version of the overlay package.
   *
   * @since 1.7.0
   */
  readonly version: string;

  /**
   * Enters Overlay "Exclusive Mode" and the game no longer receives user
   * input (all input will go to the overlay windows).
   *
   * The `game-input-exclusive-mode-changed` event fires if exclusive mode was entered.
   *
   * NOTE: This is only supported when `getActiveGameInfo` returns
   * `"canInterceptInput" == false`. Calling this function when unsupported will
   * be ignored and will not throw an exception.
   */
  enterExclusiveMode(options?: ExclusiveInputOptions): void;

  /**
   * Enters exclusive input mode, redirecting all user input to overlay windows only.
   *
   * This is only effective if `getActiveGameInfo().gameInputInfo.canInterceptInput` is `true`.
   *
   */
  exitExclusiveMode(): void;

  /**
   * Exits exclusive input mode, returning input control back to the game.
   */
  on(eventName: 'error', listener: (...args: any[]) => void): this;

  /**
   * Fires when a registered game is detected.
   * Call `event.inject()` to enable the overlay for the game.
   *
   * @param eventName - The event identifier for when a game is launched.
   * @param listener - Callback with game launch event and game metadata.
   * @see {@link GameInfo}.
   */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

/**
 * Fired when a registered game process terminates.
 *
 * Triggered on game exit.
 * Useful for performing cleanup, UI updates, or stopping background tasks.
 *
 * @param eventName - The event identifier for when the game exits.
 * @param listener - A callback function that receives the game info of the exited game.
 *
 * @example
 * ```ts
 * overlay.on('game-exit', (gameInfo) => {
 *   console.log(`Game exited: ${gameInfo.title}`);
 *   cleanupOverlayResources();
 * });
 * ```
 * 
 * @see {@link GameInfo}.
 */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Fires when the overlay is ready and successfully injected into the game.
   *
   * @param eventName - `game-injected`
   * @param listener - Callback with game info.
   * @see {@link GameInfo}.
   */
  on(eventName: 'game-injected', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Fires when overlay injection into the game fails.
   *
   * @param eventName - `game-injection-error`
   * @param listener - Callback with game info, error message, and optional additional args.
   * @see {@link GameInfo}.
   */
  on(
    eventName: 'game-injection-error',
    listener: (gameInfo: GameInfo, error: string, ...args: any[]) => void
  ): this;

  /**
   * Fires when the game window focus state changes.
   *
   * @param eventName - `game-focus-changed`
   * @param listener - Callback with window info, game info, and focus state.
   * @see {@link GameWindowInfo}.
   * @see {@link GameInfo}.
   */
  on(
    eventName: 'game-focus-changed',
    listener: (
      window: GameWindowInfo,
      gameInfo: GameInfo,
      focus: boolean
    ) => void
  ): this;

  /**
   * Fires when the game window is resized or changes position.
   *
   * @param eventName - `game-window-changed`
   * @param listener - Callback with window info, game info, and optional reason.
   * @see {@link GameWindowInfo}.
   * @see {@link GameInfo}.
   * @see {@link GameWindowUpdateReason}.
   */
  on(
    eventName: 'game-window-changed',
    listener: (
      window: GameWindowInfo,
      gameInfo: GameInfo,
      reason?: GameWindowUpdateReason
    ) => void
  ): this;

  /**
   * Fires when the game input interception capability changes.
   *
   * @param eventName - `game-input-interception-changed`
   * @param listener - Callback with updated input state.
   * @see {@link GameInputInterception}.
   * 
   */
  on(
    eventName: 'game-input-interception-changed',
    listener: (info: GameInputInterception) => void
  ): this;

  /**
   * Fires when exclusive input mode state changes.
   *
   * @param eventName - `game-input-exclusive-mode-changed`
   * @param listener - Callback with input mode details.
   * @see {@link GameInputInterception}.
   */
  on(
    eventName: 'game-input-exclusive-mode-changed',
    listener: (info: GameInputInterception) => void
  ): this;
}
