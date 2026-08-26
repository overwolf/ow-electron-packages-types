/**
 * APIs for controlling and creating overlays in games. Overlay is the ability to show windows on top of the current game window.
 * 
 * ## Standard mode
 * Standard mode is used in games where the mouse is visible while playing the game. For example, in MOBA games such as League of Legends, Dota 2, and others, the mouse cursor is visible during gameplay, and therefore you are able to interact with the app windows without the need to pull keyboard and mouse focus input from the game.
* 
* ## Exclusive mode
* Exclusive mode is used in games where the mouse is not visible while playing the game. For example, in FPS games such as Apex Legends, Fortnite and others, the mouse cursor is not visible during gameplay, so the only way to interact with the Overwolf app window is by entering exclusive mode. This will show a semi-transparent window overlaid on the game window and doesn't allow keyboard or mouse input to pass into the game.
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
   * The running game's ID as declared by the gameslist.
   * For example: League of Legends game id is: 5426
   */
  id: number;

  /**
   * The running game's class ID as declared by the gameslist.
   * For example: League of Legends game class id is: 54261
   */
  classId: number;
  
  /**
   * Name of the detected or running game.
   */
  name: string;

  /**
   * Indicates if the game supports Overlay.
   */
  supported: boolean;

  /**
   * `GameProcessInfo` type.
   */
  processInfo?: GameProcessInfo;

  /**
   * Gameslist flags associated with the game.
   */
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
 * is a game, a game launcher, or undefined.
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
 * - The Game's ID.
 * - Installation path and install folder.
 * - Steam store ID (if installed via Steam).
 * - Epic Games store ID (if installed via Epic Games Launcher).
 * - Name of the game.
 * - Type (`game` or `launcher`).
 * - Overlay support status.
 *
 */
type InstalledGameInfo = {
  /**
   * The game's ID as declared by the gameslist.
   */
  id: number;

  /**
   * The full file system path to the game's installation directory.
   */
  path?: string;

  /**
   * The root folder where the game is installed.
   * (when detected from steam or epic)
   */
  installFolder?: string;

  /**
   * The game's Steam store ID.
   */
  steamId?: number;

  /**
   * The game's Epic Games store ID.
   */
  epicId?: string;

  /**
   * Name of the game.
   */
  name?: string;

  /**
   * `GameInfoType`&mdash;type of the detected game.
   */
  type?: GameInfoType,

  /**
   * Indicates if the game supports Overlay.
   */
  supported?: boolean; 
}




// -----------------------------------------------------------------------------
/**
 * Filter object for game overlays.
 *
 * Used to specify which games to include or exclude from overlay tracking.
 */
interface GamesFilter {
  /**
   * Include tracking of unsupported overlay games. (Default: false)
   */
  includeUnsupported?: boolean;

  /**
   * Array of game IDs to track.
   * 
   * If `null` or empty, filters all games.
   */
  gamesIds?: number[];

  /**
   * Include all games in the overlay tracking.
   */
  all?: boolean;
}



/**
 * Type of input passthrough behavior for overlay windows.
 *
 * - `noPassThrough`&mdash;All input will be handled by the window and blocked from the game (Default).
 * - `PassThrough`&mdash;All input will be passed through to the game.
 * - `passThroughAndNotify`&mdash;All input will be passed through to the game, and the window will be notified of the input events.
 */
type PassthroughType = "noPassThrough" | "passThrough" | "passThroughAndNotify";



/**
 * Type of overlay window stacking behavior.
 *
 * Used to control the z-order (stacking order) of the overlay window relative to other windows.
 *
 * - `default`&mdash;Bring to front the currently focused overlay window.
 * - `topMost`&mdash;Set the overlay window to the top most position, above all other windows.
 * - `bottomMost`&mdash;Set the overlay window to the bottom most position, below all other windows.
 *
 */
type ZOrderType = "default" | "topMost" | "bottomMost";



/**
 * Which GPU Windows should run this application on.
 *
 * - `default`&mdash;No preference is recorded; Windows decides (normally the adapter driving the primary display).
 * - `highPerformance`&mdash;Pin the application to the high-performance (usually discrete) adapter.
 *
 * @see {@link IOverwolfOverlayApi.setGpuPreference}.
 *
 * @since 2.0.5
 */
