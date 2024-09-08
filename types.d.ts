import { overwolf } from '@overwolf/ow-electron';
import {
BrowserWindow,
BrowserWindowConstructorOptions,
Size,
WebContents,
} from 'electron';

import { EventEmitter } from 'events';

// -----------------------------------------------------------------------------
// ow-electron packages
type GameProcessInfo = {
  pid?: number;

  fullPath: string;

  commandLine?: string;

  is32Bit?: boolean;

  isElevated?: boolean;
};

// -----------------------------------------------------------------------------
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
type GameInfoType = 'Game' | 'Launcher' | undefined;
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
interface GamesFilter {
  all?: boolean;

  includeUnsupported?: boolean;

  gamesIds: number[];
}

// -----------------------------------------------------------------------------
interface OWPackages extends overwolf.packages.OverwolfPackageManager {
  recorder: IOverwolfRecordingApi;
  overlay: IOverwolfOverlayApi;
  utility: IOverwolfUtilityApi;
}

/**
 * Input pass through
 *
 * 'noPassThrough':  Window will handle input and block from game (Default)
 * 'PassThrough':  window will not handle any input
 * 'passThroughAndNotify': Window will handle input and also pass it to the game.
 */
type PassthroughType = "noPassThrough" | "passThrough" | "passThroughAndNotify";

/**
 * Overlay rendering Z-Order
 */
type ZOrderType = "default" | "topMost" | "bottomMost";

/** Overlay ow-electron options */
interface OverlayOptions {
  passthrough?: PassthroughType;

  zOrder?: ZOrderType;
}

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
}

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

interface GameLaunchEvent {
  inject: () => void;
}

/**
 * TBD
 */
interface OverlayBrowserWindow {
  window: BrowserWindow;

  readonly overlayOptions: OverlayOptions;

  readonly name: string;

  readonly id: number;
}

interface InjectionError {
  error: string;
}

interface GameWindowInfo {
  size: Size;
  nativeHandle: number;
  focused: boolean;
  graphics: 'd3d9' | 'd3d12' | 'd3d11' | string | undefined;
}

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

interface ActiveGameInfo {
  readonly gameInfo: GameInfo;
  readonly gameWindowInfo: GameWindowInfo;
  readonly gameInputInfo: GameInputInterception;
}

type GameWindowUpdateReason = undefined | 'resized' | 'focus';
type HotkeyState = 'pressed' | 'released';

type HotkeyCallback = (
  hotKey: IOverlayHotkey,
  state: HotkeyState
) => void;

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

type Rect = { top: number; left: number; width: number; height: number };

type AudioDeviceType = 'input' | 'output';

type kSupportedEncodersTypes =
  | 'ffmpeg_svt_av1'
  | 'ffmpeg_aom_av1'
  | 'jim_nvenc'
  | 'jim_hevc_nvenc'
  | 'jim_av1_nvenc'
  | 'obs_x264'
  | 'h264_texture_amf'
  | 'h265_texture_amf'
  | 'av1_texture_amf'
  | 'obs_qsv11_v2'
  | 'obs_qsv11_hevc'
  | 'obs_qsv11_av1';

type kKnownAudioEncodersTypes =
  | 'ffmpeg_aac'
  | 'ffmpeg_opus'
  | 'ffmpeg_pcm_s16le'
  | 'ffmpeg_pcm_s24le'
  | 'ffmpeg_pcm_f32le'
  | 'ffmpeg_alac'
  | 'ffmpeg_flac'
  | string;

// Sample Rate
type kSampleRate48kHz = 48000;
type kSampleRate441kHz = 44100;
type kSpeakerLayout =
  | 'SPEAKERS_MONO'
  | 'SPEAKERS_STEREO'
  | 'SPEAKERS_2POINT1'
  | 'SPEAKERS_4POINT0'
  | 'SPEAKERS_4POINT1'
  | 'SPEAKERS_5POINT1'
  | 'SPEAKERS_7POINT1';

declare class Colors {
  public static readonly Red = 'Red';
}

/**
 * None = 0
 * Track1 = 1
 * Track2 = 2
 * Track3 = 4
 * Track4 = 8
 * Track5 = 16
 * Track6 = 32
 * All = 0xff
 */
