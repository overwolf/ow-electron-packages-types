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
   * Begins tracking game launch and exit events based on a given filter.
   * Once a game that matches the filter is launched or exited, the appropriate
   * event listeners will be triggered.
   *
   * @param filter - Criteria used to determine which games to track.
   */
  trackGames(filter: GamesFilter): Promise<void>;

  /**
   * Scans the system for installed games that match the provided filter.
   *
   * @param filter - Optional. A filter to narrow down the list of installed games.
   * @returns A promise that resolves to a list of installed game information.
   */
  scan(filter?: GamesFilter): Promise<InstalledGameInfo[]>;

  /**
   * Registers an event listener that triggers when a tracked game is launched.
   *
   * @param eventName - The name of the event ('game-launched').
   * @param listener - A callback that receives the `GameInfo` of the launched game.
   * @returns The current instance for method chaining.
   */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Registers an event listener that triggers when a tracked game is exited.
   *
   * @param eventName - The name of the event ('game-exit').
   * @param listener - A callback that receives the `GameInfo` of the exited game.
   * @returns The current instance for method chaining.
   */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;
}
