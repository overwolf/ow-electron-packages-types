

/**
 * @owpackage Recorder
 */
type Rect = { top: number; left: number; width: number; height: number };



/**
 * @owpackage Recorder
 */
type AudioDeviceType = 'input' | 'output';



/**
 * @owpackage Recorder
 */
type kSupportedEncodersTypes =
// jim_* are deprecated since obs 0.31.0. instead we use obs_nvenc_* encoders
  | 'ffmpeg_svt_av1'
  | 'ffmpeg_aom_av1'
  | 'obs_x264'
  | 'h264_texture_amf'
  | 'h265_texture_amf'
  | 'av1_texture_amf'
  | 'obs_qsv11_v2'
  | 'obs_qsv11_hevc'
  | 'obs_qsv11_av1'
  | 'obs_nvenc_h264_tex'
  | 'obs_nvenc_hevc_tex'
  | 'obs_nvenc_av1_tex';



/**
 * @owpackage Recorder
 */
type kKnownAudioEncodersTypes =
  | 'ffmpeg_aac'
  | 'ffmpeg_opus'
  | 'ffmpeg_pcm_s16le'
  | 'ffmpeg_pcm_s24le'
  | 'ffmpeg_pcm_f32le'
  | 'ffmpeg_alac'
  | 'ffmpeg_flac'
  | string;



/**
 *  Sample Rate
 * 
 * @owpackage Recorder
 */
type kSampleRate48kHz = 48000;



/**
 * @owpackage Recorder
 */
type kSampleRate441kHz = 44100;



/**
 * @owpackage Recorder
 */
type kSpeakerLayout =
  | 'SPEAKERS_MONO'
  | 'SPEAKERS_STEREO'
  | 'SPEAKERS_2POINT1'
  | 'SPEAKERS_4POINT0'
  | 'SPEAKERS_4POINT1'
  | 'SPEAKERS_5POINT1'
  | 'SPEAKERS_7POINT1';



/**
 * @owpackage Recorder
 */
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
 * 
 * @owpackage Recorder
 * 
 */
type AudioTracks =  0 | 1 | 2 | 4 | 8 | 16 | 32 | 0xff | number;



/**
 * @owpackage Recorder
 */

type DisplayCaptureType = "Auto" | "DXGI" | "BitBlt" | "WGC";



/**
 * @owpackage Recorder
 */
type CaptureSourceType = 'Display' | 'Game' | 'Window';



/**
 * @owpackage Recorder
 */
interface AudioDevice {
  readonly type: AudioDeviceType;
  readonly id: string;
  readonly name: string;
  readonly isDefault: boolean;
}



/**
 * @owpackage Recorder
 */
interface EncoderInfoBase {
  readonly codec: string;
  readonly name: string;
}



/**
 * @owpackage Recorder
 */
interface EncoderProperty {
  readonly default: any;
  readonly description: string;
  readonly values?: Record<string | number, string>;
}



/**
 * @owpackage Recorder
 */
interface AudioEncoderInfo extends EncoderInfoBase {
  readonly type: kKnownAudioEncodersTypes;
}



/**
 * @owpackage Recorder
 */
interface VideoEncoderInfo extends EncoderInfoBase {
  readonly type: kSupportedEncodersTypes;
  readonly properties?: Record<string, EncoderProperty>;
}



/**
 * @owpackage Recorder
 */
interface AdapterInfo {
  readonly index: 0;
  readonly name: string;
  readonly driver: string;
  readonly hagsEnabled: boolean;
  readonly hagsEnabledByDefault: boolean;
}



/**
 * @owpackage Recorder
 */
interface AudioInformation {
  readonly inputDevices: AudioDevice[];
  readonly outputDevices: AudioDevice[];
  readonly encoders: AudioEncoderInfo[];

