/**
 * @packageDocumentation
 *
 * This module provides utility methods for tracking and managing game-related events
 * such as game launch, exit, and scanning for installed games. It is used to enable 
 * event-driven behavior based on a user's game activity.
 *
 * @example
 * ```ts
 * const utility: IOverwolfUtilityApi = new OverwolfUtility();
 *
 * utility.trackGames({ includeUnsupported: true });
 *
 * utility.on('game-launched', (gameInfo) => {
 *   console.log('Game launched:', gameInfo.name);
 * });
 *
 * utility.on('game-exit', (gameInfo) => {
 *   console.log('Game exited:', gameInfo.name);
 * });
 *
 * const installedGames = await utility.scan();
 * console.log('Installed games:', installedGames);
 * ```
 */

/**
 * Reason `canInjectElevated()` reports {@link ElevatedInjectionCapability.supported} as `false`.
 */
type ElevatedInjectionUnsupportedReason =
  /**
   * `owe-helper-ui.exe` / `owe-helper-ui-x86.exe` are not installed yet in
   * `%CommonProgramFiles%\<app-name>\`. Call `installHighElevationHelper()` to fix this.
   */
  | 'helper-not-installed'
  /**
   * The account running the app is a standard (non-administrator) user. A
   * uiAccess helper launched from such an account only gets a MEDIUM+16
   * integrity token, and Windows will not map a hook dll into a HIGH
   * integrity (elevated) game.
   *
   * Call `installElevationBroker()` to inject anyway; without it the game has
   * to run un-elevated, or the account needs administrator rights.
   */
  | 'account-cannot-elevate';

/**
 * Reports whether an elevated (HIGH integrity) game can actually be injected
 * under the account the app is running as.
 *
 * @example
 * ```ts
 * const capability = await api.canInjectElevated();
 * if (!capability.supported) {
 *   console.warn('Cannot inject elevated games:', capability.reason);
 * }
 * ```
 */
interface ElevatedInjectionCapability {
  /**
   * `true` only when an elevated game can actually be injected right now.
   */
  readonly supported: boolean;

  /**
   * Set when {@link supported} is `false`.
   */
  readonly reason?: ElevatedInjectionUnsupportedReason;

  /**
   * `true` when the account can obtain a HIGH integrity token
   * (administrator). When the check itself cannot run this is reported as
   * `true`, so an undetermined account is attempted rather than blocked.
   */
  readonly accountCanElevate: boolean;

  /**
   * `true` when the uiAccess helper binaries are installed.
   */
  readonly helperInstalled: boolean;

  /**
   * `true` when the LocalSystem broker service is registered. It makes
   * elevated injection possible regardless of {@link accountCanElevate}.
   */
  readonly brokerInstalled: boolean;
}

/**
 * Defines the API for managing game launch and utility operations.
 */
interface IOverwolfUtilityApi {
  /**
   * Register games you want to track.
   *
   * Once a game that matches the filter is launched or exited, the appropriate
   * event listeners will be triggered.
   *
   * @param filter - Configuration specifying which games to register and whether to include unsupported titles.
   */
  trackGames(filter: GamesFilter): Promise<void>;

  /**
   * Scans the system for installed games that match the provided filter.
   *
   * If a game is installed on multiple platforms (e.g. both Steam and Epic Games),
   * each installation is returned as a separate `InstalledGameInfo` entry.
   *
   * @param filter - Optional. Configuration specifying which games to include in the scan.
   * @returns A promise that resolves to an array of `InstalledGameInfo` objects representing the installed games.
   */
  scan(filter?: GamesFilter): Promise<InstalledGameInfo[]>;

   /**
   * Install ow-electron helpers to
   * `%CommonProgramFiles%\<app-name>\` with UAC elevation.
   * Allows injection into high elevation games.
   * No-ops if files are already present.
   *
   * @throws `HelperInstallError` `exitCode 1223` — user cancelled the UAC prompt (ERROR_CANCELLED)
   * @throws `HelperInstallError` `err.exitCode !== 1223` — the installer process failed. Log `err.exitCode` and investigate.
   * @throws `HelperInstallError` any other non-zero exitCode — installation failed.
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
   * async function ensureElevatedInjection(api: IOverwolfUtilityApi) {
   *   const installed = await api.isHighElevationHelperInstalled();
   *   if (!installed) {
   *     await api.installHighElevationHelper(); // may throw — handle UAC cancel
   *   }
   *   // Injection into elevated games now happens automatically on game launch
   * }
   * ```
   * @returns Resolves when installation completes.
   */
  installHighElevationHelper?(): Promise<void>;

   /**
   * Returns true if ow-electron helpers is already installed in
   * `%CommonProgramFiles%\<app-name>\`.
   *
   * @returns `true` if the helper is installed and ready.
   *
   * @remarks
   * This only reports whether the binaries are present. On a standard
   * (non-administrator) account they can be present and elevated injection
   * still won't work — use `canInjectElevated()` to decide what to tell the
   * user.
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
   * Whether an elevated (HIGH integrity) game can actually be injected under
   * the account this app is running as.
   *
   * @returns An {@link ElevatedInjectionCapability} describing what's
   * missing when elevated injection isn't currently possible.
   *
   * @remarks
   * `supported` is `false` with reason `'account-cannot-elevate'` on a
   * standard user account: Windows gives a uiAccess helper launched from such
   * an account a MEDIUM+16 integrity token, which cannot get a dll mapped
   * into an elevated game. The only workarounds are running the game
   * un-elevated, granting the account administrator rights, or installing the
   * elevation broker via `installElevationBroker()`.
   *
   * @example
   * ```ts
   * const capability = await api.canInjectElevated();
   * if (!capability.supported) {
   *   console.warn('Cannot inject elevated games:', capability.reason);
   * }
   * ```
   */
  canInjectElevated?(): Promise<ElevatedInjectionCapability>;

  /**
   * Installs the elevated injection broker: a LocalSystem service that
   * injects into elevated games for accounts that cannot reach HIGH
   * integrity, which is the only way an app running under a standard user
   * account can overlay an elevated game. Prompts for UAC once.
   *
   * @throws `HelperInstallError` `exitCode 1223` — user cancelled the UAC prompt (ERROR_CANCELLED)
   * @throws `HelperInstallError` any other non-zero exitCode — installation failed
   *
   * @remarks
   * The service stays registered until `uninstallElevationBroker()` removes
   * it, so the app's uninstaller must call that.
   *
   * @returns Resolves when installation completes.
   */
  installElevationBroker?(): Promise<void>;

  /**
   * Stops and removes the elevation broker service. Prompts for UAC once.
   * Succeeds when the service is already absent.
   *
   * @returns Resolves when removal completes.
   */
  uninstallElevationBroker?(): Promise<void>;

  /**
   * Fires when a tracked game is launched.
   *
   * @param eventName - The name of the event ('game-launched').
   * @param listener - A callback that receives the `GameInfo` of the launched game.
   * @returns The current instance for method chaining.
   */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Fires when a tracked game is exited.
   *
   * @param eventName - The name of the event ('game-exit').
   * @param listener - A callback that receives the `GameInfo` of the exited game.
   * @returns The current instance for method chaining.
   */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;
}
