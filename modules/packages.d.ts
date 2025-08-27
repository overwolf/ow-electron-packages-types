// -----------------------------------------------------------------------------
//
/**
 * Provides access to all available Overwolf APIs bundled in the Electron Overwolf Packages management.
 *
 * This interface extends `overwolf.packages.OverwolfPackageManager` and consolidates
 * access to key subsystems such as:
 * - `recorder`&mdash;video capture and replay features
 * - `overlay`&mdash;in-game overlay window management and hotkeys
 * - `utility`&mdash;game tracking and scanning utilities
 * - `crn`&mdash;crash report and notification system
 *
 * It acts as a unified entry point for interacting with Overwolf's capabilities within a packaged app.
 * @packageDocumentation
 * @example
 * ```ts
 * const app = overwolf.packages as OWPackages;
 *
 * // Start tracking game launch/exit events
 * app.utility.trackGames({ includeUnsupported: true });
 *
 * // Register for game launch
 * app.utility.on('game-launched', (gameInfo) => {
 *   console.log('Game launched:', gameInfo.name);
 * });
 *
 * // Start recording
 * await app.recorder.startRecording({
 *   filePath: 'C:/Videos/gameplay',
 *   audioTrack: 1
 * });
 * ```
 */
interface OWPackages extends overwolf.packages.OverwolfPackageManager {
  /**
   * Access to Overwolf's video recording and replay functionality.
   */
  recorder: IOverwolfRecordingApi;

  /**
   * Access to overlay-related APIs such as window creation, input control, and hotkeys.
   */
  overlay: IOverwolfOverlayApi;

  /**
   * Access to utility APIs for game launch tracking and game scanning.
   */
  utility: IOverwolfUtilityApi;

  /**
   * Access to crash reporting and notification APIs.
   */
  crn: IOverwolfCRNApi;
}