type AudioTracks =  0 | 1 | 2 | 4 | 8 | 16 | 32 | 0xff | number;

type DisplayCaptureType = "Auto" | "DXGI" | "BitBlt" | "WGC";

type CaptureSourceType = 'Display' | 'Game' | 'Window';

interface AudioDevice {
  readonly type: AudioDeviceType;
  readonly id: string;
  readonly name: string;
  readonly isDefault: boolean;
}

interface EncoderInfoBase {
  readonly codec: string;
  readonly name: string;
}

interface EncoderProperty {
  readonly default: any;
  readonly description: string;
  readonly values?: Record<string | number, string>;
}

interface AudioEncoderInfo extends EncoderInfoBase {
  readonly type: kKnownAudioEncodersTypes;
}

interface VideoEncoderInfo extends EncoderInfoBase {
  readonly type: kSupportedEncodersTypes;
  readonly properties?: Record<string, EncoderProperty>;
}

interface AdapterInfo {
  readonly index: 0;
  readonly name: string;
  readonly driver: string;
  readonly hagsEnabled: boolean;
  readonly hagsEnabledByDefault: boolean;
}

interface AudioInformation {
  readonly inputDevices: AudioDevice[];
  readonly outputDevices: AudioDevice[];
  readonly encoders: AudioEncoderInfo[];

  readonly defaultEncoder: kKnownAudioEncodersTypes;
}

interface MonitorInfo {
  readonly adapterIndex: number;
  readonly id: string;
  readonly altId: string;
  readonly dpi: number;
  readonly attachedToDesktop: boolean;
  readonly friendlyName: string;
  readonly refreshRate: number;
  readonly rect: Rect;
  readonly isPrimary: boolean;
  readonly displayIndex: number;
}

interface VideoInformation {
  readonly encoders: VideoEncoderInfo[];
  readonly adapters: AdapterInfo[];

  readonly defaultEncoder: kSupportedEncodersTypes;
}

interface RecordingInformation {
  audio: AudioInformation;
  video: VideoInformation;
  monitors: MonitorInfo[];
}

// Video settings
type kFileFormat =
  | 'fragmented_mp4'
  | 'fragmented_mov'
  | 'mp4'
  | 'flv'
  | 'mkv'
  | 'mov'
  | 'mpegts'
  | 'hls';

type kVideoColorFormat =
  | 'NV12'
  | 'I420'
  | 'I444'
  | 'P010'
  | 'I010'
  | 'P216'
  | 'P416'
  | 'BGRA';

type kVideoColorSpec =
  | 'sRGB'
  | '709'
  | '601'
  | '2100PQ'
  | '2100HLG';

type kVideoColorRange = 'Partial' | 'Full';

// encoder AMD
type kAMDEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'VBR_LAT'
  | 'QVBR'
  | 'HQVBR'
  | 'HQCBR';

type kAMDEncoderPreset = 'quality' | 'balanced' | 'speed';
type kAMDEncoderPresetAV1 = kAMDEncoderPreset | 'highQuality';
type kAMDEncoderProfileAV1 = 'main';
type kAMDEncoderProfile264 =
  | kAMDEncoderProfileAV1
  | 'high'
  | 'baseline';

// encoder NVENC
type kNVENCEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'Lossless';
type kNVENCEncoderMultipass = 'qres' | 'fullres' | 'disabled';
type kNVENCEncoderTuning = 'hq' | 'll' | 'ull';
type kNVENCEncoderProfile = 'main';
type kNVENCEncoderProfile264 =
  | kNVENCEncoderProfile
  | 'high'
  | 'baseline';
type kNVENCEncoderProfileHEVC = kNVENCEncoderProfile | 'main10';

// encoder X264
type kX264EncoderRateControl = 'CBR' | 'ABR' | 'VBR' | 'CRF';

type kX264EncoderProfile = '' | 'baseline' | 'main' | 'high';
type kX264EncoderTune =
  | ''
  | 'film'
  | 'animation'
  | 'grain'
  | 'stillimage'
  | 'psnr'
  | 'ssim'
  | 'fastdecode'
  | 'zerolatency';