  readonly defaultEncoder: kKnownAudioEncodersTypes;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface VideoInformation {
  readonly encoders: VideoEncoderInfo[];
  readonly adapters: AdapterInfo[];

  readonly defaultEncoder: kSupportedEncodersTypes;
}



/**
 * @owpackage Recorder
 */
interface RecordingInformation {
  audio: AudioInformation;
  video: VideoInformation;
  monitors: MonitorInfo[];
}



/**
 * Video settings
 * 
 * @owpackage Recorder
 */
type kFileFormat =
  | 'fragmented_mp4'
  | 'fragmented_mov'
  | 'mp4'
  | 'flv'
  | 'mkv'
  | 'mov'
  | 'mpegts'
  | 'hls'
  | 'hybrid_mp4';



/**
 * @owpackage Recorder
 */
type kVideoColorFormat =
  | 'NV12'
  | 'I420'
  | 'I444'
  | 'P010'
  | 'I010'
  | 'P216'
  | 'P416'
  | 'BGRA';



/**
 * @owpackage Recorder
 */
type kVideoColorSpec =
| 'sRGB'
| '709'
| '601'
| '2100PQ'
| '2100HLG';



/**
 * @owpackage Recorder
 */
type kVideoColorRange = 'Partial' | 'Full';




/**
 * encoder AMD
 * 
 * @owpackage Recorder
 */
type kAMDEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'VBR_LAT'
  | 'QVBR'
  | 'HQVBR'
  | 'HQCBR';



/**
 * @owpackage Recorder
 */
type kAMDEncoderPreset = 'quality' | 'balanced' | 'speed';



/**
 * @owpackage Recorder
 */
type kAMDEncoderPresetAV1 = kAMDEncoderPreset | 'highQuality';



/**
 * @owpackage Recorder
 */
type kAMDEncoderProfileAV1 = 'main';



/**
 * @owpackage Recorder
 */
type kAMDEncoderProfile264 =
  | kAMDEncoderProfileAV1
  | 'high'
  | 'baseline';



/**
 * encoder NVENC
 * 
 * @owpackage Recorder
 */
type kNVENCEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'Lossless';



/**
 * @owpackage Recorder
 */
type kNVENCEncoderMultipass = 'qres' | 'fullres' | 'disabled';



/**
 * @owpackage Recorder
 */
type kNVENCEncoderTuning = 'hq' | 'll' | 'ull';



/**
 * @owpackage Recorder
 */
type kNVENCEncoderProfile = 'main';



/**
 * @owpackage Recorder
 */
type kNVENCEncoderProfile264 =
  | kNVENCEncoderProfile
  | 'high'
  | 'baseline';



/**
 * @owpackage Recorder
 */  
type kNVENCEncoderProfileHEVC = kNVENCEncoderProfile | 'main10';




/**
 * encoder X264
 * 
 * @owpackage Recorder
 */
type kX264EncoderRateControl = 'CBR' | 'ABR' | 'VBR' | 'CRF';



/**
 * @owpackage Recorder
 */
type kX264EncoderProfile = '' | 'baseline' | 'main' | 'high';



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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




/**
 * QuickSync
 * 
 * @owpackage Recorder
 */
type kQuickSyncEncoderProfileHEVC = kNVENCEncoderProfileHEVC;



/**
 * @owpackage Recorder
 */
type kQuickSyncEncoderProfile264 = kNVENCEncoderProfile264;



/**
 * @owpackage Recorder
 */
type kQuickSyncTargetUsage =
  | 'TU1' // Slowest (Best Quality)
  | 'TU2' // Slower
  | 'TU3' // Slow
  | 'TU4' // Balanced (Medium Quality)
  | 'TU5' // Fast
  | 'TU6' // Faster
  | 'TU7';

