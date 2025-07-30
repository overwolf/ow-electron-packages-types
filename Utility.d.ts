

/**
 * @owpackage Utility
 */
interface IOverwolfUtilityApi {
  /**
   * Game launch/exit registration
   */
  trackGames(filter: GamesFilter): Promise<void>;

  /**
   * Scan for installed games
  */
  scan(filter?: GamesFilter): Promise<InstalledGameInfo[]>;

  /**
   *
   */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

  /**
   *
   */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;
}