type kX264EncoderPreset =
  | 'ultrafast'
  | 'superfast'
  | 'veryfast' // default
  | 'faster'
  | 'fast'
  | 'medium'
  | 'slow'
  | 'slower'
  | 'veryslow'
  | 'placebo';

// QuickSync

type kQuickSyncEncoderProfileHEVC = kNVENCEncoderProfileHEVC;
type kQuickSyncEncoderProfile264 = kNVENCEncoderProfile264;
type kQuickSyncTargetUsage =
  | 'TU1' // Slowest (Best Quality)
  | 'TU2' // Slower
  | 'TU3' // Slow
  | 'TU4' // Balanced (Medium Quality)
  | 'TU5' // Fast
  | 'TU6' // Faster
  | 'TU7'; // Fastest (Best Speed)

type kQuickSyncEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'ICQ';

type VideoRecordingSplitType = 'byTime' | 'bySize' | 'manual';

interface VideoSettings {
  /*
   Base width resolution. Default Half HD (main monitor ratio)
  */
  baseWidth: number;

  /*
   Base height resolution. Default Half HD (main monitor ratio)
  */
  baseHeight: number;

  /**
   * Video FPS.
   *
   * Default is 30.
   */
  fps?: number;

  /**
   * Output (scaled) resolution. Default is same as baseWidth
   */
  outputWidth?: number;

  /**
   * Output (scaled) resolution. Default is same as baseHeight
   */
  outputHeight?: number;

  /** Default is 'NV12' */
  colorFormat?: kVideoColorFormat;

  /**
   * Default is '709'
   */
  colorRange?: kVideoColorRange;

  /**
   * Default is Partial
   */
  colorSpec?: kVideoColorSpec;

  /**
   * Default is 300 nits
   */
  sdrWhite?: number;

  /*
   *Default is 1000 nits
   */
  hdrPeak?: number;
}

interface AudioDeviceSettings {
  /**
   * 0.0 - 20.0, default is 1.0 (100%)
   */
  volume?: number;

  /**
   * Default is False
   */
  mono?: boolean;

  /**
   * 0.0. - 1.0. Default is 0.5
   * */
  balance?: number;

  /**
   * include Device tracks. default is include to all
   */
  tracks?: AudioTracks;

  /**
   *
   */
  use_device_timing?: boolean;
}

interface AudioDeviceSettingsInfo extends AudioDeviceSettings {
  readonly type: AudioDeviceType;

  /**
   * Device Id
   */
  readonly id: string;

  /**
   * Audio device unique name or Process name for application
   */
  readonly name: string;
}

interface ApplicationAudioDeviceSettingsInfo
  extends AudioDeviceSettingsInfo {
  readonly type: 'output';
}

interface DefaultAudioDeviceParams {
  /**
   * Auto Separate audio tracks
   * when using the default audio sources, the Input and the Output audio sources
   * will use dedicate tracks (2, 3).
   * and track number 1 include both
   */
  separateAudioTracks?: boolean;
}

interface AudioDeviceParams extends DefaultAudioDeviceParams {
  /**
   * Device Id
   */
  id: string;

  /**
   * Audio device unique name
   */
  name: string;
}

interface ApplicationAudioCaptureParams
  extends DefaultAudioDeviceParams {
  /**
   * Process name to capture (i.e Discord.exe or minecraft.exe)
   */
  processName: string;
}

interface AudioGeneralSettings {
  /**
   * Audio sample rate.
   * Default is 48000
   */
  sampleRate?: kSampleRate48kHz | kSampleRate441kHz;

  /**
   * Speaker layout.
   * Default is Stereo
   */
  speakerLayer?: kSpeakerLayout;

  /**
   * Win32 only. Default it True
   */
  disableAudioDucking?: boolean;

  /**
   *
   */
  lowLatencyAudioBuffering?: boolean;
}

interface CaptureSourceSettings {
  /**
   *  Source will be center and stretch (if needed) to video output size
   *  (Default is True)
   */
  stretchToOutputSize?: boolean;
}

interface MonitorCaptureSourceSettings extends CaptureSourceSettings {
  monitorId: string;

  /**
   * Default is Auto
   */
  type?: DisplayCaptureType;

