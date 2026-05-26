/**
 * The *Game Events Provider* (GEP) APIs allow your app to subscribe to real-time in-game events and info updates
 * from supported games. GEP detects when a supported game launches, tracks gameplay state, and emits structured
 * events your app can react to.
 *
 * ## Game detection
 * When a supported game is detected, the `game-detected` event fires. Call `event.enable()` inside the listener
 * to activate GEP for that game. If the game is running with elevated privileges, the
 * `elevated-privileges-required` event fires instead — your app must also run as administrator for events to be
 * captured.
 *
 * ## Features and info updates
 * Before events flow, call `setRequiredFeatures` with the feature names your app needs. GEP will only emit
 * `new-info-update` and `new-game-event` events for features you have registered. Use `getFeatures` to query
 * which features a game supports, and `getInfo` to read the current game state at any point.
 *
 * ## Supported events
 * - `new-game-event` — a discrete in-game event (kill, death, match start, etc.)
 * - `new-info-update` — a change to a persistent game info value (health, score, map, etc.)
 * - `game-detected` — a supported game process was found; call `event.enable()` to start GEP
 * - `game-exit` — the tracked game process has exited
 * - `elevated-privileges-required` — the game is running as administrator
 * - `error` — an internal GEP error occurred
 *
 * @packageDocumentation
 */

// -----------------------------------------------------------------------------
// ow-electron packages
    /**
     * Game Events game detection Event.
     *
     * Passed to the `game-detected` listener — call `enable()` on this object to activate Game Events for the detected game.
     */
    export interface GepGameLaunchEvent {
      enable: () => void;
    }

    /**
     * Game Events Package interface.
     *
     * Provides methods to query supported games and features, configure the required features for a game, and subscribe to game event and info update streams.
     */
    interface OverwolfGameEventPackage extends NodeJS.EventEmitter {
      /**
       * Returns an array of supported Game Event Features for a game.
       *
       * @param gameId - Game ID of the targeted game.
       * @returns Promise resolving to an array of supported game features.
       */
      getFeatures(gameId: number): Promise<string[]>;

      /**
       * Sets the requires Game Event Features for a given game ID.
       *
       * @param gameId - Game ID of the targeted game.
       * @param features - Array of required Game Event Features.
       * @returns Promise reporting the success of the operation.
       */
      setRequiredFeatures(
        gameId: number,
        features: string[] | undefined
      ): Promise<void>;

      /**
       * Returns an array of Game Events supported games.
       *
       * @returns Promise resolving to an array of supported games.
       */
      getSupportedGames(): Promise<{
        name: string;
        id: number;
      }[]>;

      /**
       * Returns the target game's current Game Info.
       *
       * @param gameId - Game ID of the targeted game.
       * @returns Promise resolving to the targeted game's current Game Info.
       */
      getInfo(gameId: number): Promise<any>;

      /**
       * Register listener for Game Info Updates.
       *
       * @param eventName - Name of the node event ('new-info-update').
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: 'new-info-update',
        listener: (event: Event, gameId: number, data: gep.InfoUpdate) => void
      ): this;

      /**
       * Register listener for New Game Events.
       *
       * @param eventName - Name of the node event ('new-game-event').
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: 'new-game-event',
        listener: (event: Event, gameId: number, data: gep.GameEvent) => void,
      ): this;

      /**
       * Register listener for a game being detected.
       * Calling `event.enable()` to start gep for this game.
       *
       * @param eventName - Name of the node event ('game-detected').
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: 'game-detected',
        listener: (event: GepGameLaunchEvent, gameId: number, name: string, ...args: any[]) => void,
      ): this;

      /**
       * Register listener for a game exit event.
       *
       * @param eventName - Name of the node event ('game-exit').
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: 'game-exit',
        listener: (event: Event, gameId: number, gameName: string, pid: number, processName: string, processPath: string, commandLine: string) => void,
      ): this;

      /**
       * Register listener for when a detected game is ran as administrator.
       * If this fires, it means the app must also run as administrator in order for Game Events to be detected.
       *
       * @param eventName - Name of the node event ('elevated-privileges-required').
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: 'elevated-privileges-required',
        listener: (event: Event, gameId: number, name: string, pid: number) => void,
      ): this;

      /**
       * Register listener for errors thrown by the Game Events Provider Package.
       *
       * @param eventName - Name of the node event ('error' or the `errorMonitor` symbol).
       * @param listener - The listener that will be invoked when this event is fired.
       * @returns The current instance of the Overwolf Game Events Package.
       */
      on(
        eventName: error,
        listener: (event: Event, gameId: number, error: string, ...args: any[]) => void,
      ): this;
    }

    /**
     * Namespace for GEP-related interfaces.
     *
     * Contains the shared data types used to type the payloads received in `new-game-event` and `new-info-update` listeners.
     */
     namespace gep {
      /**
       * Interface defining a Game Event's structure.
       *
       * Received as the `data` argument in a `new-game-event` listener, representing a single discrete in-game occurrence.
       */
      interface GameEvent {
        /**
         * The game id of the game the Event comes from.
         */
        gameId: number;
        /**
         * The feature the Event belongs to.
         */
        feature: string;
        /**
         * The name of the Event.
         */
        key: string;
        /**
         * The value of the Event.
         */
        value: any;
      }

      /**
       * Interface defining an Info Update's structure.
       *
       * Extends `GameEvent` with a `category` field and is received as the `data` argument in a `new-info-update` listener, representing a change to a persistent game state value.
       */
      interface InfoUpdate extends GameEvent {
        /**
         * The category the Info Item belongs to.
         */
        category: string;
      }
    }