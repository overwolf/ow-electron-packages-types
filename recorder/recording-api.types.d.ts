import { GameInfo } from "../common/common";

type Rect = { top: number; left: number; width: number; height: number };

export type AudioDeviceType = 'input' | 'output';

export declare type kSupportedEncodersTypes =
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

export declare type kKnownAudioEncodersTypes =
  | 'ffmpeg_aac'
  | 'ffmpeg_opus'
  | 'ffmpeg_pcm_s16le'
  | 'ffmpeg_pcm_s24le'
  | 'ffmpeg_pcm_f32le'
  | 'ffmpeg_alac'
  | 'ffmpeg_flac'
  | string;

// Sample Rate
export declare type kSampleRate48kHz = 48000;
export declare type kSampleRate441kHz = 44100;
export declare type kSpeakerLayout =
  | 'SPEAKERS_MONO'
  | 'SPEAKERS_STEREO'
  | 'SPEAKERS_2POINT1'
  | 'SPEAKERS_4POINT0'
  | 'SPEAKERS_4POINT1'
  | 'SPEAKERS_5POINT1'
  | 'SPEAKERS_7POINT1';

export const enum AudioTracks {
  None = 0,
  Track1 = 1 << 0,
  Track2 = 1 << 1, // 0010
  Track3 = 1 << 2, // 0100
  Track4 = 1 << 3, // 1000
  Track5 = 1 << 4, // 1000
  Track6 = 1 << 5, // 1000
  All = 0xff,
}

export const enum DisplayCaptureType {
  Auto = 0,

  /** Direct Duplicator */
  DXGI = 1,

  /**
   * Windows 10 (1903 and up)
   */
  WGC = 2,

  /**
   * Compatibility mode
   */
  BitBlt = 3,
}

export declare type CaptureSourceType = 'Display' | 'Game' | 'Window';

export interface AudioDevice {
  readonly type: AudioDeviceType;
  readonly id: string;
  readonly name: string;
  readonly isDefault: boolean;
}

export interface EncoderInfoBase {
  readonly codec: string;
  readonly name: string;
}

export interface EncoderProperty {
  readonly default: any;
  readonly description: string;
  readonly values?: Record<string | number, string>;
}

export interface AudioEncoderInfo extends EncoderInfoBase {
  readonly type: kKnownAudioEncodersTypes;
}

export interface VideoEncoderInfo extends EncoderInfoBase {
  readonly type: kSupportedEncodersTypes;
  readonly properties?: Record<string, EncoderProperty>;
}

export interface AdapterInfo {
  readonly index: 0;
  readonly name: string;
  readonly driver: string;
  readonly hagsEnabled: boolean;
  readonly hagsEnabledByDefault: boolean;
}

export interface AudioInformation {
  readonly inputDevices: AudioDevice[];
  readonly outputDevices: AudioDevice[];
  readonly encoders: AudioEncoderInfo[];

  readonly defaultEncoder: kKnownAudioEncodersTypes;
}

export interface MonitorInfo {
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

export interface VideoInformation {
  readonly encoders: VideoEncoderInfo[];
  readonly adapters: AdapterInfo[];