  /**
   *Capture mouse cursor. Default is true.
   */
  captureCursor?: boolean;

  /**
   *
   */
  forceSDR?: boolean;
}

interface GameCaptureSourceSettings extends CaptureSourceSettings {
  /**
   * Game Process to capture, may contain the process name or process Id.
   */
  gameProcess: string | number;

  /**
   * Slow capture. using shared memory
   */
  sliCompatibility?: boolean;

  /**
   *Capture mouse cursor. Default is true.
   */
  captureCursor?: boolean;

  /**
   *
   */
  allowTransparency?: boolean;

  /**
   *
   */
  premultipliedAlpha?: boolean;

  /**
   *Capture third-party overlays
   */
  captureOverlays?: boolean;

  /**
   * Limit capture framerate
   */
  limitFramerate?: boolean;

  /**
   *Use Rec.2100 (PQ) instead sRGB
   */
  rgb10a2Space?: boolean;
}

interface WindowCaptureSourceSettings extends CaptureSourceSettings {
  /**
   * The process name
   */
  executable: string;

  /**
   * Window Capture method (Default is Auto, WGC if enabled)
   */
  type?: WindowCaptureType;

  /**
   *Capture mouse cursor. Default is true.
   */
  captureCursor?: boolean;

  /**
   *
   */
  forceSDR?: boolean;

  /**
   * Default is True
   */
  clientArea?: boolean;

  /**
   * BitBlt multi adapter compatibility
   */
  compatibility?: boolean;
}

interface CaptureSource {
  readonly type: CaptureSourceType;
  readonly properties: any;
}

interface GameCaptureSource extends CaptureSource {
  readonly type: 'Game';
  readonly properties: GameCaptureSourceSettings;
}

interface MonitorCaptureSource extends CaptureSource {
  readonly type: 'Display';
  readonly properties: MonitorCaptureSourceSettings;
}

interface WindowCaptureSource extends CaptureSource {
  readonly type: 'Window';
  readonly properties: WindowCaptureSourceSettings;
}

interface AudioSettings extends AudioGeneralSettings {
  inputs: AudioDeviceSettingsInfo[];
  outputs: AudioDeviceSettingsInfo[];
  applications: ApplicationAudioDeviceSettingsInfo[];
}

interface VideoEncoderSettingsBase {
  type: kSupportedEncodersTypes;

  /**
   * Bitrate.
   *
   * Default is 8000
   */
  bitrate?: number;

  /**
   * Key frame in second.
   *
   * Default is 0 (i.e auto)
   * Adjusting keyint_sec can optimize video streaming quality and performance, balancing between file size and video playback smoothness.
   * For most recording scenarios, a keyframe interval of 2-4 seconds is recommended. This balances quality, file size, and ease of editing.
   * Example: keyint_sec=2 for higher quality and easier editing, keyint_sec=4 for smaller file size.
   * keyint=1 is best for splitting video or replay's but require more resources from the engine.
   */
  keyint_sec?: number;

  /**
   *  Max bitrate
   */
  max_bitrate?: number;
}

/**
 * NVENC encoder setting
 */
interface EncoderSettingsNVENC extends VideoEncoderSettingsBase {
  /**
   * Rate Control. Default is 'CBR'
   */
  rate_control?: kNVENCEncoderRateControl;

  /**
   *  Default is p5.
   *
   * 'p1' - Fastest (Lowest Quality)
   *
   * 'p2' - Faster (Lower Quality)
   *
   * 'p3' - Fast (Low Quality)
   *
   * 'p4' - Medium (Medium Quality)
   *
   * 'p5' - Slow (Good Quality) - Default
   *
   * 'p6' - Slower (Better Quality)
   *
   * 'p7' - Slowest (Best Quality)
   */
  preset2?: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

  /**
   * 'qres' - Two Passes (Quarter Resolution) - Default
   *
   * 'disabled' - Single Pass
   *
   * 'fullres' - Two Passes (Full Resolution)
   */
  multipass?: kNVENCEncoderMultipass;

  /**
   * Default is 'hq'
   */
  tune?: kNVENCEncoderTuning;

  /**
   * Default is True
   */
  psycho_aq?: boolean;

