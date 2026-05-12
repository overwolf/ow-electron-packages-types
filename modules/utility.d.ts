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
   * @param filter - Optional. Configuration specifying which games to include in the scan.
   * @returns A promise that resolves to an array of `InstalledGameInfo` objects representing the installed games.
   */
  scan(filter?: GamesFilter): Promise<InstalledGameInfo[]>;

   /**
   * install ow-electron helpers to
   * %CommonProgramFiles%\<app-name>\ with UAC elevation.
   * will allow us to inject into high elevation games
   * No-ops if files are already present.
   * @throws {HelperInstallError} exitCode 1223 — user cancelled the UAC prompt (ERROR_CANCELLED)
   * @throws {HelperInstallError} any other non-zero exitCode — installation failed
   */
  installHighElevationHelper?(): Promise<void>;

  /**
   * Returns true if ow-electron helpers is already installed in
   * %CommonProgramFiles%\<app-name>\.
   */
  isHighElevationHelperInstalled?(): Promise<boolean>;

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