type GpuPreference = "default" | "highPerformance";

/**
 * Why the shared-texture rendering path cannot be used with the current game.
 *
 * - `unsupportedGraphicsApi`&mdash;The game's graphics API cannot composite GPU textures
 *   (D3D9 / OpenGL / Vulkan). Nothing to fix; the overlay uses the CPU copy path for this
 *   game.
 * - `gpuAdapterMismatch`&mdash;The game renders on a different GPU adapter than Chromium,
 *   and a shared texture handle can only be opened on the adapter that created it. Fixable
 *   with {@link IOverwolfOverlayApi.setGpuPreference} and an application restart.
 * - `copyFailure`&mdash;The game repeatedly failed to open the shared texture handles it
 *   received in-game. The overlay retried, then fell back to the CPU copy path.
 *   {@link IOverwolfOverlayApi.setGpuPreference} may help when the root cause is
 *   adapter-related.
 * - `handleTransportBlocked`&mdash;The GPU textures could not be handed to the game process
 *   at all. Nothing the application can do; the overlay uses the CPU copy path for this game.
 *
 * @see {@link IOverwolfOverlayApi.on} `shared-texture-unavailable`.
 *
 * @since 2.0.5
 */
type SharedTextureUnavailableReason =
  | "unsupportedGraphicsApi"
  | "gpuAdapterMismatch"
  | "copyFailure"
  | "handleTransportBlocked";



/**
 * Overlay configuration options for creating or modifying an overlay window.
 *
 * Control over:
 * - Input passthrough behavior.
 * - Overlay window stacking behavior.
 * - Keyboard input interception.
 *
 * @example
 * ```ts
 * const options: OverlayOptions = {
 *   passthrough: 'noPassThrough',
 *   zOrder: 'default',
 *   ignoreKeyboardInput: false
 * };
 * ```
 */
interface OverlayOptions {
  /**
   * Controls how input is handled by the overlay window.
   * @default 'noPassThrough'
   * @see {@link PassthroughType}.
   *
   */
  passthrough?: PassthroughType;

  /**
   * Controls the z-order (stacking order) of the overlay window.
   * @default 'default'
   * @see {@link ZOrderType}.
   */
  zOrder?: ZOrderType;

  /**
   * Controls whether the overlay intercepts keyboard input.
   *
   * `true`&mdash;the overlay won't intercept keyboard input.
   * @default false
   */
  ignoreKeyboardInput?: boolean;

  /**
   * When `true`, the overlay window is strictly confined to the game window boundaries.
   *
   * This prevents the overlay from being moved outside the game window area.
   * @default false
   * 
   * @since 1.9.0
   */
  strictToGameWindow?: boolean;
}



/**
 * Configuration options for an overlay window.
 *
 * Used at creation time to define the overlay window's behavior and appearance.
 * Extends:
 * - Standard Electron `BrowserWindowConstructorOptions`.
 * - Overlay specific behaviors using `OverlayOptions`.
 */
interface OverlayWindowOptions
  extends BrowserWindowConstructorOptions,
    OverlayOptions {
  /**
   * Unique name (id) for the window.
   */
  name: string;

  /**
   * `true`&mdash;disables hardware (GPU) acceleration for this overlay window
   * only, rendering it via software (CPU) compositing. Unlike
   * `app.disableHardwareAcceleration()`, this is scoped to the single window and
   * does not affect the rest of the application.
   *
   * Note: shared-texture windows require hardware acceleration to be enabled.
   * Disabling it turns off the GPU-backed shared-texture path, so this option is
   * incompatible with (and ignored for) windows that render via a shared
   * texture.
   *
   * Requires ow-electron >= 39.8.10; ignored on earlier versions.
   *
   * @default false
   *
   * @see {@link https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering#software-output-device | Software output device}
   *
   * @since 1.13.20
   */
  disableHardwareAcceleration?: boolean;

  /**
   * ⚠️ BETA &mdash; this option is experimental and its behavior may change in
   * a future release.
   *
   * `true`&mdash;renders this overlay window through a GPU shared texture
   * instead of copying pixels through shared memory on every paint. The overlay
   * forwards the GPU texture handle directly to the injected game process, which
   * composites it without any CPU-side pixel copy, significantly lowering
   * per-frame CPU overhead.
   *
   * Requires hardware acceleration to be enabled and the shared-texture path to
   * be usable with the current game (see
   * {@link GameWindowInfo.isSharedTextureAvailable}). The flag is silently
   * ignored when either condition is not met, falling back to the
   * shared-memory (CPU copy) path.
   *
   * The rendering path follows the active game: when the overlay moves to a
   * different game, a shared-texture window automatically falls back to the
   * shared-memory (CPU copy) path on a game that does not support shared
   * texture, and restores the shared-texture path on a game that does — so the
   * window stays visible on every game.
   *
   * @default false
   *
   * @see {@link https://dev.overwolf.com/ow-electron/reference/examples/overlay | Overlay examples}
   *
   * @since 2.0.2
   */
  useSharedTexture?: boolean;

  /**
   * Enables Chromium process isolation (sandboxing).
   * Used to enforce stricter security policies or prevent resource sharing between renderer processes.
  */
  enableIsolation?:boolean;

  /**
   * `true`&mdash;the overlay window will be DPI aware (Main monitor DPI).
   *
   * This allows the overlay to scale correctly on high DPI displays.
   * @default false
   * 
   * @since 1.7.0
  */
  dpiAware?: boolean;
}