  /**
   * B-Frame. Default is 2
   */
  bf?: number;

  /**
   * Enables dynamic B-frames.If disabled, the encoder will always use the number
   * of B-frames specified in the 'Max B-frames' setting.\n\nIf enabled,
   * it will increase visual quality by only using however many B-frames
   * are necessary, up to the maximum,\nat the cost of increased GPU utilization.
   * Default is False.
   */
  lookahead?: boolean;

  /**
   * Gpu index. Default is 0
   */
  gpu?: number;

  /**
   * Default is 'main'
   */
  profile?: kNVENCEncoderProfile | string;
}

interface EncoderSettingsNVENC264 extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'high')
   */
  profile?: kNVENCEncoderProfile264;
}

interface EncoderSettingsNVENCHEVC extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'main')
   */
  profile?: kNVENCEncoderProfileHEVC;
}

// AMD
interface EncoderSettingsAMF extends VideoEncoderSettingsBase {
  /**
   * Rate Control. Default is 'CBR'
   */
  rate_control?: kAMDEncoderRateControl;

  /**
   * Use to specify custom AMF or FFmpeg options.
   * For example, \"level=5.2 profile=main\". Check the AMF encoder docs for more details.
   */
  ffmpeg_opts?: string;

  /**
   * CPQ (Default is 20)
   */
  cpq?: number;

  /**
   * Max B-frames (Default is 3)
   */
  bf?: number;
}

interface EncoderSettingsAMFAV1 extends EncoderSettingsAMF {
  /**
   * Preset (Default is main)
   */
  profile?: kAMDEncoderProfileAV1;

  /**
   * preset
   */
  preset?: kAMDEncoderPresetAV1;
}

interface EncoderSettingsAMF264 extends EncoderSettingsAMF {
  /**
   * Preset (Default is high)
   */
  profile?: kAMDEncoderProfile264;

  /*
   * preset
   */
  preset?: kAMDEncoderPreset;
}

interface EncoderSettingsAMFHVEC extends EncoderSettingsAMF {
  /*
   * preset
   */
  preset?: kAMDEncoderPreset;
}

interface EncoderSettingsQuickSync extends VideoEncoderSettingsBase {
  /**
   * Rate Control (Default is 'CBR')
   */
  rate_control?: kQuickSyncEncoderRateControl;

  /**
   * Target Usage / Preset (Default is 'TU4' - Balanced (Medium Quality))
   */
  target_usage?: kQuickSyncTargetUsage;

  /**
   * bFrames (Default is 3)
   */
  bframes?: number;

  /**
   * Subjective Video Enhancements (Default is 'true')
   */
  enhancements?: boolean;
}

interface EncoderSettingsQuickSync264 extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfile264;
}

interface EncoderSettingsQuickSyncHEVC extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfileHEVC;
}

interface EncoderSettingsX264 extends VideoEncoderSettingsBase {
  /**
   * Rate Control (Default is rate_control);
   */
  rate_control?: kX264EncoderRateControl;

  /**
   * Preset (Default is 'veryfast')
   */
  preset?: kX264EncoderPreset;

  /**
   * Profile (Default is None)
   */
  profile?: kX264EncoderProfile;

  /**
   * Tun (Default is None)
   */
  tune?: kX264EncoderTune;

  /**
   * x264 Options (separated by space)
   */
  x264opts?: string;

  /**
   * Use Custom buffer size
   */
  use_bufsize?: boolean;

  /**
   * Custom buffer size (Valid when 'use_bufsize' is true)
   */
  buffer_size?: number;
}

interface EncoderSettingsQuickSyncH264 extends VideoEncoderSettingsBase {
  profile?: kQuickSyncEncoderProfile264;
}

interface CaptureSettings {
  videoSettings: VideoSettings;

  audioSettings: AudioSettings;

  videoEncoderSettings: VideoEncoderSettingsBase;

  audioEncoder: AudioEncoderInfo;

  sources: CaptureSource[];
}

interface CaptureSettingsBuilder extends CaptureSettings {
  /**
   * Add Screen video capture source
   * @param settings
   */
  addScreenSource(
    settings: MonitorCaptureSourceSettings
  ): CaptureSettingsBuilder;

