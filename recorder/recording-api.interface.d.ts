import { GamesFilter, GameInfo } from '../common';
import {
  ActiveReplay,
  CaptureReplayOptions,
  CaptureSettings,
  CaptureSettingsBuilder,
  CaptureSettingsOptions,
  RecorderStats,
  RecordingAppOptions,
  RecordingInformation,
  RecordingOptions,
  ReplayCallback,
  ReplayOptions,
  ReplayStopCallback,
  SplitCallback,
  StartCallback,
  StopCallback,
} from './recording-api.types';

export interface IOverwolfRecordingApi {
  /**
   * Set Global options (For Debugging)
   */
  options: RecordingAppOptions;

  /**
   * Is recording or replays active
   */
  isActive(): Promise<boolean>;

  /**
   * Query System information.
   *
   * (Supported encoder, available audio\video devices, available setting with descriptions)
   */
  queryInformation(): Promise<RecordingInformation>;

  /**
   * Setting builder class, helps to create CaptureSettings object
   * @param options
   */
  createSettingsBuilder(
    options?: CaptureSettingsOptions
  ): Promise<CaptureSettingsBuilder>;

  /**
   * Starts video recording.
   *
   * A 'recording-started' event is triggered when recording starts.
   * Note: If recording fails to start, an exception (RecorderError) will be thrown.
   *
   * when the recording stopped to due error or game-exit, or stopRecording() call,
   * 'recording-stopped' event is trigged with the details.
   *
   * @param options - The options for the recording.
   * @param setting - Optional. Capture settings if the replay service is already running.
   * @param listener - Optional. Callback for handling recording stopped event (same as 'recording-stopped' event) .
   * @returns A promise that resolves when recording has started.
   */
  startRecording(
    options: RecordingOptions,
    setting?: CaptureSettings,
    listener?: StopCallback
  ): Promise<void>;

  /**
   * Stop active recording
   * @param listener Optional. Callback for handling recording stopped event (same as 'recording-stopped' event). this will override the listener set in the startRecording (if was set).
   */
  stopRecording(listener?: StopCallback): Promise<void>;

  /**
   * Split active recording video (if split option was enabled at 'RecordingOptions').
   * 'recording-split' is fired once the video split.
   *
   *  ```
   *  try {
   *    await splitRecording(...);
   *  } catch(err) {
   *    if (error instanceof RecorderError) {... }
   *  }
   *
   * ```
   * @param listener (optional) callback when video split.
   */
  splitRecording(listener?: SplitCallback): Promise<void>;

  /**
   * Starts replay's recording.
   *
   * A 'replays-started' event is triggered when recording starts.
   *
   * Note: If recording fails to start, an exception (RecorderError) will be thrown.
   * ```
   *  try {
   *    await startReplays(...);
   *  } catch(err) {
   *    if (error instanceof RecorderError) {... }
   *  }
   *
   * ```
   * @param options - The options for the replays.
   * @param setting - Optional. Capture settings if the replay service is already running.
   * @returns A promise that resolves when recording has started.
   */
  startReplays(
    options: ReplayOptions,
    setting?: CaptureSettings
  ): Promise<void>;

  /**
   * Stop Replays service
   *
   * A 'replays-stopped' event is triggered when replays service stopped .
   *
   * Note: an exception (RecorderError) will be thrown, if the stop command fails
   *
   *    * ```
   *  try {
   *    await stopReplays(...);
   *  } catch(err) {
   *    if (error instanceof RecorderError) {... }
   *  }
   *
   * ```
   *
   * (for example, replay's service is not active)
   */
  stopReplays(): Promise<void>;

  /**
   * Capture Replay.
   * 'ActiveReplay' object to control replay (stop and such...)
   * Note: an exception (RecorderError) will be thrown, if the stop command fails
   * @param option
   * @param callback (optional) called when replay is ready in addition to 'replay-ready' event.
   */
  captureReplay(
    option: CaptureReplayOptions,
    callback?: ReplayCallback
  ): Promise<ActiveReplay>;

  /**
   * Game launch registration
   * register to track running game, witch triggers 'game-launched' and 'game-exit' events.
   */
  registerGames(filter: GamesFilter);

  /**
   * Fired when registered game is detected
   */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Fired on registered game process terminated.
   */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;

  /**
   * Fired on video recording started
   */
  on(eventName: 'recording-started', listener: StartCallback): this;

  /**
   * Fired on video recording stopped
   */
  on(eventName: 'recording-stopped', listener: StopCallback): this;

  /**
   * Fired on recording video split (manual/size/time)
   */
  on(eventName: 'recording-split', listener: SplitCallback): this;

  /**
   * Fired on replays record started
   */
  on(eventName: 'replays-started', listener: StartCallback): this;

  /**
   * Fired on replays record stopped
   */
  on(eventName: 'replays-stopped', listener: ReplayStopCallback): this;

  /**
   * Fired on replay video was captured
   */
  on(eventName: 'replay-captured', listener: ReplayCallback): this;

  /**
   * Fired every |statsIntervalMS| (RecordingAppOptions) interval
   * @param eventName
   * @param listener
   */
  on(eventName: 'stats', listener: (args: RecorderStats) => void): this;
}