/**
 * Represents an overlay hotkey configuration.
 *
 * Defines:
 * - Unique name.
 * - Main keycode.
 * - Optional modifier keys.
 * - Passthrough behavior.
 *
 * @example
 * ```ts
 * const screenshotHotkey: IOverlayHotkey = {
 *   name: 'take-screenshot',
 *   keyCode: 80, // p
 *   modifiers: { ctrl: true, alt: true },
 *   passthrough: false
 * };
 *
 * // Since 1.13.3: use W3C KeyboardEvent.code strings (preferred, layout-independent)
 * const toggleHotkey: IOverlayHotkey = {
 *   name: 'toggle',
 *   keyCode: 'KeyF',
 *   modifiers: { ctrl: true, custom: 'Tab' },
 *   passthrough: true
 * };
 * ```
 */
interface IOverlayHotkey {
  /**
   * Unique name of the hotkey.
   */
  name: string;

  /**
   * Primary key code for the hotkey.
   *
   * Accepts a numeric Windows Virtual-Key (VK) code or a W3C {@link https://www.w3.org/TR/uievents-code/ | KeyboardEvent.code}
   * string (e.g. `'KeyF'`, `'F10'`, `'ArrowUp'`).
   *
   * @remarks
   * Numeric VK codes are layout-dependent — the same physical key produces a different
   * VK number on non-QWERTY keyboards. Passing a `KeyboardEvent.code` string identifies
   * the physical key unambiguously regardless of the user's keyboard layout.
   *
   * String values are resolved to VK codes at registration time. An unrecognized string
   * throws immediately so misconfigured hotkeys are caught early.
   *
   * **Supported string codes include:** `KeyA`–`KeyZ`, `Digit0`–`Digit9`,
   * `F1`–`F24`, `Numpad0`–`Numpad9`, `ArrowUp`/`Down`/`Left`/`Right`, `Tab`, `Enter`,
   * `Space`, `Backspace`, `Delete`, `Escape`, `Home`, `End`, `PageUp`, `PageDown`,
   * `ShiftLeft`/`Right`, `ControlLeft`/`Right`, `AltLeft`/`Right`, `Backquote`,
   * `Minus`, `Equal`, `BracketLeft`/`Right`, `Semicolon`, `Quote`, `Comma`,
   * `Period`, `Slash`, `Backslash`, and media/browser/launch keys.
   *
   * @throws `Error('Unknown hotkey code: "<value>". Pass a valid KeyboardEvent.code string…')`
   * thrown at registration time when the string does not map to a known VK code.
   * Validate the string before calling `register` if the value comes from user input.
   *
   * @example
   * ```ts
   * // Preferred: physical key position, layout-independent
   * api.hotkeys.register({ name: 'toggle', keyCode: 'KeyF' }, callback);
   *
   * // With modifier using string code
   * api.hotkeys.register({
   *   name: 'screenshot',
   *   keyCode: 'KeyP',
   *   modifiers: { ctrl: true }
   * }, callback);
   *
   * // Legacy: numeric VK code (still valid)
   * api.hotkeys.register({ name: 'toggle-legacy', keyCode: 70 }, callback);
   *
   * // Throws at registration — unknown string
   * api.hotkeys.register({ name: 'bad', keyCode: 'Bogus' }, callback);
   * // Error: Unknown hotkey code: "Bogus". Pass a valid KeyboardEvent.code string…
   * ```
   */
  keyCode: number | string;