  /**
   * Add Game video capture source
   * @param settings
   */
  addGameSource(settings: GameCaptureSourceSettings): CaptureSettingsBuilder;

  /**
   * Add Audio device capture
   */
  addAudioCapture(
    params: AudioDeviceParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   * Add Default device (Input or Output) if not already added
   * @param type
   * @param params
   * @param settings
   */
  addAudioDefaultCapture(
    type: AudioDeviceType,
    params?: DefaultAudioDeviceParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   *
   * @param param
   * @param settings
   */
  addApplicationAudioCapture(
    param: ApplicationAudioCaptureParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   * Return CaptureSettings object
   */
  build(): CaptureSettings;
}

interface CaptureSettingsOptions {
  /**
   * encoder type to create capture setting.
   * Default is the best default encoder detected (GPU -> x264)
   */
  videoEncoder?: kSupportedEncodersTypes;

  /**
   * Default is 'ffmpeg_aac' (FFmpeg AAC).
   * use queryInformation().encoders.audio gor supported encoders
   */
  audioEncoder?: kKnownAudioEncodersTypes;

  /**
   * Add Default Audio Devices (Default is True)
   */
  includeDefaultAudioSources?: boolean;

  /**
   * Auto Separate audio tracks
   * when using the default audio sources, the Input and the Output audio sources
   * will use dedicate tracks (2, 3).
   * and track number 1 include both
   */
  separateAudioTracks?: boolean;
}

// Obs Query Information types
interface GraphicsInformation {
  adapters: AdapterInfo[];
  monitors: MonitorInfo[];
}

interface EncoderInformation {
  video: VideoEncoderInfo[];
  audio: AudioEncoderInfo[];
}

interface RecordingAppOptions {
  /**
   * Show Recorder capture window
   */
  showDebugWindow?: boolean;

  /**
   * Enable recorder debug logs
   */
  enableDebugLogs?: boolean;

  /**
   * Custom command lines when launching recorder
   */
  customCommandLineArgs?: string[];

  /**
   * Override OBS binaries
   */
  overrideOBSFolder?: string;

  /**
   * Emit 'stats' event interval in milliseconds. Default is 2000 (2 second)
   * note: set 0 to disable stats emit
   */
  statsInterval?: number;
}

type ErrorCode =
  | -1001 // Generic Unknown error 'Unknown'
  | -1000 // Obs process crashed 'ProcessTerminated'
  | -999 // Missing binaries 'MissingBinaries'
  | -998 // Connection to obs process error 'ConnectionOBSError'
  | -997 // Can't perform request while recording 'AlreadyRunning'
  | -12 // Split recording disabled 'SplitRecordingDisabled'
  | -11 // Missing or invalid parameters 'MissingOrInvalidParameters'
  | -10 // No active recording 'NoActiveRecording'
  | -8 // Encoder error 'EncoderError'
  | -7 // No disk space error 'NoDiskSpaceError'
  | -4 // Video file processing error 'ProcessOutputError'
  | -1 // Video bad path 'BadPathError'
  | 0 // Success 'Success'
  | 1 // Stop due to low disk space 'SuccessLowDiskSpace'
  | 2; // Replay stopped while creating replay 'SuccessWithError'

/**
 * Constants for error codes.
 */
interface RecordingBaseOptions {
  /**
   * Video file format. Default is 'fragmented_mp4'
   */
  fileFormat?: kFileFormat;

  /**
   * Video Audio tracks, default is 'Track1' or 'Track1'| 'Track2' |'Track3'
   * if |separateAudioTracks| is on.
   */
  audioTrack?: AudioTracks;

  /**
   * Auto shutdown recording when game exit
   * Note: valid when recording with game capture source
   */
  autoShutdownOnGameExit?: boolean;
}

/**
 *
 */
interface SplitOptions {
  //splitType: VideoRecordingSplitType;

  enableManual: boolean;

  /**
   * Split video by time (in seconds).
   */
  maxTimeSecond?: number;

  /**
   * Split video by size (MB).
   */
  maxBySizeMB?: number;

  /**
   * Full video will be recorded to disk
   * parallel to splits videos (when 'splitType' is bySize or byTime)
   */
  //includeFullVideo?: boolean;
}

interface RecordingOptions extends RecordingBaseOptions {
  split?: SplitOptions;

  /**
   * Output file path (without file extension)
   */
  filePath: string;
}

interface ReplayOptions extends RecordingBaseOptions {
  /**
   * Defines the length of the buffer to be recorded in seconds
   */
  bufferSecond: number;

  /**
   * Set replay's root folder path
   */
  rootFolder: string;
}

type ReplayCallback = (replay: ReplayVideo) => void;
type StopCallback = (args: RecordStopEventArgs) => void;
type SplitCallback = (videoInfo: SplitRecordArgs) => void;
type StartCallback = (args: RecordEventArgs) => void;
type ReplayStopCallback = (args: RecordEventArgs) => void;

interface CaptureReplayOptions {
  /**
   * Replay file name (without extension)
   */
  fileName: string;

  /**
   * The video length, in milliseconds to include prior to the time of this call.
   */
  pastDuration: number;

  /**
   * Auto stop (optional) in milliseconds.
   * When set to Zero, will create replay with pass duration only.
   * if not set, use |ActiveReplay| to stop the replay
   */
  timeout?: number;
}

interface RecordEventArgs {
  /**
   * Video file path
   */
  filePath?: string | undefined;

  /**
   * Recording error message when recording fail to record successfully.
   */
  error?: string;

  /**
   * Recording stop reason
   */
  reason?: ErrorCode | number;

  /**
   * Recording Stats
   */
  stats?: RecorderStats;
}

interface RecordStopEventArgs extends RecordEventArgs {
  /**
   * Video duration in milliseconds when recording ended successfully
   */
  duration?: number;

  /**
   *
   */
  hasError: boolean;

  /**
   * number of splits (if had any)
   */
  splitCount?: number;

  /**
   * Video start time (Epoch)
   */
  startTimeEpoch?: number;
}

interface SplitRecordArgs extends RecordEventArgs {
  /**
   * Video duration in milliseconds when recording ended successfully
   */
  duration: number;

  /**
   * number of split
   */
  splitCount: number;

  /** Next video file path */
  nextFilePath: string;

  /**
   * Video start time (Epoch)
   */
  startTimeEpoch?: number;
}

interface ReplayVideo extends RecordEventArgs {
  /**
   * Replay video duration in millisecond
   */
  duration: number;

  /**
   * Video start time (Epoch UTC) (first frame)
   */
  startTimeEpoch: number;
}

/**
 * handling current ongoing active replay video.
 */
interface ActiveReplay {
  callback?: ReplayCallback;

  /**
   * current replay timeout in milliseconds (since was set, if was set)
   */
  readonly timeout?: number;

  /**
   * Stop replay now.
   * @param callback (optional) set or override exiting complete callback
   */
  stop(callback?: ReplayCallback);

  /**
   * Stop after |timeout| in milliseconds
   * @param callback (optional) set or override exiting complete callback
   */
  stopAfter(timeout: number, callback?: ReplayCallback);
}

interface RecorderStats {
  /**
   * Current CPU usage in percent
   */
  cpuUsage: number;
  /**
   * Amount of memory in MB currently being used by Recorder
   */
  memoryUsage: number;
  /**
   * Available disk space on the device being used for recording storage
   */
  availableDiskSpace: number;
  /**
   * Current FPS being rendered
   */
  activeFps: number;
  /**
   * Average time in milliseconds that Recorder is taking to render a frame
   */
  averageFrameRenderTime: number;
  /**
   * Number of frames skipped by Recorder in the render thread
   */
  renderSkippedFrames: number;
  /**
   * Total number of frames outputted by the render thread
   */
  renderTotalFrames: number;
  /**
   * Number of frames skipped by Recorder in the output thread
   */
  outputSkippedFrames: number;
  /**
   * Total number of frames outputted by the output thread
   */
  outputTotalFrames: number;
}

/**
 * Recorder Error object
 */
export class RecorderError extends Error {
  code: ErrorCode;
  codeStr: string; //ErrorCodeAs
  internalError?: Error;
}

interface IOverwolfRecordingApi {
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