  readonly defaultEncoder: kSupportedEncodersTypes;
}

export interface RecordingInformation {
  audio: AudioInformation;
  video: VideoInformation;
  monitors: MonitorInfo[];
}

// Video settings
export declare type kFileFormat =
  | 'fragmented_mp4'
  | 'fragmented_mov'
  | 'mp4'
  | 'flv'
  | 'mkv'
  | 'mov'
  | 'mpegts'
  | 'hls';

export declare type kVideoColorFormat =
  | 'NV12'
  | 'I420'
  | 'I444'
  | 'P010'
  | 'I010'
  | 'P216'
  | 'P416'
  | 'BGRA';

export declare type kVideoColorSpec =
  | 'sRGB'
  | '709'
  | '601'
  | '2100PQ'
  | '2100HLG';

export declare type kVideoColorRange = 'Partial' | 'Full';

// encoder AMD
export declare type kAMDEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'VBR_LAT'
  | 'QVBR'
  | 'HQVBR'
  | 'HQCBR';

export declare type kAMDEncoderPreset = 'quality' | 'balanced' | 'speed';
export declare type kAMDEncoderPresetAV1 = kAMDEncoderPreset | 'highQuality';
export declare type kAMDEncoderProfileAV1 = 'main';
export declare type kAMDEncoderProfile264 =
  | kAMDEncoderProfileAV1
  | 'high'
  | 'baseline';

// encoder NVENC
export declare type kNVENCEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'Lossless';
export declare type kNVENCEncoderMultipass = 'qres' | 'fullres' | 'disabled';
export declare type kNVENCEncoderTuning = 'hq' | 'll' | 'ull';
export declare type kNVENCEncoderProfile = 'main';
export declare type kNVENCEncoderProfile264 =
  | kNVENCEncoderProfile
  | 'high'
  | 'baseline';
export declare type kNVENCEncoderProfileHEVC = kNVENCEncoderProfile | 'main10';

// encoder X264
export declare type kX264EncoderRateControl = 'CBR' | 'ABR' | 'VBR' | 'CRF';

export declare type kX264EncoderProfile = '' | 'baseline' | 'main' | 'high';
export declare type kX264EncoderTune =
  | ''
  | 'film'
  | 'animation'
  | 'grain'
  | 'stillimage'
  | 'psnr'
  | 'ssim'
  | 'fastdecode'
  | 'zerolatency';

export declare type kX264EncoderPreset =
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

export declare type kQuickSyncEncoderProfileHEVC = kNVENCEncoderProfileHEVC;
export declare type kQuickSyncEncoderProfile264 = kNVENCEncoderProfile264;
export declare type kQuickSyncTargetUsage =
  | 'TU1' // Slowest (Best Quality)
  | 'TU2' // Slower
  | 'TU3' // Slow
  | 'TU4' // Balanced (Medium Quality)
  | 'TU5' // Fast
  | 'TU6' // Faster
  | 'TU7'; // Fastest (Best Speed)

export declare type kQuickSyncEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'ICQ';

export declare type VideoRecordingSplitType = 'byTime' | 'bySize' | 'manual';

export interface VideoSettings {
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

export interface AudioDeviceSettings {
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

export interface AudioDeviceSettingsInfo extends AudioDeviceSettings {
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

export interface ApplicationAudioDeviceSettingsInfo extends AudioDeviceSettingsInfo {
  readonly type: 'output';
}

export interface DefaultAudioDeviceParams {
  /**
   * Auto Separate audio tracks
   * when using the default audio sources, the Input and the Output audio sources
   * will use dedicate tracks (2, 3).
   * and track number 1 include both
   */
  separateAudioTracks?: boolean;
}

export interface AudioDeviceParams extends DefaultAudioDeviceParams {
  /**
   * Device Id
   */
  id: string;

  /**
   * Audio device unique name
   */
  name: string;
}

export interface ApplicationAudioCaptureParams
  extends DefaultAudioDeviceParams {
  /**
   * Process name to capture (i.e Discord.exe or minecraft.exe)
   */
  processName: string;
}

export interface AudioGeneralSettings {
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

export interface CaptureSourceSettings {
  /**
   *  Source will be center and stretch (if needed) to video output size
   *  (Default is True)
   */
  stretchToOutputSize?: boolean;
}

export interface MonitorCaptureSourceSettings extends CaptureSourceSettings {
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

export interface GameCaptureSourceSettings extends CaptureSourceSettings {
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

export interface CaptureSource {
  readonly type: CaptureSourceType;
  readonly properties: any;
}

export interface GameCaptureSource extends CaptureSource {
  readonly type: 'Game';
  readonly properties: GameCaptureSourceSettings;
}

export interface MonitorCaptureSource extends CaptureSource {
  readonly type: 'Display';
  readonly properties: MonitorCaptureSourceSettings;
}

export interface AudioSettings extends AudioGeneralSettings {
  inputs: AudioDeviceSettingsInfo[];
  outputs: AudioDeviceSettingsInfo[];
  applications: ApplicationAudioDeviceSettingsInfo[];
}

export interface VideoEncoderSettingsBase {
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
export interface EncoderSettingsNVENC extends VideoEncoderSettingsBase {
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

export interface EncoderSettingsNVENC264 extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'high')
   */
  profile?: kNVENCEncoderProfile264;
}

export interface EncoderSettingsNVENCHEVC extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'main')
   */
  profile?: kNVENCEncoderProfileHEVC;
}

// AMD
export interface EncoderSettingsAMF extends VideoEncoderSettingsBase {
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

export interface EncoderSettingsAMFAV1 extends EncoderSettingsAMF {
  /**
   * Preset (Default is main)
   */
  profile?: kAMDEncoderProfileAV1;