  /**
   * Modifier keys that must be pressed along with the main key.
   */
  modifiers?: {
    /**
     * Used for `alt` key.
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
     * Custom key binding. Accepts a numeric Windows Virtual-Key code or,
     * since 1.13.3, a W3C `KeyboardEvent.code` string (same format as
     * `keyCode`).
     */
    custom?: number | string;
    /**
     * Use for the `windows` or `command` key.
     */
    meta?: boolean;
  };

  /**
   * Controls whether the hotkey will be passed through to the underlying game.
   *
   * - If `true`, the hotkey will be captured by the overlay and pass to the game.
   * - If `false`, the hotkey will be captured exclusively by the overlay.
   *
   * @default false
   */
  passthrough?: boolean;
}




/**
 * Configuration options for controlling the type of overlay we inject.
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
   * 
   * Used for debugging or enabling hybrid input behavior in games that don't support it.
   * @default false
   */
  forceOOPOMixedMode?: boolean;
}



/**
 * Event fired when a game is launched.
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
   * @see {@link GameLaunchEventOptions}.
   * @since 1.8.0.
   */
  inject: (options?: GameLaunchEventOptions) => void;

  /**
   * Dismiss the overlay. Used to skip injection if the detected game doesn't meet the required conditions.
   */
  dismiss: () => void;
}


/**
 * Represents an overlay window instance.
 *
 * Wraps an Electron `BrowserWindow` with metadata and configuration specific to the overlay:
 * - Name.
 * - ID.
 * - Display behavior.
 * 
 */
export interface OverlayBrowserWindow {
  window: BrowserWindow;
  
  /**
   * Overlay specific configuration options used when this window was created.
   * @see {@link OverlayOptions}.
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

  /**
   * The window DPI in percentage (1.25 = 125%).
   */
  readonly scaleFactor: number;

  /**
   * Initiates dragging of the overlay window.
   *
   * Works only when the window is both visible and focused.
   * Triggered by the `mousedown` event on the overlay window.
   *
   * You can achieve the same behavior by applying
   * the CSS property `-webkit-app-region: drag` to the draggable element.
   *
   * @example
   * ```ts
   * renderer:
   * 
   * 
   * 
   * const startDraggingButton = document.getElementById("startDragging");
   * startDraggingButton.addEventListener("mousedown", () => {
   *   ipcRenderer.send('startDraggingOsr');
   * });
   *
   * main:
   *  
   *   
   *  
   * ipcMain.on('startDraggingOsr', (e) => {
   *   const overlayWindow = this.overlayApi.fromWebContents(e.sender);
   *   if (!overlayWindow) {
   *     return;
   *   }
   *   overlayWindow.startDragging();
   * });
   * ```
   */
  startDragging(): void;

}

/**
 * Error handler for the overlay injection process.
 * 
 * Used in event callbacks or API responses to describe issues
 * preventing successful injection into a game.
 * 
 */
interface InjectionError {
  error: string;
}