 // Fastest (Best Speed)

/**
 * @owpackage Recorder
 */
type kQuickSyncEncoderRateControl =
  | 'CBR'
  | 'CQP'
  | 'VBR'
  | 'ICQ';



/**
 * @owpackage Recorder
 */
type VideoRecordingSplitType = 'byTime' | 'bySize' | 'manual';



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
export interface AudioDeviceSettingsUpdateInfo  extends AudioDeviceSettings {
   /**
   * Audio device unique name or Process name for application
   */
   readonly name: string;
}



/**
 * @owpackage Recorder
 */
interface ApplicationAudioDeviceSettingsInfo
  extends AudioDeviceSettingsInfo {
  readonly type: 'output';
}



/**
 * @owpackage Recorder
 */
interface DefaultAudioDeviceParams {
  /**
   * Auto Separate audio tracks
   * when using the default audio sources, the Input and the Output audio sources
   * will use dedicate tracks (2, 3).
   * and track number 1 include both
   */
  separateAudioTracks?: boolean;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface ApplicationAudioCaptureParams
  extends DefaultAudioDeviceParams {
  /**
   * Process name to capture (i.e Discord.exe or minecraft.exe)
   */
  processName: string;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface CaptureSourceSettings {
  /**
   *  Source will be center and stretch (if needed) to video output size
   *  (Default is True)
   */
  stretchToOutputSize?: boolean;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface CaptureSource {
  readonly type: CaptureSourceType;
  readonly properties: any;
}



/**
 * @owpackage Recorder
 */
interface GameCaptureSource extends CaptureSource {
  readonly type: 'Game';
  readonly properties: GameCaptureSourceSettings;
}



/**
 * @owpackage Recorder
 */
interface MonitorCaptureSource extends CaptureSource {
  readonly type: 'Display';
  readonly properties: MonitorCaptureSourceSettings;
}



/**
 * @owpackage Recorder
 */
interface WindowCaptureSource extends CaptureSource {
  readonly type: 'Window';
  readonly properties: WindowCaptureSourceSettings;
}



/**
 * @owpackage Recorder
 */
interface AudioSettings extends AudioGeneralSettings {
  inputs: AudioDeviceSettingsInfo[];
  outputs: AudioDeviceSettingsInfo[];
  applications: ApplicationAudioDeviceSettingsInfo[];
}



/**
 * @owpackage Recorder
 */
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
 * 
 * @owpackage Recorder
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
  // OBS 31.0.0 preset2 changed to preset
  preset?: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

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



/**
 * @owpackage Recorder
 */
interface EncoderSettingsNVENC264 extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'high')
   */
  profile?: kNVENCEncoderProfile264;
}



/**
 * @owpackage Recorder
 */
interface EncoderSettingsNVENCHEVC extends EncoderSettingsNVENC {
  /**
   * Profile (Default is 'main')
   */
  profile?: kNVENCEncoderProfileHEVC;
}




/**
 * AMD
 * 
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface EncoderSettingsAMFHVEC extends EncoderSettingsAMF {
  /*
   * preset
   */
  preset?: kAMDEncoderPreset;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface EncoderSettingsQuickSync264 extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfile264;
}



/**
 * @owpackage Recorder
 */
interface EncoderSettingsQuickSyncHEVC extends EncoderSettingsQuickSync {
  /**
   * Profile (Default 'high' for x264 and 'main' for 'HEVC' or 'AV1' )
   */
  profile?: kQuickSyncEncoderProfileHEVC;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
interface EncoderSettingsQuickSyncH264 extends VideoEncoderSettingsBase {
  profile?: kQuickSyncEncoderProfile264;
}



/**
 * @owpackage Recorder
 */
interface CaptureSettings {
  videoSettings: VideoSettings;

  audioSettings: AudioSettings;

  videoEncoderSettings: VideoEncoderSettingsBase;

  audioEncoder: AudioEncoderInfo;

  sources: CaptureSource[];
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * Obs Query Information types
 * 
 * @owpackage Recorder
 */
interface GraphicsInformation {
  adapters: AdapterInfo[];
  monitors: MonitorInfo[];
}



/**
 * @owpackage Recorder
 */
interface EncoderInformation {
  video: VideoEncoderInfo[];
  audio: AudioEncoderInfo[];
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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
  | 2;

 // Replay stopped while creating replay 'SuccessWithError'

/**
 * Constants for error codes.
 * 
 * @owpackage Recorder
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
 * @owpackage Recorder
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



/**
 * @owpackage Recorder
 */
interface RecordingOptions extends RecordingBaseOptions {
  split?: SplitOptions;

  /**
   * Output file path (without file extension)
   */
  filePath: string;
}



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
type ReplayCallback = (replay: ReplayVideo) => void;



/**
 * @owpackage Recorder
 */
type StopCallback = (args: RecordStopEventArgs) => void;



/**
 * @owpackage Recorder
 */
type SplitCallback = (videoInfo: SplitRecordArgs) => void;



/**
 * @owpackage Recorder
 */
type StartCallback = (args: RecordEventArgs) => void;



/**
 * @owpackage Recorder
 */
type ReplayStopCallback = (args: RecordEventArgs) => void;



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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



/**
 * @owpackage Recorder
 */
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
 * 
 * @owpackage Recorder
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



/**
 * @owpackage Recorder
 */
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
 *
 * @owpackage Recorder
 */
export class RecorderError extends Error {
  code: ErrorCode;
  codeStr: string; //ErrorCodeAs
  internalError?: Error;
}



/**
 * @owpackage Recorder
 */
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
   * Is recording active
   */
  isRecordingActive(): Promise<boolean>;

  /**
   * Is replay  active
   */
  isReplayActive(): Promise<boolean>;

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
   * ```
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
   * Update audio device settings while recording
   * (for example, volume, mute, etc.) by device name.
   *
   * @param device
   * @since 0.32.0
   */
  updateAudioDevice(
    device: AudioDeviceSettingsUpdateInfo
  ): Promise<void>;

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