  /**
   * preset
   */
  preset?: kAMDEncoderPresetAV1;
}

export interface EncoderSettingsAMF264 extends EncoderSettingsAMF {
  /**
   * Preset (Default is high)
   */
  profile?: kAMDEncoderProfile264;

  /*
   * preset
   */
  preset?: kAMDEncoderPreset;
}

export interface EncoderSettingsAMFHVEC extends EncoderSettingsAMF {
  /*
   * preset
   */
  preset?: kAMDEncoderPreset;
}

export interface EncoderSettingsQuickSync extends VideoEncoderSettingsBase {
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

export interface EncoderSettingsQuickSync264 extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfile264;
}

export interface EncoderSettingsQuickSyncHEVC extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfileHEVC;
}

export interface EncoderSettingsX264 extends VideoEncoderSettingsBase {
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

export interface EncoderSettingsQuickSyncH264 extends VideoEncoderSettingsBase {
  profile?: kQuickSyncEncoderProfile264;
}

export interface CaptureSettings {
  videoSettings: VideoSettings;

  audioSettings: AudioSettings;

  videoEncoderSettings: VideoEncoderSettingsBase;

  audioEncoder: AudioEncoderInfo;

  sources: CaptureSource[];
}

export interface CaptureSettingsBuilder extends CaptureSettings {
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
  addGameSource(settings: GameCaptureSourceSettings):
   CaptureSettingsBuilder;

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

export interface CaptureSettingsOptions {
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
   * Add Default Audio Devices
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
export interface GraphicsInformation {
  adapters: AdapterInfo[];
  monitors: MonitorInfo[];
}

export interface EncoderInformation {
  video: VideoEncoderInfo[];
  audio: AudioEncoderInfo[];
}

export interface RecordingAppOptions {
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

export const enum ErrorCode {
  /**
   * Generic Unknown error
   */
  Unknown = -1001,

  /**
   * Obs process crashed
   */
  ProcessTerminated = -1000,

  /**
   * Missing binaries
   */
  MissingBinaries = -999,

  /**
   * Connection to obs process error
  */
  ConnectionOBSError = -998,

  /**
  * Can't preform request while recording 
  */
  AlreadyRunning = -997,

  /**
   *
   */
  SplitRecordingDisabled = -12,

  /**
   *
   */
  MissingOrInvalidParameters = -11,

  /**
   *
   */
  NoActiveRecording = -10,

  /**
   * Encoder error
   */
  EncoderError = -8,

  /**
   * Recording error
   */
  NoDiskSpaceError = -7,

  /**
   * Video file processing error
   */
  ProcessOutputError = -4,

  /**
   * Video bad path
   */
  BadPathError = -1,

  /**
   * Success
   */
  Success = 0,

  /**
   * Stop due to low disk space (less then 50NB left at output folder)
   */
  SuccessLowDiskSpace = 1,

  /**
   * Replay stopped while creating replay (partial video)
   */
  SuccessWithError = 2,
}

export interface RecordingBaseOptions {
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
export interface SplitOptions {
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

export interface RecordingOptions extends RecordingBaseOptions {
  split?: SplitOptions;

  /**
   * Output file path (without file extension)
   */
  filePath: string;
}

export interface ReplayOptions extends RecordingBaseOptions {
  /**
   * Defines the length of the buffer to be recorded in seconds
   */
  bufferSecond: number;

  /**
   * Set replay's root folder path
   */
  rootFolder: string;
}

export declare type ReplayCallback = (replay: ReplayVideo) => void;
export declare type StopCallback = (args: RecordStopEventArgs) => void;
export declare type SplitCallback = (videoInfo: SplitRecordArgs) => void;
export declare type StartCallback = (args: RecordEventArgs) => void;
export declare type ReplayStopCallback = (args: RecordEventArgs) => void;

export interface CaptureReplayOptions {
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

export interface RecordEventArgs {
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

export interface RecordStopEventArgs extends RecordEventArgs {
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

export interface SplitRecordArgs extends RecordEventArgs {
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

export interface ReplayVideo extends RecordEventArgs {
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
export interface ActiveReplay {
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

export interface RecorderStats {
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
  internalError?: Error;
}