/**
 * Information about a running game's window.
 * 
 * Used to determine:
 * - Window size.
 * - Window focus.
 * - Graphics API used by the game.
 * - Screen display information.
 * - Bounding rectangle of the game window.
 *
 * @example
 * ```ts
 * overlay.on('game-window-changed', (windowInfo, gameInfo, reason) => {
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
   * The bounding rectangle of the game window in the screen's coordinates.
   *
   * For example: `bounds: { x: 100, y: 100, width: 800, height: 600 }`
   *
   * Means the game window is positioned at (100, 100) on the screen and has a size of 800x600 pixels.
   * @since 1.5.11.
   */
  readonly bounds?: Rectangle;

  /**
   * Indicates if the game is currently running in fullscreen exclusive mode.
   *
   * Relevant only for OOPO games.
   * @since 1.9.0
   */
  readonly isFullscreen?: boolean;

  /**
   * Indicates if fullscreen rendering is disabled.
   *
   * Relevant only for OOPO games.
   * @since 1.9.0
   */
  readonly isOOPOFullscreenRenderingDisabled?: boolean;

  /**
   * Indicates whether the game's **graphics API** supports shared-texture (GPU) overlay
   * rendering: `true` for D3D11 / D3D12, `false` for D3D9 / OpenGL / Vulkan.
   *
   * This is a capability probe only &mdash; to decide whether the path can actually be used
   * on this machine, gate on {@link GameWindowInfo.isSharedTextureAvailable} instead.
   *
   * `undefined` until the game is injected and its graphics API is detected.
   *
   * @since 2.0.0
   */
  readonly isSharedTextureSupported?: boolean;

  /**
   * Indicates whether shared-texture (GPU) overlay rendering can actually be used with this
   * game &mdash; gate `useSharedTexture` window creation on it.
   *
   * `true` when the game's graphics API supports it
   * ({@link GameWindowInfo.isSharedTextureSupported}), no GPU adapter mismatch was detected,
   * **and** the path was not abandoned after repeated in-game copy failures. When it is
   * `false`, the `shared-texture-unavailable` event names the reason. It can therefore turn
   * `false` mid-game: the copy-failure verdict is reached only after frames were sent and
   * repeatedly failed to draw.
   *
   * `undefined` until the game is injected and its graphics API is detected.
   *
   * @see {@link https://dev.overwolf.com/ow-electron/reference/examples/overlay | Overlay examples}
   *
   * @since 2.0.5
   */
  readonly isSharedTextureAvailable?: boolean;
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
   * Can the overlay window intercept input.
   */
  readonly canInterceptInput?: boolean;
  /**
   * Is the overlay currently in exclusive input mode.
   */
  readonly exclusiveMode?: boolean;
}


/**
 * Info about the currently running game.
 *
 * Combines general game metadata, window information, and input interception state,
 * allowing the overlay to assess readiness and manage behavior accordingly.
 *
 * @example
 * ```ts
 * const activeGameInfo = overlay.getActiveGameInfo();
 * if (activeGameInfo?.gameInfo) {
 *   console.log(`The active game is ${activeGameInfo.gameInfo.title}`);
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
 * when it enters exclusive mode, whiche prevents the game from receiving user input.
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
 */
interface IOverlayHotkeys {
  /**
   * Register a new hotkey.
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
   *   if (state === 'pressed') {
   *     toggleOverlay();
   *   }
   * });
   * ```
   */
  register(hotKey: IOverlayHotkey, callback: HotkeyCallback): void;

  /**
   * Update an existing hotkey.
   * Return `false` if hotkey doesn't exist.
   * 
   * @example
   * ```ts
   * const updatedHotkey: IOverlayHotkey = {
   *   name: 'toggleOverlay',
   *   keyCode: 192, // `
   *   modifiers: { ctrl: true, alt: true },
   *   passthrough: false
   * };
   *
   * overlay.hotkeys.update(updatedHotkey);
   * ```
   */
  update(hotKey: IOverlayHotkey): boolean;

  /**
   * Clear all hotkeys.
   */
  unregisterAll(): void;

  /**
   * Remove hotkey by name.
   * Return `false` if doesn't exits.
   * 
   * @example
   * ```ts
   * overlay.hotkeys.unregister('toggleOverlay');
   * ```
   */
  unregister(name: string): boolean;

  /**
   * Get all active hotkeys.
   */
  all(): IOverlayHotkey[];
}



/**
 * APIs for managing Overwolf overlay windows, hotkeys, input modes, and game integration.
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
 * private _overlayApi: IOverwolfOverlayApi;
 *
 * this._overlayApi.on('game-launched', (event, gameInfo) => {
 *   if (gameInfo.supported === true) {
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
   * Register games to track for overlay injection.
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
   * Requests game injection for the specified class ID (late injection).
   *
   * If the game is running, the 'game-launched' event will be emitted, and you can call `event.inject()` to inject the overlay.
   * If another game is already injected, the overlay will move to the newly injected game.
   *
   * Throws an error if the game is not running.
   *
   * @param classId - The class ID of the game to inject the overlay into.
   */
  requestGameInjection(classId: number): Promise<void>;

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
   * Enters Overlay "Exclusive Mode" to intercept user input in games where the mouse cursor is not visible.
   *
   * The `game-input-exclusive-mode-changed` event fires if exclusive mode was entered.
   *
   * NOTE: This is only supported when `getActiveGameInfo().gameInputInfo.canInterceptInput` is `false`.
   * Calling this function when unsupported will
   * be ignored and will not throw an exception.
   */
  enterExclusiveMode(options?: ExclusiveInputOptions): void;

  /**
   * Exits Overlay "Exclusive Mode", allowing user input to be sent to the game.
   *
   * This is only effective if `getActiveGameInfo().gameInputInfo.canInterceptInput` is `true`.
   *
   */
  exitExclusiveMode(): void;

  /**
   * Install ow-electron helpers to
   * `%CommonProgramFiles%\<app-name>\` with UAC elevation.
   * Allows injection into high elevation games.
   * No-ops if files are already present.
   *
   * @throws `HelperInstallError`
   *  - `exitCode 1223` — user cancelled the UAC prompt (ERROR_CANCELLED)
   *  - `err.exitCode !== 1223` — the installer process failed. Log `err.exitCode` and investigate.
   *  - any other non-zero exitCode — installation failed.
   *
   * @remarks
   * The helper binaries are installed to:
   * - `%CommonProgramFiles%\<app-name>\owe-helper-ui.exe` (x64)
   * - `%CommonProgramFiles%\<app-name>\owe-helper-ui-x86.exe` (x86)
   *
   * @example
   * ```ts
   * // Check whether the helper is already installed
   * const installed: boolean = await api.isHighElevationHelperInstalled();
   *
   * // Trigger UAC-elevated installation (shows a UAC prompt to the user)
   * try {
   *   await api.installHighElevationHelper();
   *   console.log('Helper installed successfully');
   * } catch (err: any) {
   *   if (err.exitCode === 1223) {
   *     // User cancelled the UAC prompt — not an error, just inform the user
   *     console.warn('User cancelled UAC prompt');
   *   } else {
   *     console.error('Installation failed, exitCode:', err.exitCode);
   *   }
   * }
   * ```
   *
   * @example Typical integration flow
   * ```ts
   * async function ensureElevatedInjection(api: IOverwolfOverlayApi) {
   *   const installed = await api.isHighElevationHelperInstalled();
   *   if (!installed) {
   *     await api.installHighElevationHelper(); // may throw — handle UAC cancel
   *   }
   *   // Injection into elevated games now happens automatically on game launch
   * }
   * ```
   * @returns Resolves when installation completes.
   *
   *
   *
   */
  installHighElevationHelper?(): Promise<void>;

  /**
   * Returns true if ow-electron helpers is already installed in
   * `%CommonProgramFiles%\<app-name>\`.
   *
   * @returns `true` if the helper is installed and ready.
   *
   * @example
   * ```ts
   * const installed: boolean = await api.isHighElevationHelperInstalled();
   * if (!installed) {
   *   // Prompt the user to run the one-time setup before injecting into elevated games
   * }
   * ```
   */
  isHighElevationHelperInstalled?(): Promise<boolean>;

  /**
   * Captures the current game frame and saves it to disk.
   *
   * Only one screenshot can be in progress at a time. Calling this method
   * while a previous capture is still pending will reject immediately —
   * wait for the returned promise to settle before issuing the next call.
   *
   * The output format is resolved by precedence: an explicit `format`
   * argument wins; otherwise the extension already present in `filePath`
   * (`.jpg`/`.jpeg` or `.bmp`) is used; otherwise it defaults to `'bmp'`.
   * The file extension is then normalized to match the resolved format, so
   * an existing extension is rewritten rather than doubled (e.g.
   * `shot.jpg` stays `shot.jpg`, and `shot.png` with `format: 'jpg'` becomes
   * `shot.jpg`).
   *
   * Internally all backends (D3D9, D3D11, D3D12, Vulkan) capture as BMP
   * first and transcode to JPEG on demand, ensuring correct colors across
   * all graphics APIs and formats.
   *
   * @param filePath - Absolute path (UTF-8) where the image will be saved.
   * @param format - Output image format: `'jpg'` or `'bmp'`. When omitted,
   *   the extension in `filePath` is used, falling back to `'bmp'`.
   * @returns A promise that resolves with the absolute path the file was
   *   actually written to, including the normalized extension (which may
   *   differ from `filePath`).
   *
   * @throws `'no active game'` — the overlay is not currently injected into
   *   any game. Wait for the `game-injected` event before calling.
   * @throws `'screenshot already in progress'` — a previous capture has not
   *   yet completed. Await the previous promise before calling again.
   * @throws `'no active graphics device'` — the game has no active GPU
   *   device at this moment (e.g. the game window is minimized or in a
   *   device-lost state). Try again once the game is in the foreground.
   * @throws `'capture failed: <backend>'` — the GPU-side readback failed
   *   (e.g. staging texture creation, memory map, or WIC encode error).
   *
   * @example
   * ```ts
   * overlay.on('game-injected', () => {
   *   overlay.hotkeys.register(
   *     { name: 'screenshot', keyCode: 'F9', passthrough: false },
   *     async (hotkey, state) => {
   *       if (state !== 'pressed') return;
   *       const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
   *       const filePath = path.join(app.getPath('pictures'), `screenshot_${ts}`);
   *       try {
   *         const savedPath = await overlay.takeScreenshot(filePath, 'jpg');
   *         console.log('screenshot written to', savedPath); // ...filePath.jpg
   *       } catch (err) {
   *         console.error('Screenshot failed:', err.message);
   *       }
   *     }
   *   );
   * });
   * ```
   */
  takeScreenshot(filePath: string, format?: 'jpg' | 'bmp'): Promise<void>;

  /**
   * Records a Windows per-executable GPU preference for this application, so
   * Chromium's GPU process runs on the same adapter as games do.
   *
   * The shared-texture path requires that: a shared GPU texture handle can only be opened on
   * the adapter that created it, and Chromium takes the adapter driving the **primary
   * display** while games run on the discrete GPU. When those differ the overlay falls back
   * to the CPU copy path and emits `shared-texture-unavailable`.
   *
   * **An application restart is normally required.** DXGI reads this preference when a
   * process creates its D3D device, which Chromium's GPU process has already done by the time
   * this API is reachable. Call {@link IOverwolfOverlayApi.getGpuPreference} to learn whether
   * the application is *already* aligned and therefore needs no restart; this method is
   * idempotent, so calling it unconditionally is safe.
   *
   * **Side effects &mdash; read before calling.** It moves the **entire application's**
   * rendering to that GPU, draining laptop battery and keeping the discrete GPU awake; it is
   * persistent, user-visible Windows state under
   * Settings &rarr; System &rarr; Display &rarr; Graphics; and it is keyed on the executable
   * path, so moving or renaming the application leaves a stale entry behind. It is therefore
   * **never applied implicitly**. Pass `'default'` to remove the entry, the recommended
   * revert on uninstall or when the user turns the overlay off.
   *
   * @param preference - `'highPerformance'` to pin this application to the high-performance
   *   adapter, or `'default'` to remove the entry and let Windows decide.
   * @returns A promise that resolves once the preference has been recorded.
   * @throws If the registry cannot be written, or on a non-Windows platform.
   * @see {@link GpuPreference}.
   * @see {@link https://dev.overwolf.com/ow-electron/reference/examples/overlay | Overlay examples}
   *
   * @example
   * ```ts
   * overlay.on('shared-texture-unavailable', async (reason) => {
   *   if (reason !== 'gpuAdapterMismatch') return;
   *   if ((await overlay.getGpuPreference()) === 'highPerformance') return;
   *   await overlay.setGpuPreference('highPerformance');
   *   promptUserToRestart(); // takes effect on the next launch
   * });
   * ```
   *
   * @since 2.0.5
   */
  setGpuPreference(preference: GpuPreference): Promise<void>;

  /**
   * Returns the GPU preference currently recorded for this application's executable.
   *
   * Resolves to `'default'` when no entry exists &mdash; "no entry" and "let Windows decide"
   * are the same state, so this never resolves `undefined`.
   *
   * @returns A promise resolving to the recorded preference.
   * @throws On a non-Windows platform.
   * @see {@link IOverwolfOverlayApi.setGpuPreference}.
   * @see {@link GpuPreference}.
   *
   * @since 2.0.5
   */
  getGpuPreference(): Promise<GpuPreference>;

  /**
   * Fires when an internal error occurs within the overlay system.
   */
  on(eventName: 'error', listener: (...args: any[]) => void): this;

  /**
   * Fires when a registered game is launched.
   * Call `event.inject()` to enable the overlay for the game.
   *
   * @param eventName - The event identifier for when a game is launched.
   * @param listener - Callback with game launch event and game metadata.
   * @see {@link GameInfo}.
   */
  on(
    eventName: 'game-launched',
    listener: (event: GameLaunchEvent, gameInfo: GameInfo) => void,
  ): this;

  /**
   * Fires when a registered game process terminates.
   *
   * Useful for performing cleanup, UI updates, or closing overlay windows.
   *
   * @param eventName - The event identifier for when the game exits.
   * @param listener - A callback function that receives the game info of the exited game.
   *
   * @example
   * ```ts
   * overlay.on('game-exit', (gameInfo, wasInjected) => {
   *   console.log(`Game exited: ${gameInfo.title} and ${wasInjected ? 'was injected' : 'was not injected'}`);
   *   closeOverlayWindows();
   * });
   * ```
   *
   * @see {@link GameInfo}.
   */
  on(
    eventName: 'game-exit',
    listener: (gameInfo: GameInfo, wasInjected: boolean) => void,
  ): this;

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
    listener: (gameInfo: GameInfo, error: string, ...args: any[]) => void,
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
      focus: boolean,
    ) => void,
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
      reason?: GameWindowUpdateReason,
    ) => void,
  ): this;

  /**
   * Fires when the injected game's window is destroyed, which on many games
   * happens seconds before the process exits. `game-exit` still follows and
   * remains the authoritative end-of-session event.
   *
   * Not emitted for OOPO games.
   *
   * @param eventName - `game-window-destroyed`
   * @param listener - Callback with the game info of the destroyed window.
   * @see {@link GameInfo}.
   */
  on(
    eventName: 'game-window-destroyed',
    listener: (gameInfo: GameInfo) => void,
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
    listener: (info: GameInputInterception) => void,
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
    listener: (info: GameInputInterception) => void,
  ): this;

  /**
   * Fires when the shared-texture rendering path cannot be used with the current game, with
   * the reason:
   *
   * - `unsupportedGraphicsApi`&mdash;the game's graphics API cannot composite GPU textures
   *   (D3D9 / OpenGL / Vulkan). Nothing to fix.
   * - `gpuAdapterMismatch`&mdash;the game renders on a **different GPU adapter than
   *   Chromium**; a shared texture handle can only be opened on the adapter that created it.
   *   Fixable with {@link IOverwolfOverlayApi.setGpuPreference} and a restart; both adapters
   *   are named in the overlay log.
   * - `copyFailure`&mdash;the game **repeatedly failed to open the shared texture handles it
   *   received in-game**. The overlay retried, then abandoned the path for this game.
   *   {@link IOverwolfOverlayApi.setGpuPreference} may help when the root cause is
   *   adapter-related; details are in the overlay log.
   * - `handleTransportBlocked`&mdash;the GPU textures **could not be handed to the game
   *   process at all**. Nothing the application can do.
   *
   * Fires at most **once per injected game**. The first two reasons are detected when the
   * game's graphics are detected, before any frame is sent; `copyFailure` and
   * `handleTransportBlocked` are reached only after frames were sent and repeatedly failed to
   * arrive or draw. Either way, the affected overlay windows have already been switched to the
   * CPU copy path by the time the event fires, so they stay visible and interactive, and
   * {@link GameWindowInfo.isSharedTextureAvailable} reports `false` for the game.
   *
   * @param eventName - `shared-texture-unavailable`
   * @param listener - Callback invoked once for the current game with the reason.
   *
   * @see {@link https://dev.overwolf.com/ow-electron/reference/examples/overlay | Overlay examples}
   *
   * @example
   * ```ts
   * overlay.on('shared-texture-unavailable', async (reason) => {
   *   if (reason !== 'gpuAdapterMismatch') return;
   *   if ((await overlay.getGpuPreference()) === 'highPerformance') return;
   *   await overlay.setGpuPreference('highPerformance');
   *   promptUserToRestart();
   * });
   * ```
   *
   * @since 2.0.5
   */
  on(
    eventName: 'shared-texture-unavailable',
    listener: (reason: SharedTextureUnavailableReason) => void,
  ): this;
}
