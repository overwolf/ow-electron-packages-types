/**
 * 
 * The Overwolf Electron recording APIs integrate recording into the Overwolf Electron framework allowing you to record both audio and video.
 * 
 * The recoding API supports many different encoders and provides two recording modes so that you can create dynamic recording apps.
 * 
 * ## Recording modes
 * The recording feature supports two types of recording modes:
 * 
 * - Standard—all video is recorded from start to finish when stopped and is saved to storage.
 * - Replay—records based on a provided time frame (cached sliding buffer). Specify total buffer time and how much time to record before and/or after the recording starts. Once recording is complete the video will be saved to your storage.
 * 
 * ## Recorder package features
 * 
 * ### Capture Audio / Video
 * - Capture video from a specific display device or capture from a running game.
 * - Capture any audio input or output device, such as speakers, a microphone, or the game sound alone.
 * - Split capture into separate video files on-demand or using a timer.
 * - Multiple audio and video encoders supported.
 * - Multiple output formats supported.
 * - Control bitrate and encoding rate.
 * - Options to allocate specific audio tracks to specific audio devices.
 * 
 * ### Replays Capture
 * 
 * - Record a buffer of X seconds to memory without saving to disk.
 * - Allow for on-demand video capture to disk with a portion or all of the in-memory buffer.
 * - For example, when a highlight is detected while the replay is running, capture can be turned on to run for a timer, using X seconds already captured by the replay.
 * 
 * ### Game Listener
 * 
 * - Using the recording package, we can register for general events from supported games, such as game launch or exit.
 * - This can be used to trigger seamless recording as the game is loaded or alternately to start a replay and later trigger capture during appropriate moments.
 * 
 * ### Usage stats
 * 
 * While the recorder is actively recording, usage stats are provided such as:
 * 
 * - CPU & memory usage.
 * - Available disk space.
 * - Active FPS.
 * - Dropped frames information.
 * 
 * ## Example
 * 
 * Use the recording APIs with game events supplied by the [Game Events Provider](../../../live-game-data-gep/live-game-data-gep-intro.mdx) to create apps that can record video game play based on game events. This [sample app](https://github.com/overwolf/ow-electron-packages-sample) has a recording feature.
 * 
 * @packageDocumentation
 */

/**
 * Defines a rectangle by specifying its top-left coordinates and dimensions.
 *
 * Typically used for representing positions and sizes of elements or windows.
 *
 * @property top - The vertical coordinate of the top edge of the rectangle.
 * @property left - The horizontal coordinate of the left edge of the rectangle.
 * @property width - The width of the rectangle.
 * @property height - The height of the rectangle.
 *
 * @example
 * const rect: Rect = { top: 100, left: 50, width: 300, height: 200 };
 */
type Rect = { top: number; left: number; width: number; height: number };



/**
 * Defines the type of an audio device.
 * 
 * Defined as either and **input** device (e.g., microphone)
 * or an **output** device (e.g., speakers or headphones).
 *
 * @example
 * function setDevice(type: AudioDeviceType) {
 *   if (type === 'input') {
 *     console.log('Microphone selected');
 *   } else {
 *     console.log('Speaker selected');
 *   }
 * }
 */
type AudioDeviceType = 'input' | 'output';



/**
 * All available supported encoder types for video recording or streaming.
 *
 * These encoder identifiers are used to configure the encoding backend for tools like OBS.
 * Note that older `jim_*` encoder types were deprecated as of OBS version 0.31.0
 * and have been replaced by the `obs_nvenc_*` family of encoders.
 *
 * @remarks
 * This type includes software-based encoders (like `obs_x264`) and
 * hardware-accelerated encoders for various platforms (e.g., NVENC, QSV, AMF).
 *
 * @example
 * const encoder: kSupportedEncodersTypes = 'obs_nvenc_h264_tex';
 */
type kSupportedEncodersTypes =
/**
   * Software AV1 encoder using Intel's SVT-AV1 via FFmpeg.
   */
  | 'ffmpeg_svt_av1'
  /**
   * Software AV1 encoder using AOMedia's libaom via FFmpeg.
   */
  | 'ffmpeg_aom_av1'
  /**
   * Software H.264 encoder using the x264 library (CPU-based).
   */
  | 'obs_x264'
  /**
   * Hardware-accelerated H.264 encoder using AMD's AMF with texture input.
   */
  | 'h264_texture_amf'
  /**
   * Hardware-accelerated H.265 (HEVC) encoder using AMD's AMF with texture input.
   */
  | 'h265_texture_amf'
  /**
   * Hardware-accelerated AV1 encoder using AMD's AMF with texture input.
   */
  | 'av1_texture_amf'
  /**
   * Hardware-accelerated H.264 encoder using Intel's QSV 1.1 API.
   */
  | 'obs_qsv11_v2'
  /**
   * Hardware-accelerated H.265 (HEVC) encoder using Intel's QSV 1.1 API.
   */
  | 'obs_qsv11_hevc'
  /**
   * Hardware-accelerated AV1 encoder using Intel's QSV 1.1 API.
   */
  | 'obs_qsv11_av1'
  /**
   * Hardware-accelerated H.264 encoder using NVIDIA's NVENC with texture input.
   */
  | 'obs_nvenc_h264_tex'
  /**
   * Hardware-accelerated H.265 (HEVC) encoder using NVIDIA's NVENC with texture input.
   */
  | 'obs_nvenc_hevc_tex'
  /**
   * Hardware-accelerated AV1 encoder using NVIDIA's NVENC with texture input.
   */
  | 'obs_nvenc_av1_tex';


/**
 * List of audio encoder types available via FFmpeg.
 *
 * Typically used for exporting or streaming audio content in different formats.
 * Each variant maps to a specific FFmpeg audio codec.
 *
 * @remarks
 * If a custom encoder is used that is not in this predefined list, it can be specified as a `string`.
 *
 * @example
 * const audioEncoder: kKnownAudioEncodersTypes = 'ffmpeg_opus';
 */
type kKnownAudioEncodersTypes =
   /**
   * AAC (Advanced Audio Coding) encoder using FFmpeg.
   * Widely supported across platforms; good balance of quality and compression.
   */
  | 'ffmpeg_aac'

  /**
   * Opus encoder using FFmpeg.
   * High-efficiency codec commonly used for voice and streaming (e.g., Discord, WebRTC).
   */
  | 'ffmpeg_opus'

  /**
   * PCM (Pulse-code Modulation) 16-bit signed little-endian.
   * Uncompressed audio with moderate file size; excellent compatibility.
   */
  | 'ffmpeg_pcm_s16le'

  /**
   * PCM 24-bit signed little-endian.
   * Higher-resolution uncompressed audio format, often used in professional audio applications.
   */
  | 'ffmpeg_pcm_s24le'

  /**
   * PCM 32-bit floating-point little-endian.
   * Offers high dynamic range; used for precision in audio processing workflows.
   */
  | 'ffmpeg_pcm_f32le'

  /**
   * Apple Lossless Audio Codec (ALAC) encoder via FFmpeg.
   * Provides lossless compression; typically used in the Apple ecosystem.
   */
  | 'ffmpeg_alac'

  /**
   * FLAC (Free Lossless Audio Codec) encoder via FFmpeg.
   * Popular open-source lossless format with good compression and widespread support.
   */
  | 'ffmpeg_flac'

  /**
   * Custom or unknown encoder type represented as a string.
   */
  | string;

/**
 * Fixed audio sample rate of 48kHz.
 *
 * Commonly used in professional audio and video recording, broadcasting,
 * and streaming. Offers a balance between quality and performance, and is
 * often the default sample rate in real-time communication systems.
 *
 * @example
 * const sampleRate: kSampleRate48kHz = 48000;
 */
type kSampleRate48kHz = 48000;

/**
 * Fixed audio sample rate of 44.1 kHz.
 *
 * This is the standard sample rate used for audio CDs and is commonly used
 * in music production and general-purpose audio playback.
 *
 * @example
 * const sampleRate: kSampleRate441kHz = 44100;
 */
type kSampleRate441kHz = 44100;



/**
 * Supported speaker layout configurations.
 *
 * These layout identifiers correspond to common channel arrangements used in audio output systems.
 * They are typically used to configure spatial audio or multichannel playback environments.
 *
 * @example
 * const layout: kSpeakerLayout = 'SPEAKERS_5POINT1';
 */
type kSpeakerLayout =
   /**
   * Mono output — single audio channel.
   */
  | 'SPEAKERS_MONO'
  /**
   * Stereo output — standard left and right channels.
   */
  | 'SPEAKERS_STEREO'
  /**
   * 2.1 output — stereo plus one subwoofer (LFE) channel.
   */
  | 'SPEAKERS_2POINT1'
  /**
   * 4.0 output — quadraphonic layout with front and rear left/right channels.
   */
  | 'SPEAKERS_4POINT0'
  /**
   * 4.1 output — quadraphonic layout plus one subwoofer channel.
   */
  | 'SPEAKERS_4POINT1'
  /**
   * 5.1 surround — front left/right, center, rear left/right, and subwoofer (LFE).
   */
  | 'SPEAKERS_5POINT1'
  /**
   * 7.1 surround — front left/right, center, rear left/right, side left/right, and subwoofer (LFE).
   */


/**
 * A utility class for defining named color constants.
 *
 * This example class provides predefined color values
 * that can be reused across the application.
 *
 * @example
 * const color = Colors.Red;
 */
  declare class Colors {
  /**
   * Represents the color red.
   */  
  public static readonly Red = 'Red';
}

/**
 * Audio track selection flags.
 *
 * Each value corresponds to a specific audio track using a bitmask format.
 * You can combine tracks using bitwise OR operations. For example, `Track1 | Track2` is `3`.
 *
 * @remarks
 * - This format is useful when routing or encoding specific audio channels.
 * - The `number` type is included to allow for custom or combined values not explicitly listed.
 *
 * @example
 * const tracks: AudioTracks = 1 | 2; // Track1 and Track2
 */
type AudioTracks =
/**
   * No audio track selected.
   */
  | 0
  /**
   * Select audio Track 1.
   */
  | 1
  /**
   * Select audio Track 2.
   */
  | 2
  /**
   * Select audio Track 3.
   */
  | 4
  /**
   * Select audio Track 4.
   */
  | 8
  /**
   * Select audio Track 5.
   */
  | 16
  /**
   * Select audio Track 6.
   */
  | 32
  /**
   * Select all available tracks (bitmask 0xff).
   */
  | 0xff
  /**
   * Any custom or combined track.
   */
  | number;



/**
 * Available methods for capturing the display in screen recording or streaming.
 *
 * These values determine the underlying capture technology used for grabbing screen content.
 * Selection may depend on hardware support, performance, or compatibility.
 *
 * @example
 * const captureType: DisplayCaptureType = "DXGI";
 */
type DisplayCaptureType = 
  /**
   * Automatically select the best capture method based on the system's capabilities.
   */
  | "Auto"
  /**
   * Use DXGI (DirectX Graphics Infrastructure) for capturing. Offers high performance on supported systems.
   */
  | "DXGI"
  /**
   * Use BitBlt (Bit Block Transfer), a legacy GDI-based capture method. May be less performant.
   */
  | "BitBlt"
  /**
   * Use Windows Graphics Capture (WGC), available on Windows 10+ with improved performance and stability.
   */
  | "WGC";

/**
 * Type of window capture method.
 */
type WindowCaptureType =
  /**
   * Automatically select the best window capture method.
   */
  "Auto"
  /**
   * Use BitBlt (Bit Block Transfer), a legacy GDI-based capture method. May be less performant.
   */
  | "BitBlt"
  /**
   * Use Windows Graphics Capture (WGC), available on Windows 10+ with improved performance and stability.
   */
  | "WGC";

/**
 * Type of source to capture during screen recording or streaming.
 *
 * These source types determine what part of the system the capture engine will target.
 *
 * @example
 * const source: CaptureSourceType = 'Game';
 */
type CaptureSourceType =
  /**
   * Capture the entire display (monitor/screen).
   */
  | 'Display'
  /**
   * Capture a game process or window, often using optimized game capture methods.
   */
  | 'Game'
  /**
   * Capture a specific application window.
   */
  | 'Window';



/**
 * Audio device available on the system.
 *
 * This interface is used to describe both input (e.g., microphones)
 * and output (e.g., speakers, headphones) audio devices.
 *
 * @example
 * const device: AudioDevice = {
 *   type: 'output',
 *   id: 'speakers-1',
 *   name: 'Realtek High Definition Audio',
 *   isDefault: true
 * };
 */
interface AudioDevice {
  /**
     * The type of the audio device (input or output).
     */
  readonly type: AudioDeviceType;

  /**
   * A unique identifier for the audio device.
   */
  readonly id: string;

  /**
   * A human-readable name for the audio device.
   */
  readonly name: string;

  /**
   * Whether this device is currently set as the system default.
   */
  readonly isDefault: boolean;
}

/**
 * The base `structure for an encoder, including codec and display name.
 *
 * This interface provides essential metadata about an encoder, typically used
 * to represent supported encoding options in a recording or streaming application.
 *
 * @example
 * const encoder: EncoderInfoBase = {
 *   codec: 'h264',
 *   name: 'NVIDIA NVENC H.264'
 * };
 */
interface EncoderInfoBase {
  /**
   * The codec identifier (e.g., `h264`, `aac`, `av1`) supported by the encoder.
   */
  readonly codec: string;

  /**
   * A human-readable name for the encoder (e.g., shown in UI).
   */
  readonly name: string;
}

/**
 * Configurable property of an encoder.
 *
 * Used to describe encoder settings such as bitrates, presets, or modes.
 * Provides metadata to help display options in a UI or validate configuration.
 *
 * @example
 * const bitrateProperty: EncoderProperty = {
 *   default: 4500,
 *   description: 'Target video bitrate in kbps.',
 *   values: {
 *     3000: 'Low quality',
 *     4500: 'Medium quality (default)',
 *     6000: 'High quality'
 *   }
 * };
 */
interface EncoderProperty {
  /**
   * The default value for this encoder property.
   */
  readonly default: any;

  /**
   * A human-readable explanation of the property's purpose.
   */
  readonly description: string;

  /**
   * Optional map of possible values to their corresponding display labels.
   * Useful for dropdowns or presets.
   */
  readonly values?: Record<string | number, string>;
}

/**
 * Supported audio encoder information.
 *
 * Extends the base encoder information with a specific encoder type identifier.
 * Useful for populating encoder selection menus or configuring audio output.
 *
 * @extends EncoderInfoBase
 *
 * @example
 * const audioEncoder: AudioEncoderInfo = {
 *   codec: 'aac',
 *   name: 'FFmpeg AAC Encoder',
 *   type: 'ffmpeg_aac'
 * };
 */
interface AudioEncoderInfo extends EncoderInfoBase {
  /**
   * The identifier for the specific audio encoder type.
   * 
   * @see {@link kKnownAudioEncodersTypes}
   */
  readonly type: kKnownAudioEncodersTypes;
}



/**
 * Information for a supported video encoder.
 *
 * This interface extends `EncoderInfoBase` and adds specific information
 * about the video encoder type and any configurable encoder properties.
 *
 * @extends EncoderInfoBase
 *
 * @example
 * const encoderInfo: VideoEncoderInfo = {
 *   codec: 'h264',
 *   name: 'NVIDIA NVENC H.264',
 *   type: 'obs_nvenc_h264_tex',
 *   properties: {
 *     bitrate: {
 *       default: 6000,
 *       description: 'Target video bitrate in kbps.',
 *       values: {
 *         4000: 'Low quality',
 *         6000: 'Medium quality',
 *         8000: 'High quality'
 *       }
 *     }
 *   }
 * };
 */
interface VideoEncoderInfo extends EncoderInfoBase {
  /**
   * The identifier for the specific video encoder type.
   * 
   * @see {@link kSupportedEncodersTypes}
   */
  readonly type: kSupportedEncodersTypes;

  /**
   * Optional map of encoder-specific configuration properties.
   * Each property defines a setting that can be adjusted,
   * such as bitrate, profile, or keyframe interval.
   * 
   * @see {@link EncoderProperty}
   */
  readonly properties?: Record<string, EncoderProperty>;
}


/**
 * Information about a GPU adapter (graphics device).
 *
 * This structure provides metadata such as adapter name, driver, and
 * hardware-accelerated GPU scheduling (HAGS) support.
 *
 * @example
 * const adapter: AdapterInfo = {
 *   index: 0,
 *   name: 'NVIDIA GeForce RTX 3080',
 *   driver: '546.33',
 *   hagsEnabled: true,
 *   hagsEnabledByDefault: false
 * };
 */
interface AdapterInfo {
  /**
   * The index of the adapter (usually starts at 0 for the primary GPU).
   */
  readonly index: 0;

  /**
   * The display name of the GPU adapter.
   */
  readonly name: string;

  /**
   * The version of the GPU driver currently installed.
   */
  readonly driver: string;

  /**
   * Indicates whether Hardware-Accelerated GPU Scheduling (HAGS) is currently enabled.
   */
  readonly hagsEnabled: boolean;

  /**
   * Indicates whether HAGS is enabled by default on this adapter.
   */
  readonly hagsEnabledByDefault: boolean;
}


/**
 * Information about the complete audio configuration,
 * including input/output devices and supported audio encoders.
 *
 * Useful for initializing or inspecting audio capture and encoding settings
 * in applications such as screen recorders or streaming tools.
 *
 * @example
 * const audioInfo: AudioInformation = {
 *   inputDevices: [...],
 *   outputDevices: [...],
 *   encoders: [...],
 *   defaultEncoder: 'ffmpeg_aac'
 * };
 */
interface AudioInformation {
  /**
   * A list of available input audio devices (e.g., microphones).
   * 
   * @see {@link AudioDevice}
   */
  readonly inputDevices: AudioDevice[];

  /**
   * A list of available output audio devices (e.g., speakers, headphones).
   * 
   * @see {@link AudioDevice}
   */
  readonly outputDevices: AudioDevice[];

  /**
   * A list of supported audio encoders available for use.
   * 
   * @see {@link AudioEncoderInfo}
   */
  readonly encoders: AudioEncoderInfo[];

  /**
   * The identifier of the default audio encoder.
   * 
   * @see {@link kKnownAudioEncodersTypes}
   */
  readonly defaultEncoder: kKnownAudioEncodersTypes;
}


/**
 * Information about a display monitor connected to the system.
 *
 * This interface provides technical and user facing properties such as DPI,
 * resolution, display identifiers, and whether it is the primary monitor.
 *
 * @example
 * const monitor: MonitorInfo = {
 *   adapterIndex: 0,
 *   id: 'MONITOR\\GSM5B10\\{4d36e96e-e325-11ce-bfc1-08002be10318}_0',
 *   altId: 'DISPLAY1',
 *   dpi: 96,
 *   attachedToDesktop: true,
 *   friendlyName: 'LG UltraFine 4K',
 *   refreshRate: 60,
 *   rect: { top: 0, left: 0, width: 3840, height: 2160 },
 *   isPrimary: true,
 *   displayIndex: 0
 * };
 */
interface MonitorInfo {
  /**
   * Index of the GPU adapter this monitor is connected to.
   */
  readonly adapterIndex: number;

  /**
   * The full device path or system identifier for the monitor.
   */
  readonly id: string;

  /**
   * An alternative, usually simplified, identifier (e.g., DISPLAY1).
   */
  readonly altId: string;

  /**
   * The DPI (dots per inch) value of the monitor.
   */
  readonly dpi: number;

  /**
   * Indicates whether the monitor is currently attached to the desktop.
   */
  readonly attachedToDesktop: boolean;

  /**
   * A user-friendly name for the monitor (e.g., model name).
   */
  readonly friendlyName: string;

  /**
   * The refresh rate of the monitor in Hz.
   */
  readonly refreshRate: number;

  /**
   * The bounding rectangle of the monitor on the virtual screen.
   */
  readonly rect: Rect;

  /**
   * Whether this monitor is set as the system’s primary display.
   */
  readonly isPrimary: boolean;

  /**
   * The display index assigned to this monitor by the system.
   */
  readonly displayIndex: number;
}

/**
 * Information about the complete video configuration available in the system,
 * including supported video encoders and GPU adapters.
 *
 * Useful for configuring video recording or streaming pipelines,
 * and for providing user-selectable encoder and adapter options.
 *
 * @example
 * const videoInfo: VideoInformation = {
 *   encoders: [...],
 *   adapters: [...],
 *   defaultEncoder: 'obs_nvenc_h264_tex'
 * };
 * 
 */
interface VideoInformation {
  /**
   * A list of supported video encoders that can be used for recording or streaming.
   *
   * @see VideoEncoderInfo
   */
  readonly encoders: VideoEncoderInfo[];

  /**
   * A list of GPU adapters available on the system.
   *
   * @see AdapterInfo
   */
  readonly adapters: AdapterInfo[];

  /**
   * The identifier of the default video encoder selected by the system.
   *
   * @see kSupportedEncodersTypes
   */
  readonly defaultEncoder: kSupportedEncodersTypes;
}

/**
 * Information about the complete recording configuration for the current system.
 *
 * This includes audio device and encoder information, video encoder and GPU adapter details,
 * and connected monitor metadata. Useful for setting up and validating a full recording session.
 *
 * @example
 * const config: RecordingInformation = {
 *   audio: { ... },
 *   video: { ... },
 *   monitors: [ ... ]
 * };
 *
 */
interface RecordingInformation {
  /**
   * Audio-related configuration, including input/output devices and encoders.
   *
   * @see AudioInformation
   */
  audio: AudioInformation;

  /**
   * Video-related configuration, including available encoders and GPU adapters.
   *
   * @see VideoInformation
   */
  video: VideoInformation;

  /**
   * A list of monitors currently connected to the system.
   *
   * @see MonitorInfo
   */
  monitors: MonitorInfo[];
}




/**
 * Video file format options used for recording or exporting.
 *
 * Each format may offer different tradeoffs in terms of compatibility, streaming support,
 * compression, or support for advanced features like fragmentation or hybrid modes.
 *
 * @example
 * const format: kFileFormat = 'mp4';
 */
type kFileFormat =
  /**
   * Fragmented MP4 — Ideal for adaptive streaming and progressive download scenarios.
   */
  | 'fragmented_mp4'

  /**
   * Fragmented MOV — Similar to fragmented MP4 but uses the .mov container format.
   */
  | 'fragmented_mov'

  /**
   * Standard MP4 — Widely supported container for high-quality compressed video and audio.
   */
  | 'mp4'

  /**
   * FLV — Flash Video format, legacy support for some live streaming services.
   */
  | 'flv'

  /**
   * MKV — Matroska container supporting multiple audio, video, and subtitle tracks.
   */
  | 'mkv'

  /**
   * MOV — Apple's QuickTime format, often used in macOS video workflows.
   */
  | 'mov'

  /**
   * MPEG-TS — Transport stream format suitable for broadcasting or continuous streaming.
   */
  | 'mpegts'

  /**
   * HLS — HTTP Live Streaming; produces a playlist with segmented video chunks.
   */
  | 'hls'

  /**
   * Hybrid MP4 — A format combining fragmented and standard MP4 traits for compatibility.
   */
  | 'hybrid_mp4';

/**
 * Supported video color formats used during video encoding or capture.
 *
 * Each format defines how color and luminance information is represented in memory.
 * Choice of format can affect performance, quality, and hardware compatibility.
 *
 * @example
 * const colorFormat: kVideoColorFormat = 'NV12';
 */
type kVideoColorFormat =
  /**
   * NV12 — 8-bit YUV format with planar Y and interleaved UV planes.
   * Commonly used in hardware-accelerated video processing.
   */
  | 'NV12'

  /**
   * I420 — 8-bit planar YUV format with 4:2:0 chroma subsampling.
   * Widely supported and efficient for compression.
   */
  | 'I420'

  /**
   * I444 — 8-bit planar YUV format with full 4:4:4 chroma (no subsampling).
   * Offers highest color fidelity, useful for post-production.
   */
  | 'I444'

  /**
   * P010 — 10-bit packed YUV 4:2:0 format.
   * Suitable for high dynamic range (HDR) workflows.
   */
  | 'P010'

  /**
   * I010 — 10-bit planar YUV 4:2:0 format.
   * Provides better color depth while retaining planar layout.
   */
  | 'I010'

  /**
   * P216 — 16-bit packed YUV 4:2:2 format.
   * Offers higher color resolution, used in professional capture scenarios.
   */
  | 'P216'

  /**
   * P416 — 16-bit packed YUV 4:4:4 format.
   * Ideal for precise color reproduction and advanced editing.
   */
  | 'P416'

  /**
   * BGRA — 8-bit packed RGB format with alpha channel.
   * Used in real-time rendering and desktop capture.
   */
  | 'BGRA';


/**
 * Defines the color specification used for encoding or rendering video.
 *
 * These color specs represent standardized color spaces and transfer functions
 * used in video encoding pipelines. Choosing the appropriate spec impacts color
 * accuracy and display compatibility, especially for HDR or broadcast workflows.
 *
 * @example
 * const colorSpec: kVideoColorSpec = '709';
 */
type kVideoColorSpec =
  /**
   * sRGB — Standard RGB color space used for web content and computer monitors.
   * Matches the typical display profile of non-HDR screens.
   */
  | 'sRGB'

  /**
   * 709 — Rec. 709 color space used for HDTV and most modern video production.
   * Offers better color range and gamma than older standards.
   */
  | '709'

  /**
   * 601 — Rec. 601 color space used in standard-definition television (SDTV).
   * Suitable for legacy content or older broadcast systems.
   */
  | '601'

  /**
   * 2100PQ — Rec. 2100 color spec using PQ (Perceptual Quantizer) transfer function.
   * Used for HDR10 and other HDR video delivery standards.
   */
  | '2100PQ'

  /**
   * 2100HLG — Rec. 2100 color spec using HLG (Hybrid Log-Gamma) transfer function.
   * HDR-compatible and backward-compatible with SDR displays.
   */
  | '2100HLG';

/**
 * Specifies the color range used during video capture or encoding.
 *
 * This setting determines how color values are scaled, which impacts brightness
 * and contrast. It is important to match the color range to the target display
 * or encoder to avoid washed-out or crushed colors.
 *
 * @example
 * const range: kVideoColorRange = 'Full';
 */
type kVideoColorRange =
  /**
   * Partial — Uses limited color range (typically 16–235 for luma),
   * common in broadcast and traditional video content.
   */
  | 'Partial'

  /**
   * Full — Uses the full color range (0–255),
   * typical for computer monitors and PC gaming content.
   */
  | 'Full';

/**
 * Defines supported AMD encoder rate control methods.
 *
 * Rate control modes determine how bitrate is managed during video encoding,
 * affecting quality, file size, and encoding performance.
 * These values are specific to AMD's video encoding capabilities.
 *
 * @example
 * const rateControl: kAMDEncoderRateControl = 'CBR';
 */
type kAMDEncoderRateControl =
  /**
   * CBR — Constant Bitrate.
   * Maintains a fixed bitrate for consistent file size and streaming bandwidth.
   */
  | 'CBR'

  /**
   * CQP — Constant Quantization Parameter.
   * Uses a fixed quantizer value, offering consistent visual quality but variable bitrate.
   */
  | 'CQP'

  /**
   * VBR — Variable Bitrate.
   * Bitrate adjusts based on complexity of the content, balancing quality and size.
   */
  | 'VBR'

  /**
   * VBR_LAT — Variable Bitrate with low-latency tuning.
   * Optimized for low-latency scenarios like real-time streaming.
   */
  | 'VBR_LAT'

  /**
   * QVBR — Quality-defined Variable Bitrate.
   * Maintains a target visual quality level rather than a specific bitrate.
   */
  | 'QVBR'

  /**
   * HQVBR — High-Quality Variable Bitrate.
   * Prioritizes visual fidelity while allowing variable bitrate.
   */
  | 'HQVBR'

  /**
   * HQCBR — High-Quality Constant Bitrate.
   * Delivers consistent bitrate while maximizing encoding quality.
   */
  | 'HQCBR';

/**
 * Specifies the encoding performance preset for AMD hardware encoders.
 *
 * These presets control the balance between encoding speed and visual quality.
 * Useful when tuning encoder behavior for different use cases such as streaming or local recording.
 *
 * @example
 * const preset: kAMDEncoderPreset = 'balanced';
 */
type kAMDEncoderPreset =
  /**
   * `quality` — Prioritizes the best possible image quality.
   * May result in slower encoding speeds.
   */
  | 'quality'

  /**
   * `balanced` — Offers a tradeoff between quality and speed.
   * Suitable for most general-purpose use cases.
   */
  | 'balanced'

  /**
   * `speed` — Optimized for fastest encoding performance.
   * May reduce image quality in favor of lower latency and CPU/GPU usage.
   */
  | 'speed';

/**
 * Defines available encoding presets for AMD AV1 hardware encoders.
 *
 * This type extends the standard AMD encoder presets with an additional
 * `highQuality` option, specific to AV1 encoding, providing enhanced quality settings.
 *
 * Useful for selecting the appropriate tradeoff between encoding speed and visual fidelity
 * when using the AV1 codec on supported AMD hardware.
 *
 * @example
 * const preset: kAMDEncoderPresetAV1 = 'highQuality';
 *
 * @see kAMDEncoderPreset
 */
type kAMDEncoderPresetAV1 = kAMDEncoderPreset | 'highQuality';

/**
 * Specifies the AV1 encoding profile for AMD hardware encoders.
 *
 * Encoding profiles define the set of coding tools and constraints used during video compression.
 * The `main` profile is currently the primary and most widely supported AV1 profile.
 *
 * @example
 * const profile: kAMDEncoderProfileAV1 = 'main';
 */
type kAMDEncoderProfileAV1 = 'main';



/**
 * Specifies the H.264 encoding profiles supported by AMD hardware encoders.
 *
 * Encoding profiles define the feature set and capabilities used during compression,
 * impacting compatibility, quality, and efficiency. This type includes standard H.264 profiles,
 * as well as the AV1 `main` profile reused for structural consistency.
 *
 * @example
 * const profile: kAMDEncoderProfile264 = 'high';
 *
 * @see kAMDEncoderProfileAV1
 */
type kAMDEncoderProfile264 =
  /**
   * `main` — The AV1 main profile reused here for structural consistency.
   * Typically not used with H.264 but may appear in shared configuration types.
   */
  | kAMDEncoderProfileAV1

  /**
   * `high` — Offers the best visual quality and compression efficiency.
   * Commonly used for high-definition video applications.
   */
  | 'high'

  /**
   * `baseline` — Provides the most basic H.264 features.
   * Suitable for low-complexity or real-time encoding scenarios.
   */
  | 'baseline';

/**
 * Specifies the rate control modes supported by NVIDIA's NVENC encoder.
 *
 * Rate control modes define how the encoder manages bitrate and quality.
 * Choosing the appropriate mode depends on the desired balance between quality, file size, and real-time performance.
 *
 * @example
 * const rateControl: kNVENCEncoderRateControl = 'CQP';
 */
type kNVENCEncoderRateControl =
  /**
   * `CBR` — Constant Bitrate. Maintains a consistent bitrate throughout the recording.
   * Useful for streaming and bandwidth-limited scenarios.
   */
  | 'CBR'

  /**
   * `CQP` — Constant Quantization Parameter. Prioritizes visual quality by keeping a consistent quantization level.
   * File sizes may vary significantly.
   */
  | 'CQP'

  /**
   * `VBR` — Variable Bitrate. Adjusts bitrate dynamically based on scene complexity.
   * Provides better compression but less predictability in file size.
   */
  | 'VBR'

  /**
   * `Lossless` — Encodes without compression loss.
   * Produces very high-quality output at the cost of large file sizes.
   */
  | 'Lossless';

/**
 * Specifies the multipass encoding mode for NVIDIA's NVENC encoder.
 *
 * Multipass encoding improves visual quality by analyzing the video in multiple passes
 * to better allocate bitrate and compression decisions.
 *
 * @example
 * const multipass: kNVENCEncoderMultipass = 'qres';
 */
type kNVENCEncoderMultipass =
  /**
   * `qres` — Quarter-resolution first pass followed by full-resolution encoding.
   * Offers a good balance between speed and improved quality.
   */
  | 'qres'

  /**
   * `fullres` — Full-resolution multipass encoding.
   * Produces the highest quality results but increases encoding time.
   */
  | 'fullres'

  /**
   * `disabled` — Multipass is turned off.
   * Results in faster encoding at the potential cost of lower quality.
   */
  | 'disabled';

/**
 * Specifies tuning presets for NVIDIA's NVENC encoder.
 *
 * Tuning presets allow the encoder to optimize for specific use cases like high quality or low latency,
 * adjusting internal settings accordingly.
 *
 * @example
 * const tuning: kNVENCEncoderTuning = 'll';
 */
type kNVENCEncoderTuning =
  /**
   * `hq` — High Quality. Prioritizes visual quality over latency.
   * Ideal for recording or broadcasting when minimal delay is not critical.
   */
  | 'hq'

  /**
   * `ll` — Low Latency. Balances quality and latency.
   * Suitable for interactive streaming and real-time applications.
   */
  | 'll'

  /**
   * `ull` — Ultra Low Latency. Minimizes delay as much as possible.
   * Best used in competitive gaming or remote control scenarios.
   */
  | 'ull';

/**
 * Controls the H.264 bitstream profile used by NVENC,
 * affecting decoder compatibility and compression efficiency. `main` is the
 * broad-compatibility choice and is commonly the default in OBS for NVENC.
 */
type kNVENCEncoderProfile = 'main';

/**
 * Specifies the supported H.264 encoding profiles for NVIDIA's NVENC encoder.
 *
 * These profiles determine the features used in encoding and the compatibility of the resulting stream or file.
 * This type extends the base `kNVENCEncoderProfile` and includes commonly used H.264 profiles.
 *
 * @example
 * const profile: kNVENCEncoderProfile264 = 'high';
 *
 * @see kNVENCEncoderProfile
 */
type kNVENCEncoderProfile264 =
  /**
   * `kNVENCEncoderProfile` — Base set of encoder profiles (e.g., `main`).
   * May include additional shared or AV1-specific variants.
   */
  | kNVENCEncoderProfile

  /**
   * `high` — Supports the most advanced H.264 features.
   * Recommended for high-definition video with better compression efficiency.
   */
  | 'high'

  /**
   * `baseline` — Basic H.264 profile with minimal compression features.
   * Best for low-latency and real-time video applications.
   */
  | 'baseline';

/**
 * Specifies the supported HEVC (H.265) encoding profiles for NVIDIA's NVENC encoder.
 *
 * These profiles determine the compression capabilities, color depth, and compatibility of the HEVC stream.
 * This type extends `kNVENCEncoderProfile` and includes 10-bit support via `main10`.
 *
 * @example
 * const profile: kNVENCEncoderProfileHEVC = 'main10';
 *
 * @see kNVENCEncoderProfile
 */
type kNVENCEncoderProfileHEVC =
  /**
   * `kNVENCEncoderProfile` — Base HEVC profile, typically includes `main`.
   * Suitable for standard 8-bit HEVC encoding.
   */
  | kNVENCEncoderProfile

  /**
   * `main10` — Enables 10-bit color depth for enhanced video quality and HDR compatibility.
   */
  | 'main10';

/**
 * Specifies the available rate control modes for the x264 encoder.
 *
 * Rate control modes determine how the encoder manages bitrate and quality over time.
 * Each mode offers a different balance between output file size, quality, and encoding speed.
 *
 * @example
 * const rateControl: kX264EncoderRateControl = 'CRF';
 */
type kX264EncoderRateControl =
  /**
   * `CBR` — Constant Bitrate. Maintains a fixed bitrate throughout encoding.
   * Useful for streaming where bandwidth predictability is important.
   */
  | 'CBR'

  /**
   * `ABR` — Average Bitrate. Tries to maintain a target average bitrate across the whole stream.
   * Balances quality and file size over long durations.
   */
  | 'ABR'

  /**
   * `VBR` — Variable Bitrate. Allows the bitrate to vary depending on frame complexity.
   * Offers better quality at lower file sizes, but less predictable bandwidth usage.
   */
  | 'VBR'

  /**
   * `CRF` — Constant Rate Factor. Targets a consistent visual quality instead of bitrate.
   * Ideal for scenarios where quality is more important than file size.
   */
  | 'CRF';

/**
 * Specifies the H.264 encoding profiles available for the x264 encoder.
 *
 * Encoding profiles define the set of features used for compression and compatibility
 * with various playback devices and streaming platforms.
 *
 * @example
 * const profile: kX264EncoderProfile = 'high';
 */
type kX264EncoderProfile =
  /**
   * `''` — Default profile. Lets the encoder decide which profile to use automatically.
   */
  | ''

  /**
   * `baseline` — Provides basic H.264 features.
   * Suitable for low-complexity, real-time, or legacy device compatibility scenarios.
   */
  | 'baseline'

  /**
   * `main` — Supports interlaced video and enhanced compression.
   * Recommended for general-purpose encoding with balanced quality and performance.
   */
  | 'main'

  /**
   * `high` — Enables advanced compression features for better video quality.
   * Ideal for HD content, streaming, or high-quality recording.
   */
  | 'high';



/**
 * Specifies the tuning presets for the x264 encoder.
 *
 * Tuning options help optimize the encoder's performance for specific types of content or use cases.
 * These settings adjust internal compression behavior and rate-distortion tradeoffs.
 *
 * @example
 * const tune: kX264EncoderTune = 'animation';
 */
type kX264EncoderTune =
  /**
   * `''` — Default. No tuning applied; encoder uses standard compression behavior.
   */
  | ''

  /**
   * `film` — Optimizes for live-action, natural footage.
   * Preserves fine grain and cinematic detail.
   */
  | 'film'

  /**
   * `animation` — Optimizes for animated content.
   * Enhances compression of solid colors and repetitive patterns.
   */
  | 'animation'

  /**
   * `grain` — Preserves film grain.
   * Reduces temporal blurring at the cost of larger file sizes.
   */
  | 'grain'

  /**
   * `stillimage` — Optimizes for individual image compression.
   * Suitable for slideshow or low-motion content.
   */
  | 'stillimage'

  /**
   * `psnr` — Optimizes for peak signal-to-noise ratio (PSNR).
   * Prioritizes objective video quality metrics.
   */
  | 'psnr'

  /**
   * `ssim` — Optimizes for structural similarity index (SSIM).
   * Targets better perceptual quality over raw pixel accuracy.
   */
  | 'ssim'

  /**
   * `fastdecode` — Reduces computational load on decoders.
   * Disables features that are hard to decode quickly.
   */
  | 'fastdecode'

  /**
   * `zerolatency` — Minimizes latency for real-time streaming.
   * Reduces buffering and introduces faster frame delivery.
   */
  | 'zerolatency';

/**
 * Specifies the encoding speed and compression efficiency preset for the x264 encoder.
 *
 * Faster presets use less CPU but result in lower compression efficiency (larger files),
 * while slower presets use more CPU to produce better compression and quality.
 *
 * @example
 * const preset: kX264EncoderPreset = 'veryfast';
 */
type kX264EncoderPreset =
  /**
   * `ultrafast` — Lowest CPU usage and fastest encoding speed.
   * Produces larger file sizes and lower compression quality.
   */
  | 'ultrafast'

  /**
   * `superfast` — Very fast encoding with slightly better compression than `ultrafast`.
   */
  | 'superfast'

  /**
   * `veryfast` — A good balance between speed and quality.
   * Commonly used default setting.
   */
  | 'veryfast'

  /**
   * `faster` — Slightly slower than `veryfast` with improved compression.
   */
  | 'faster'

  /**
   * `fast` — Offers better compression efficiency than `faster` at the cost of more CPU.
   */
  | 'fast'

  /**
   * `medium` — Default preset for x264.
   * Balances speed and quality effectively.
   */
  | 'medium'

  /**
   * `slow` — Slower encoding for better compression and video quality.
   */
  | 'slow'

  /**
   * `slower` — Even better compression at the cost of more processing time.
   */
  | 'slower'

  /**
   * `veryslow` — Maximizes compression efficiency and visual quality.
   * Suitable for archival or final delivery.
   */
  | 'veryslow'

  /**
   * `placebo` — Insanely slow with minimal improvement over `veryslow`.
   * Generally not recommended due to diminishing returns.
   */
  | 'placebo';


/**
 * Specifies the supported HEVC (H.265) encoder profiles for Intel Quick Sync Video.
 * 
 * This is an alias of `kNVENCEncoderProfileHEVC` to maintain compatibility
 * across encoder configurations while reusing the same profile definitions.
 *
 * @see kNVENCEncoderProfileHEVC
 *
 * @example
 * const profile: kQuickSyncEncoderProfileHEVC = 'main10';
 */
type kQuickSyncEncoderProfileHEVC = kNVENCEncoderProfileHEVC;

/**
 * Specifies the supported H.264 encoder profiles for Intel Quick Sync Video.
 * 
 * This type is an alias of `kNVENCEncoderProfile264`, reusing the same profile definitions 
 * to ensure consistency across encoder implementations.
 *
 * @see kNVENCEncoderProfile264
 *
 * @example
 * const profile: kQuickSyncEncoderProfile264 = 'high';
 */
type kQuickSyncEncoderProfile264 = kNVENCEncoderProfile264;




/**
 * Target usage modes for Intel Quick Sync Video encoders.
 * 
 * Target usage defines a trade-off between encoding speed and output quality.
 * Lower TU values result in better quality but slower performance, while higher values favor speed.
 *
 * @example
 * const usage: kQuickSyncTargetUsage = 'TU4'; // Balanced
 */
type kQuickSyncTargetUsage =
  /** `TU1` — Slowest encoding, best possible quality. */
  | 'TU1'
  /** `TU2` — Slower encoding with slightly reduced quality. */
  | 'TU2'
  /** `TU3` — Slow encoding with good quality. */
  | 'TU3'
  /** `TU4` — Balanced setting offering medium quality and speed. */
  | 'TU4'
  /** `TU5` — Fast encoding with reduced quality. */
  | 'TU5'
  /** `TU6` — Faster encoding with further quality tradeoffs. */
  | 'TU6'
  /** `TU7` — Fastest encoding, lowest quality. */
  | 'TU7';


 // Fastest (Best Speed)

/**
 * Defines the supported rate control modes for Intel Quick Sync Video encoders.
 * 
 * Rate control determines how the bitrate is managed during encoding, impacting quality, file size, and performance.
 *
 * @example
 * const rateControl: kQuickSyncEncoderRateControl = 'CBR';
 */
type kQuickSyncEncoderRateControl =
  /** `CBR` — Constant Bitrate. Maintains a fixed bitrate for predictable file sizes. */
  | 'CBR'
  /** `CQP` — Constant Quantization Parameter. Prioritizes consistent quality over bitrate. */
  | 'CQP'
  /** `VBR` — Variable Bitrate. Adjusts bitrate dynamically for efficient encoding with acceptable quality. */
  | 'VBR'
  /** `ICQ` — Intelligent Constant Quality. Balances quality and bitrate automatically using an internal algorithm. */
  | 'ICQ';

/**
 * Defines the methods available for splitting video recordings.
 * 
 * Splitting can be useful for managing file sizes, organizing segments, or controlling recording behavior dynamically.
 *
 * @example
 * const splitType: VideoRecordingSplitType = 'bySize';
 */
type VideoRecordingSplitType =
  /** `byTime` — Automatically splits the recording into segments based on elapsed time. */
  | 'byTime'
  /** `bySize` — Automatically splits the recording once a specific file size limit is reached. */
  | 'bySize'
  /** `manual` — Splitting is controlled programmatically or by user input. */
  | 'manual';



/**
 * Configuration options for video recording settings.
 *
 * These settings define the input and output resolution, frame rate,
 * and color encoding preferences used during video capture.
 *
 * @see kVideoColorFormat
 * @see kVideoColorRange
 * @see kVideoColorSpec
 */
interface VideoSettings {
  /**
   * Base width resolution of the captured video in pixels.
   * 
   * Used as the reference resolution for scaling output.
   * 
   * @default Half HD (based on main monitor aspect ratio)
   */
  baseWidth: number;

  /**
   * Base height resolution of the captured video in pixels.
   * 
   * Used as the reference resolution for scaling output.
   * 
   * @default Half HD (based on main monitor aspect ratio)
   */
  baseHeight: number;

  /**
   * Video frame rate in frames per second (FPS).
   * 
   * @default 30
   */
  fps?: number;

  /**
   * Output width resolution of the recorded video.
   * 
   * If omitted, it defaults to the value of `baseWidth`.
   */
  outputWidth?: number;

  /**
   * Output height resolution of the recorded video.
   * 
   * If omitted, it defaults to the value of `baseHeight`.
   */
  outputHeight?: number;

  /**
   * Color format used for video encoding.
   * 
   * Determines how pixel color data is structured.
   * 
   * @default 'NV12'
   */
  colorFormat?: kVideoColorFormat;

  /**
   * Defines the color range for video encoding.
   * 
   * Affects the range of brightness and color values.
   * 
   * @default '709'
   */
  colorRange?: kVideoColorRange;

  /**
   * Defines the color specification standard for the video.
   * 
   * Affects tone mapping and interpretation of colors.
   * 
   * @default 'Partial'
   */
  colorSpec?: kVideoColorSpec;

  /**
   * SDR white level, defined in nits.
   * 
   * Affects tone mapping for SDR displays.
   * 
   * @default 300
   */
  sdrWhite?: number;

  /**
   * HDR peak brightness, defined in nits.
   * 
   * Used for tone mapping and color accuracy in HDR content.
   * 
   * @default 1000
   */
  hdrPeak?: number;
}

/**
 * Configuration options for an audio input/output device used during recording or streaming.
 *
 * These settings control audio volume, channel configuration, balance, track routing, and timing behavior.
 *
 * @see AudioTracks
 */
interface AudioDeviceSettings {
  /**
   * Volume level of the audio device.
   * 
   * Accepts values from `0.0` (muted) to `20.0`. 
   * 
   * @default 1.0 (100%)
   */
  volume?: number;

  /**
   * Forces the audio signal to mono.
   * 
   * When enabled, both left and right channels are mixed into a single channel.
   * 
   * @default false
   */
  mono?: boolean;

  /**
   * Stereo balance between left and right channels.
   * 
   * Accepts values from `0.0` (left only) to `1.0` (right only).
   * 
   * @default 0.5 (centered)
   */
  balance?: number;

  /**
   * Audio track routing for the device.
   * 
   * Specifies which audio tracks this device should be recorded into.
   * 
   * @default All tracks
   */
  tracks?: AudioTracks;

  /**
   * Enables synchronization based on the device's internal timing.
   * 
   * When enabled, audio timing will be based on the hardware device's clock.
   * 
   * @default false
   */
  use_device_timing?: boolean;
}



/**
 * Extended audio device configuration that includes identifying information.
 *
 * This interface inherits volume, balance, mono, and track settings from {@link AudioDeviceSettings},
 * and augments it with device identification details such as type, ID, and name.
 *
 * @see AudioDeviceSettings
 * @see AudioDeviceType
 */
interface AudioDeviceSettingsInfo extends AudioDeviceSettings {
  /**
   * Specifies whether the device is an `input` or `output` device.
   */
  readonly type: AudioDeviceType;

  /**
   * Unique identifier of the audio device.
   */
  readonly id: string;

  /**
   * Friendly device name or process name for application-based capture.
   */
  readonly name: string;
}

/**
 * Describes the settings used to update a specific audio device.
 * 
 * Inherits volume, balance, mono, and track options from {@link AudioDeviceSettings},
 * and includes a unique `name` to identify the device or application.
 *
 * @see AudioDeviceSettings
 */
export interface AudioDeviceSettingsUpdateInfo extends AudioDeviceSettings {
  /**
   * Audio device's unique name or the process name (for application-based capture).
   */
  readonly name: string;
}

/**
 * Audio device settings specific to application-based output devices.
 *
 * Extends {@link AudioDeviceSettingsInfo} with a fixed `type` of `'output'`, 
 * representing audio routing for individual applications.
 *
 * Used when configuring output audio for apps rather than hardware devices.
 *
 * @see AudioDeviceSettingsInfo
 */
interface ApplicationAudioDeviceSettingsInfo extends AudioDeviceSettingsInfo {
  /**
   * Device type is fixed as `'output'` for application audio routing.
   */
  readonly type: 'output';
}

/**
 * Configuration options for default audio device behavior.
 *
 * This interface allows specifying how default input and output audio sources 
 * should be routed to audio tracks during recording or streaming.
 */
interface DefaultAudioDeviceParams {
  /**
   * Enables automatic separation of input and output audio into dedicated tracks.
   *
   * When enabled, the default input and output audio sources will be recorded 
   * on separate tracks (tracks 2 and 3), while track 1 will contain a mixed version of both.
   *
   * @default false
   */
  separateAudioTracks?: boolean;
}

/**
 * Parameters for selecting and configuring a specific audio device.
 *
 * Extends {@link DefaultAudioDeviceParams} to optionally control audio track separation
 * and includes identifying information such as device ID and name.
 *
 * This interface is typically used to explicitly define which audio device should be used
 * for input or output in a recording or streaming session.
 *
 * @see DefaultAudioDeviceParams
 */
interface AudioDeviceParams extends DefaultAudioDeviceParams {
  /**
   * The unique identifier of the audio device.
   */
  id: string;

  /**
   * A unique name used to identify the audio device.
   */
  name: string;
}

/**
 * Parameters used to configure audio capture from a specific application.
 *
 * Extends {@link DefaultAudioDeviceParams} to allow optional audio track separation,
 * and specifies the process name of the target application whose audio should be captured.
 *
 * This interface is typically used for capturing output audio from a specific executable,
 * such as `Discord.exe` or `minecraft.exe`.
 *
 * @see DefaultAudioDeviceParams
 */
interface ApplicationAudioCaptureParams extends DefaultAudioDeviceParams {
  /**
   * Name of the application's process to capture audio from.
   *
   * Example values: `'Discord.exe'`, `'minecraft.exe'`.
   */
  processName: string;
}

/**
 * General configuration for audio recording and playback behavior.
 *
 * Defines global audio settings such as sample rate, speaker layout, and system-level audio features.
 * These settings help tailor the audio experience for performance, quality, and platform-specific compatibility.
 */
interface AudioGeneralSettings {
  /**
   * The audio sampling rate to be used.
   * 
   * Supported values are `48000` and `44100`.
   * 
   * @default 48000
   */
  sampleRate?: kSampleRate48kHz | kSampleRate441kHz;

  /**
   * Speaker output layout configuration.
   * 
   * Determines the audio channel distribution (e.g., Stereo, 5.1, Mono).
   * 
   * @default 'SPEAKERS_STEREO'
   */
  speakerLayer?: kSpeakerLayout;

  /**
   * Disables Windows' automatic audio ducking behavior.
   * 
   * This is a Windows-only setting. When enabled, the system will not reduce the volume of other apps
   * during voice communications or high-priority sounds.
   * 
   * @default true
   */
  disableAudioDucking?: boolean;

  /**
   * Enables or disables low-latency audio buffering.
   * 
   * When enabled, this reduces audio delay but may increase CPU usage.
   */
  lowLatencyAudioBuffering?: boolean;
}
/**
 * Defines the alignment options specifying a position by using [Vertical][Horizontal]
 * (e.g., 'TopLeft', 'Center', 'BottomRight'). Typically used for positioning
 * UI elements, popovers, or text blocks.
 */
export declare type AlignmentOptions =
  | 'TopLeft'
  | 'TopCenter'
  | 'TopRight'
  | 'CenterLeft'
  | 'Center'
  | 'CenterRight'
  | 'BottomLeft'  
  | 'BottomCenter'
  | 'BottomRight';

/**
 * Defines the type of bounding or scaling applied to an element's dimensions
 * within a container.
 *
 * Typically used to control how content (like an image or video)
 * is resized to fit or fill a specific area.
 */
export declare type BoundsType =
  | 'None'
  | 'Stretch'
  | 'ScaleInner'
  | 'ScaleOuter'
  | 'ScaleToWidth'
  | 'ScaleToHeight'
  | 'MaxOnly';

/**
 * Options for transforming and positioning a source element (e.g. an image or video) within an output container or scene.
 * 
 * Typically used to control how content is translated, scaled, rotated, aligned,
 * and cropped within a visual presentation area.
 */
export interface SourceTransformOptions {
  /**
   * Position X in pixels. Default is 0.
   */
  positionX?: number;

  /**
   * Position Y in pixels. Default is 0.
   */
  positionY?: number;

  /**
   * Rotation in degrees (-360.0 to 360.0). Default is 0.
   */
  rotation?: number;

  /**
   * Size Width in pixels.
   */
  sizeWidth?: number;

  /**
   * Size Height in pixels.
   */
  sizeHeight?: number;

  /**
   * Alignment of the source within the output.
   * The alignment is relative to the top-left corner of the output.
   *
   * Default is TopLeft.
   */
  alignment?: AlignmentOptions;

  /**
   * Defines a bounding box for the source within the output.
   *
   * Changing the bounds type or alignment only has an effect
   * if a bounds width or height is specified.
   *
   * Type of bounds to apply.
   * Default is None.
   */
  boundsType?: BoundsType;

  /**
   * Alignment of the source within the bounding box.
   * 
   * Relevant only when bounds width or height are defined.
   * Default is Center.
   */
  boundsAlignment?: AlignmentOptions;

  /**
   * Bounding box width in pixels.
   */
  boundsWidth?: number;

  /**
   * Bounding box height in pixels.
   */
  boundsHeight?: number;

  /**
   * Crop to bounds. Default is False.
   */
  cropToBounds?: boolean;

  /**
   * Crop options in pixels. Default is no crop.
   */
  cropLeft?: number;
  cropRight?: number;
  cropTop?: number;
  cropBottom?: number;
}

/**
 * Defines a complete transformation operation to be applied to a specific source element.
 *
 * Typically used on a target source by its name with the full set of
 * transformation and positioning properties it should adopt.
 */
export interface SourceTransform {
  /**
   * Source name to update.
   */
  readonly sourceName: string;

  readonly transform: SourceTransformOptions;
}

/**
 * Configuration settings for how a capture source is rendered in the output video.
 *
 * These settings control layout behavior such as stretching and centering the captured
 * content relative to the output resolution.
 */
interface CaptureSourceSettings {
  /**
   * Unique Source name (for easier identification).
   */
  name?: string;

  /**
   * Whether the capture source should be centered and stretched to fit the output video size.
   *
   * When set to `true`, the source will automatically scale and center itself to match
   * the output resolution, even if it requires stretching.
   *
   * @default true (if transform is not provided).
   */
  stretchToOutputSize?: boolean;

  /**
   * Transform options for the source.
   */
  transform?: SourceTransformOptions;
}

/**
 * Settings specific to capturing a monitor display as a video source.
 *
 * Extends {@link CaptureSourceSettings} to include monitor-specific options such as display ID,
 * capture method, cursor visibility, and optional SDR enforcement.
 *
 * These settings define how the monitor content should be captured and rendered in the final output.
 *
 * @see CaptureSourceSettings
 */
interface MonitorCaptureSourceSettings extends CaptureSourceSettings {
  /**
   * The identifier of the monitor to capture.
   *
   * This should match a valid monitor ID retrieved from system monitor info.
   */
  monitorId: string;

  /**
   * The method or API used to capture the monitor content.
   *
   * Options include `'Auto'`, `'DXGI'`, `'BitBlt'`, and `'WGC'`.
   * 
   * @default 'Auto'
   */
  type?: DisplayCaptureType;

  /**
   * Whether to include the mouse cursor in the captured video.
   *
   * @default true
   */
  captureCursor?: boolean;

  /**
   * Forces capture to standard dynamic range (SDR), disabling HDR tone mapping.
   */
  forceSDR?: boolean;
}

/**
 * Settings for capturing a game window or process as a video source.
 *
 * Extends {@link CaptureSourceSettings} with game-specific capture options including cursor visibility,
 * framerate limits, overlay support, and advanced rendering options such as transparency and HDR.
 *
 * @see CaptureSourceSettings
 */
interface GameCaptureSourceSettings extends CaptureSourceSettings {
  /**
   * The game process to capture.
   * 
   * Can be specified as either a process name (e.g., `'Game.exe'`) or a numeric process ID.
   */
  gameProcess: string | number;

  /**
   * Enables compatibility mode for systems using SLI (Scalable Link Interface).
   * 
   * When enabled, uses shared memory for a slower but more stable capture.
   */
  sliCompatibility?: boolean;

  /**
   * Whether to include the mouse cursor in the game capture.
   *
   * @default true
   */
  captureCursor?: boolean;

  /**
   * Enables transparency support in the captured content.
   * 
   * Useful for capturing games with transparent or alpha-blended visuals.
   */
  allowTransparency?: boolean;

  /**
   * If enabled, assumes alpha values are premultiplied into the RGB channels.
   * 
   * Recommended when using transparent capture for proper blending.
   */
  premultipliedAlpha?: boolean;

  /**
   * If `true`, attempts to capture overlays rendered by third-party applications (e.g., Discord, Steam).
   */
  captureOverlays?: boolean;

  /**
   * If `true`, limits the capture frame rate to reduce system load.
   */
  limitFramerate?: boolean;

  /**
   * Enables Rec.2100 PQ color space (`rgb10a2`) instead of sRGB for HDR-capable games.
   *
   * Useful for accurate color representation in high dynamic range rendering.
   */
  rgb10a2Space?: boolean;
}

/**
 * Settings for capturing a specific window as a video source.
 *
 * Extends {@link CaptureSourceSettings} with window-specific capture options, including capture method,
 * process identification, cursor visibility, and display compatibility.
 *
 * @see CaptureSourceSettings
 */
interface WindowCaptureSourceSettings extends CaptureSourceSettings {
  /**
   * The name of the executable associated with the window to capture.
   *
   * This is typically the process name (e.g., `"notepad.exe"` or `"chrome.exe"`).
   *
   * Mandatory field when using Window Capture source.
   * Optional when using Browser Window source.
   */
  executable?: string;

  /**
   * The window title, if multiple windows of the same executable exist.
   */
  windowTitle?: string;

  /**
   * The capture method used to record the window.
   *
   * Options depend on system capabilities and may include `'Auto'`, `'BitBlt'`, or `'WGC'` (Windows Graphics Capture).
   *
   * @default 'Auto'
   */
  type?: WindowCaptureType;

  /**
   * Whether to include the mouse cursor in the window capture.
   *
   * @default true
   */
  captureCursor?: boolean;

  /**
   * If `true`, forces capture to standard dynamic range (SDR),
   * disabling high dynamic range output if the window supports it.
   */
  forceSDR?: boolean;

  /**
   * If `true`, captures only the client area of the window (excluding borders and title bar).
   *
   * @default true
   */
  clientArea?: boolean;

  /**
   * Enables BitBlt compatibility mode for multi-GPU (multi-adapter) setups.
   *
   * May improve stability when using traditional window capture on systems with more than one GPU.
   */
  compatibility?: boolean;
}

/**
 * Information about a generic capture source configuration, used for identifying and configuring
 * a video capture input such as a display, game, or application window.
 */
interface CaptureSource {
  /**
   * The type of capture source.
   *
   * Indicates the origin of the capture, such as `'Display'`, `'Game'`, or `'Window'`.
   */
  readonly type: CaptureSourceType;

  /**
   * The configuration properties specific to the capture source.
   *
   * This may include source-specific settings such as resolution, cursor visibility,
   * capture method, and more, depending on the selected source type.
   */
  readonly properties: any;

  /**
   * Optional name for the capture source.
   *
   * Can be used later for setting transform properties.
   */
  readonly name?: string;
}

/**
 * Information about a game-specific capture source configuration.
 *
 * Extends the base {@link CaptureSource} with a fixed type of `'Game'`
 * and specialized properties for capturing game windows or processes.
 */
interface GameCaptureSource extends CaptureSource {
  /**
   * The capture source type.
   *
   * Always set to `'Game'` for this interface.
   */
  readonly type: 'Game';

  /**
   * Settings and options specific to capturing a game.
   *
   * Includes options like process identification, capture transparency,
   * overlay capture, framerate limits, and more.
   *
   * @see GameCaptureSourceSettings
   */
  readonly properties: GameCaptureSourceSettings;
}

/**
 * Information about a display (monitor) capture source configuration.
 *
 * Extends the base {@link CaptureSource} with a fixed type of `'Display'`
 * and detailed settings for capturing a specific monitor.
 */
interface MonitorCaptureSource extends CaptureSource {
  /**
   * The capture source type.
   *
   * Always set to `'Display'` for this interface.
   */
  readonly type: 'Display';

  /**
   * Settings and options specific to capturing a display monitor.
   *
   * Includes options such as monitor ID, capture method (e.g., DXGI, BitBlt),
   * cursor capture, SDR forcing, and more.
   *
   * @see MonitorCaptureSourceSettings
   */
  readonly properties: MonitorCaptureSourceSettings;
}

/**
 * Window-based capture source configuration.
 *
 * Extends {@link CaptureSource} with the `'Window'` type and
 * configuration options for capturing a specific application window.
 */
interface WindowCaptureSource extends CaptureSource {
  /**
   * The capture source type.
   *
   * Always set to `'Window'` for this interface.
   */
  readonly type: 'Window';

  /**
   * Configuration settings for window capture.
   *
   * Includes executable name, capture method (e.g., WGC or BitBlt),
   * cursor capture, SDR mode, and compatibility options.
   *
   * @see WindowCaptureSourceSettings
   */
  readonly properties: WindowCaptureSourceSettings;
}


/**
 * Configuration for all audio-related settings.
 *
 * Extends {@link AudioGeneralSettings} and includes detailed configurations
 * for input devices, output devices, and per-application audio sources.
 */
interface AudioSettings extends AudioGeneralSettings {
  /**
   * List of input audio devices with their settings.
   *
   * Each device includes volume, balance, track routing, and more.
   */
  inputs: AudioDeviceSettingsInfo[];

  /**
   * List of output audio devices with their settings.
   *
   * Covers system speakers or other output channels.
   */
  outputs: AudioDeviceSettingsInfo[];

  /**
   * List of audio capture settings for specific applications.
   *
   * Each entry defines audio configuration for a single app.
   */
  applications: ApplicationAudioDeviceSettingsInfo[];
}

/**
 * Base configuration for video encoder settings.
 *
 * Defines shared properties used across multiple encoder types.
 */
interface VideoEncoderSettingsBase {
  /**
   * The selected video encoder type.
   * 
   * @see {@link kSupportedEncodersTypes}
   */
  type: kSupportedEncodersTypes;

  /**
   * Target encoding bitrate in kilobits per second (kbps).
   *
   * @default 8000
   */
  bitrate?: number;

  /**
   * Keyframe interval, in seconds.
   *
   * Defines how frequently a keyframe (I-frame) is inserted into the video stream.
   * 
   * - `0` — Automatically selected by the encoder.
   * - Recommended values: `2` for high quality/editability, `4` for reduced file size.
   * - `1` — Suitable for short replays or splitting, but more CPU/GPU intensive.
   *
   * Balances quality, file size, and streaming performance.
   */
  keyint_sec?: number;

  /**
   * Maximum bitrate in kilobits per second (kbps).
   *
   * Caps the bitrate for encoders using variable bitrate modes (e.g., VBR).
   */
  max_bitrate?: number;
}

/**
 * NVENC encoder settings.
 *
 * Configuration specific to NVIDIA's NVENC hardware video encoder.
 * Extends base video encoding options.
 */
interface EncoderSettingsNVENC extends VideoEncoderSettingsBase {
  /**
   * Rate control method used by the encoder.
   *
   * Controls how bitrate is allocated during encoding.
   * 
   * @default 'CBR'
   * 
   * @see {@link kNVENCEncoderRateControl}
   */
  rate_control?: kNVENCEncoderRateControl;

  /**
   * Encoding quality preset.
   *
   * Affects encoding speed vs. output quality.
   * 
   * - `'p1'` — Fastest (Lowest Quality)
   * - `'p2'` — Faster (Lower Quality)
   * - `'p3'` — Fast (Low Quality)
   * - `'p4'` — Medium (Medium Quality)
   * - `'p5'` — Slow (Good Quality) _(Default)_
   * - `'p6'` — Slower (Better Quality)
   * - `'p7'` — Slowest (Best Quality)
   *
   * @default 'p5'
   */
  preset?: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

  /**
   * Multipass encoding strategy.
   *
   * - `'qres'` — Two Passes (Quarter Resolution)
   * - `'disabled'` — Single Pass
   * - `'fullres'` — Two Passes (Full Resolution)
   * 
   * @default 'qres'
   * 
   * @see {@link kNVENCEncoderMultipass}
   */
  multipass?: kNVENCEncoderMultipass;

  /**
   * Tuning mode for encoding optimization.
   *
   * Common values:
   * - `'hq'` — High Quality _(Default)_
   * - `'ll'` — Low Latency
   * - `'ull'` — Ultra Low Latency
   *
   * @default 'hq'
   * 
   * @see {@link kNVENCEncoderTuning}
   */
  tune?: kNVENCEncoderTuning;

  /**
   * Enables psycho-visual tuning.
   *
   * Improves perceived visual quality by adjusting bit allocation.
   *
   * @default true
   */
  psycho_aq?: boolean;

  /**
   * Number of B-frames to use.
   *
   * Controls the number of bidirectional frames between I/P frames.
   *
   * @default 2
   */
  bf?: number;

  /**
   * Enables dynamic B-frames (lookahead).
   *
   * If `true`, the encoder dynamically determines the number of B-frames up to `bf`.
   * Improves quality but increases GPU usage.
   *
   * @default false
   */
  lookahead?: boolean;

  /**
   * Index of the GPU used for encoding.
   *
   * Useful when multiple GPUs are installed.
   *
   * @default 0
   */
  gpu?: number;

  /**
   * Encoding profile.
   *
   * Defines the encoding features and compatibility level.
   * 
   * Common options include:
   * - `'baseline'`
   * - `'main'`
   * - `'high'`
   * 
   * @default 'main'
   * 
   * 
   */
  profile?: kNVENCEncoderProfile | string;
}

/**
 * NVENC H.264 encoder settings.
 *
 * Extends `EncoderSettingsNVENC` with options specific to the H.264 codec.
 */
interface EncoderSettingsNVENC264 extends EncoderSettingsNVENC {
  /**
   * H.264 encoding profile.
   *
   * Defines the H.264 feature set and compatibility level.
   * 
   * Common options include:
   * - `'baseline'` — Provides basic compression features. Useful for real-time or low-complexity encoding.
   * - `'main'` — Adds support for interlaced video and enhanced compression.
   * - `'high'` — Offers the best quality and compression efficiency. _(Default)_
   *
   * @default 'high'
   * 
   * @see {@link kNVENCEncoderProfile264}
   */
  profile?: kNVENCEncoderProfile264;
}

/**
 * NVENC HEVC (H.265) encoder settings.
 *
 * Extends `EncoderSettingsNVENC` with options specific to the HEVC codec.
 * 
 * @see {@link EncoderSettingsNVENC}
 */
interface EncoderSettingsNVENCHEVC extends EncoderSettingsNVENC {
  /**
   * HEVC encoding profile.
   *
   * Determines the compression tools and compatibility for H.265 encoding.
   *
   * Options include:
   * - `'main'` — Standard profile for HEVC encoding.
   * - `'main10'` — Enables 10-bit encoding for higher color depth.
   *
   * @default 'main'
   * 
   * @see {@link kNVENCEncoderProfileHEVC}
   */
  profile?: kNVENCEncoderProfileHEVC;
}

/**
 * AMD AMF encoder settings.
 *
 * Defines configuration options for video encoding using AMD's Advanced Media Framework (AMF).
 * Extend this interface when targeting AMD hardware encoders via FFmpeg or native APIs.
 *
 * @see VideoEncoderSettingsBase
 */
interface EncoderSettingsAMF extends VideoEncoderSettingsBase {
  /**
   * Specifies the rate control method used by the encoder.
   *
   * Options include:
   * - `'CBR'` — Constant Bitrate
   * - `'CQP'` — Constant Quantization Parameter
   * - `'VBR'` — Variable Bitrate
   * - `'VBR_LAT'` — Latency-aware VBR
   * - `'QVBR'` — Quality Variable Bitrate
   * - `'HQVBR'` — High Quality VBR
   * - `'HQCBR'` — High Quality Constant Bitrate
   *
   * @default 'CBR'
   * 
   * @see {@link kAMDEncoderRateControl}
   */
  rate_control?: kAMDEncoderRateControl;

  /**
   * Pass custom options directly to the AMF encoder or FFmpeg.
   *
   * This allows advanced tuning or enabling experimental features.
   * Example: `"level=5.2 profile=main"`
   *
   * Refer to AMD AMF documentation for supported flags.
   */
  ffmpeg_opts?: string;

  /**
   * Constant Peak Quantizer (CPQ) value.
   * Determines the quality level when using quantizer-based rate control modes.
   *
   * @default 20
   */
  cpq?: number;

  /**
   * Maximum number of B-frames allowed in the video stream.
   *
   * B-frames improve compression efficiency but may add encoding latency.
   *
   * @default 3
   */
  bf?: number;
}


/**
 * Configuration settings specific to AMD AV1 video encoding.
 *
 * Extends {@link EncoderSettingsAMF} with AV1-specific options for controlling
 * encoding quality and performance.
 *
 * @see kAMDEncoderProfileAV1
 * @see kAMDEncoderPresetAV1
 */
interface EncoderSettingsAMFAV1 extends EncoderSettingsAMF {
  /**
   * The AV1 encoding profile to use.
   * Determines the feature set and compatibility level of the encoded output.
   *
   * @default 'main'
   * @see kAMDEncoderProfileAV1
   */
  profile?: kAMDEncoderProfileAV1;

  /**
   * Controls the encoding preset, balancing speed and quality.
   *
   * @see kAMDEncoderPresetAV1
   */
  preset?: kAMDEncoderPresetAV1;
}

/**
 * Configuration settings for AMD H.264 (AVC) video encoding.
 *
 * Extends {@link EncoderSettingsAMF} to provide H.264-specific options such as
 * profile and encoding preset.
 *
 * @see kAMDEncoderProfile264
 * @see kAMDEncoderPreset
 */
interface EncoderSettingsAMF264 extends EncoderSettingsAMF {
  /**
   * Specifies the H.264 profile to use for encoding.
   * Determines compression efficiency and compatibility.
   *
   * @default 'high'
   * @see kAMDEncoderProfile264
   */
  profile?: kAMDEncoderProfile264;

  /**
   * Defines the encoding preset used to balance quality and performance.
   *
   * @see kAMDEncoderPreset
   */
  preset?: kAMDEncoderPreset;
}

/**
 * Configuration settings for AMD HEVC (H.265) video encoding.
 *
 * Extends {@link EncoderSettingsAMF} to support HEVC-specific encoding options.
 *
 * @see kAMDEncoderPreset
 */
interface EncoderSettingsAMFHVEC extends EncoderSettingsAMF {
  /**
   * Defines the encoding preset to use.
   * Presets control the trade-off between encoding speed and compression quality.
   *
   * @see kAMDEncoderPreset
   */
  preset?: kAMDEncoderPreset;
}

/**
 * Configuration settings for Intel Quick Sync video encoding.
 *
 * Extends {@link VideoEncoderSettingsBase} with Intel-specific options for tuning encoding quality, rate control,
 * and performance characteristics.
 *
 * @see VideoEncoderSettingsBase
 */
interface EncoderSettingsQuickSync extends VideoEncoderSettingsBase {
  /**
   * Rate control method to use for encoding.
   *
   * Determines how bitrate is managed during video encoding.
   * Common options include `'CBR'` (Constant Bitrate), `'VBR'` (Variable Bitrate), `'CQP'` (Constant Quantization Parameter), and `'ICQ'`.
   *
   * @default 'CBR'
   *
   * @see kQuickSyncEncoderRateControl
   */
  rate_control?: kQuickSyncEncoderRateControl;

  /**
   * Target usage or encoding preset that balances performance and quality.
   *
   * Ranges from `'TU1'` (slowest, highest quality) to `'TU7'` (fastest, lowest quality).
   *
   * @default 'TU4' — Balanced (Medium Quality)
   *
   * @see kQuickSyncTargetUsage
   */
  target_usage?: kQuickSyncTargetUsage;

  /**
   * Number of B-frames (bidirectional frames) used between reference frames.
   *
   * More B-frames can improve compression efficiency and video quality at the cost of increased latency and computational load.
   *
   * @default 3
   */
  bframes?: number;

  /**
   * Enables Intel’s subjective video enhancements, such as visual quality optimization for perceived clarity.
   *
   * May slightly improve image quality under certain conditions.
   *
   * @default true
   */
  enhancements?: boolean;
}

/**
 * Configuration settings for H.264 encoding using Intel Quick Sync.
 *
 * Extends {@link EncoderSettingsQuickSync} with an optional H.264 profile setting.
 *
 * @see EncoderSettingsQuickSync
 */
interface EncoderSettingsQuickSync264 extends EncoderSettingsQuickSync {
  /**
   * Specifies the H.264 encoding profile to use.
   *
   * Determines compatibility and compression characteristics.
   * 
   * Common profiles include:
   * - `'baseline'` — For low-complexity, real-time encoding.
   * - `'main'` — Balances quality and compression; widely supported.
   * - `'high'` — Offers the best compression efficiency and quality.
   *
   * @default 'high' 
   * 
   * @see {@link kQuickSyncEncoderProfile264}
   */
  profile?: kQuickSyncEncoderProfile264;
}

/**
 * Configuration settings for HEVC (H.265) video encoding using Intel Quick Sync.
 *
 * Extends {@link EncoderSettingsQuickSync} to include HEVC-specific profile selection.
 *
 * @see {@link EncoderSettingsQuickSync}
 */
interface EncoderSettingsQuickSyncHEVC extends EncoderSettingsQuickSync {
  /**
   * Specifies the HEVC encoding profile.
   *
   * The default is `'main'`. This setting determines the feature set and compatibility of the encoded video.
   *
   * @see {@link kQuickSyncEncoderProfileHEVC}
   */
  profile?: kQuickSyncEncoderProfileHEVC;
}

/**
 * Configuration options for the x264 software video encoder.
 *
 * Allows customization of encoding behavior including rate control, quality presets, profiles, and advanced tuning.
 *
 * @see {@link VideoEncoderSettingsBase}
 */
interface EncoderSettingsX264 extends VideoEncoderSettingsBase {
  /**
   * Specifies the rate control method for x264.
   * Common options include `'CBR'`, `'VBR'`, `'CRF'`, and `'ABR'`.
   *
   * @default `rate_control`.
   *
   * @see {@link kX264EncoderRateControl}
   */
  rate_control?: kX264EncoderRateControl;

  /**
   * Specifies the encoding speed/quality trade-off preset.
   * A slower preset provides better compression (quality per bitrate).
   *
   * @default `'veryfast'`
   *
   * @see {@link kX264EncoderPreset}
   */
  preset?: kX264EncoderPreset;

  /**
   * Sets the H.264 encoding profile.
   *
   * @default '' (no profile).
   *
   * @see {@link kX264EncoderProfile}
   */
  profile?: kX264EncoderProfile;

  /**
   * Specifies a tuning parameter to optimize the encoder for a specific type of content.
   *
   * @default '' (no tuning).
   *
   * @see {@link kX264EncoderTune}
   */
  tune?: kX264EncoderTune;

  /**
   * Additional x264 encoder options, provided as a space-separated string.
   *
   * @example
   * `"ref=4 bframes=2 me=umh subme=9"`.
   */
  x264opts?: string;

  /**
   * Whether to use a custom buffer size.
   *
   * @default `false`
   */
  use_bufsize?: boolean;

  /**
   * Custom buffer size (in kbps) to be used when `use_bufsize` is `true`.
   */
  buffer_size?: number;
}

/**
 * Configuration settings for the Intel QuickSync H.264 encoder.
 *
 * Allows selection of a specific H.264 encoding profile supported by QuickSync.
 *
 * @see {@link VideoEncoderSettingsBase}
 */
interface EncoderSettingsQuickSyncH264 extends VideoEncoderSettingsBase {
  /**
   * Specifies the H.264 profile used during encoding.
   * Profiles define the encoding features and compatibility level.
   *
   * @default 'high'
   * @see {@link kQuickSyncEncoderProfile264}
   */
  profile?: kQuickSyncEncoderProfile264;
}


/**
 * Configuration object defining all required settings for capturing audio and video.
 *
 * This interface bundles video, audio, encoder, and source configuration
 * into a single structure used for initializing a capture session.
 */
interface CaptureSettings {
  /**
   * Settings related to video resolution, frame rate, and color configuration.
   *
   * @see {@link VideoSettings}
   */
  videoSettings: VideoSettings;

  /**
   * Settings related to input/output audio devices and application-specific audio capture.
   *
   * @see {@link AudioSettings}
   */
  audioSettings: AudioSettings;

  /**
   * Encoder settings used for video compression.
   *
   * @see {@link VideoEncoderSettingsBase}
   */
  videoEncoderSettings: VideoEncoderSettingsBase;

  /**
   * The audio encoder selected for encoding captured audio data.
   *
   * @see {@link AudioEncoderInfo}
   */
  audioEncoder: AudioEncoderInfo;

  /**
   * List of media sources to capture (e.g., display, window, or game).
   *
   * @see {@link CaptureSource}
   */
  sources: CaptureSource[];
}


/**
 * A builder interface for constructing a complete {@link CaptureSettings} configuration.
 *
 * Allows incremental addition of screen, game, and audio capture sources, as well as customization
 * of encoder and device settings. The builder supports chaining and returns a finalized
 * {@link CaptureSettings} object upon calling `build()`.
 *
 * @see {@link CaptureSettings}
 */
interface CaptureSettingsBuilder extends CaptureSettings {
  /**
   * Adds a screen (monitor) source to the capture settings.
   *
   * @param settings - The screen capture configuration.
   * @returns The builder instance for chaining.
   */
  addScreenSource(
    settings: MonitorCaptureSourceSettings
  ): CaptureSettingsBuilder;

  /**
   * Adds a game source to the capture settings.
   *
   * @param settings - The game capture configuration.
   * @returns The builder instance for chaining.
   */
  addGameSource(settings: GameCaptureSourceSettings): CaptureSettingsBuilder;

  /**
   * Add Window video capture source
   * settings. Executable is mandatory.
   * @param settings
   */
  addWindowSource(
    settings: WindowCaptureSourceSettings
  ): CaptureSettingsBuilder;

  /**
   * Add Electron window capture source
   * settings. Executable is optional.
   * @param browserWindow
   * @param settings
   */
  addBrowserWindowSource(
    browserWindow: BrowserWindow,
    setting: WindowCaptureSourceSettings
  ): CaptureSettingsBuilder;

  /**
   * Adds an audio device for capturing input or output audio.
   *
   * @param params - Parameters identifying the audio device.
   * @param settings - Optional audio device settings.
   * @returns The builder instance for chaining.
   */
  addAudioCapture(
    params: AudioDeviceParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   * Adds the default system audio device (input or output) if not already added.
   *
   * @param type - The device type (`input` or `output`).
   * @param params - Optional configuration for default audio capture behavior.
   * @param settings - Optional audio device settings.
   * @returns The builder instance for chaining.
   */
  addAudioDefaultCapture(
    type: AudioDeviceType,
    params?: DefaultAudioDeviceParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   * Adds application-specific audio capture based on process name.
   *
   * @param param - Application audio capture parameters.
   * @param settings - Optional audio settings for the application.
   * @returns The builder instance for chaining.
   */
  addApplicationAudioCapture(
    param: ApplicationAudioCaptureParams,
    settings?: AudioDeviceSettings
  ): CaptureSettingsBuilder;

  /**
   * Finalizes the capture configuration and returns a {@link CaptureSettings} object.
   *
   * @returns The completed capture settings.
   */
  build(): CaptureSettings;
}



/**
 * Optional parameters used to configure a {@link CaptureSettings} object before creation.
 *
 * This interface provides configuration for encoder selection, audio device handling,
 * and track separation logic for audio sources.
 *
 * @see {@link CaptureSettingsBuilder}
 * @see {@link AudioEncoderInfo}
 * @see {@link VideoEncoderInfo}
 */
interface CaptureSettingsOptions {
  /**
   * Encoder type to create the capture setting.
   * Default is the best default encoder detected (GPU → x264).
   */
  videoEncoder?: kSupportedEncodersTypes;

  /**
   * Audio encoder to use.
   * @default 'ffmpeg_aac'
   * Use `queryInformation().encoders.audio` to see the supported encoders.
   * 
   * @see {@link kKnownAudioEncodersTypes}
   */
  audioEncoder?: kKnownAudioEncodersTypes;

  /**
   * Whether to add default audio devices.
   * @default true
   */
  includeDefaultAudioSources?: boolean;

  /**
   *Automatically separate audio tracks.
   * When using the default audio sources, the input and output devices will be recorded to dedicated tracks (2 and 3),
   * and track number 1 will include both.
   */
  separateAudioTracks?: boolean;
}

/**
 * 
 * Provides information about the available GPU adapters and connected monitors.
 */
interface GraphicsInformation {
  /**
   * List of available graphics adapters on the system.
   * 
   * @see {@link AdapterInfo}
   */
  adapters: AdapterInfo[];

  /**
   * List of connected monitor displays and their associated information.
   * 
   * @see {@link MonitorInfo}
   */
  monitors: MonitorInfo[];
}

/**
 * Available audio and video encoders.
 * 
 * This interface provides access to lists of supported audio and video encoders
 * detected on the system. These encoders can be used for media capture or streaming tasks.
 */
interface EncoderInformation {
  /**
   * A list of available video encoders.
   * 
   * @see {@link VideoEncoderInfo}
   */
  video: VideoEncoderInfo[];

  /**
   * A list of available audio encoders.
   * 
   * @see {@link AudioEncoderInfo}
   */
  audio: AudioEncoderInfo[];
}

/**
 * Configuration options for launching or customizing the recording application behavior.
 *
 * @see {@link CaptureSettings}
 * @see {@link EncoderSettingsX264}
 *
 * @example
 * ```ts
 * const options: RecordingAppOptions = {
 *   showDebugWindow: true,
 *   enableDebugLogs: true,
 *   statsInterval: 5000
 * };
 * ```
 */
interface RecordingAppOptions {
  /**
   * Whether to show the recorder capture (OBS) window during runtime.
   * Useful for debugging or development purposes.
   */
  showDebugWindow?: boolean;

  /**
   * Enables verbose debug logs for the recorder.
   * Can be used to troubleshoot issues during recording.
   */
  enableDebugLogs?: boolean;
}


/**
 * Enumeration of possible error codes returned by the recording system.
 * Each error code represents a specific condition or failure during initialization,
 * execution, or finalization of a recording session.
 *
 * These codes help in identifying and handling recording-related issues.
 *
 * @example
 * ```ts
 * function handleError(code: ErrorCode) {
 *   if (code === -1000) {
 *     console.error("OBS process crashed");
 *   }
 * }
 * ```
 */
type ErrorCode =
  | -1001 // Generic unknown error. 'Unknown'
  | -1000 // OBS process crashed. 'ProcessTerminated'
  | -999  // Missing binaries required for recording. 'MissingBinaries'
  | -998  // Failed to connect to the OBS process. 'ConnectionOBSError'
  | -997  // Operation attempted while recording is already running. 'AlreadyRunning'
  | -12   // Attempted to split recording when split recording is disabled. 'SplitRecordingDisabled'
  | -11   // One or more required parameters are missing or invalid. 'MissingOrInvalidParameters'
  | -10   // No active recording session found. 'NoActiveRecording'
  | -8    // Encoder encountered an error. 'EncoderError'
  | -7    // Not enough disk space to complete the recording. 'NoDiskSpaceError'
  | -4    // Failed to process or finalize the output video file. 'ProcessOutputError'
  | -1    // Invalid or inaccessible output file path. 'BadPathError'
  | 0     // Operation succeeded. 'Success'
  | 1     // Operation succeeded but stopped early due to low disk space. 'SuccessLowDiskSpace'
  | 2;    // Reserved or undefined success code.

 // Replay stopped while creating replay 'SuccessWithError'

/**
 * Base configuration options for video recording.
 * These settings apply to all recording sessions and allow customization
 * of format, audio routing, and shutdown behavior.
 *
 * @see {@link kFileFormat}
 * @see {@link AudioTracks}
 */
interface RecordingBaseOptions {
  /**
   * Specifies the container format for the output video file.
   * Common formats include `'fragmented_mp4'`, `'mkv'`, `'flv'`, etc.
   * @default `'fragmented_mp4'`
   *
   * @see {@link kFileFormat}
   */
  fileFormat?: kFileFormat;

  /**
   * Defines which audio track(s) should be used for recording.
   * If `separateAudioTracks` is enabled,
   * it may include multiple tracks such as `Track1`, `Track2`, and `Track3`.
   * 
   * @default `Track1`
   *
   * @see {@link AudioTracks}
   */
  audioTrack?: AudioTracks;

  /**
   * Automatically stops the recording when the game exits.
   * This only applies when recording with a Game capture source.
   */
  autoShutdownOnGameExit?: boolean;
}



/**
 * Configuration options for splitting video recordings.
 * 
 * These settings define how and when the recording should be split
 * based on time or file size. Supports manual split and optional full video backup.
 */
interface SplitOptions {
  /**
   * Enables manual split control via API or hotkey.
   */
  enableManual: boolean;

  /**
   * Automatically split the recording when it reaches the specified duration (in seconds).
   * If not set, time-based splitting is disabled.
   */
  maxTimeSecond?: number;

  /**
   * Automatically split the recording when the file size exceeds the specified size (in MB).
   * If not set, size-based splitting is disabled.
   */
  maxBySizeMB?: number;

  // /**
  //  * Record the full continuous video alongside the split video files.
  //  * This is only applicable when `splitType` is `'byTime'` or `'bySize'`.
  //  */
  // includeFullVideo?: boolean;

  // splitType?: VideoRecordingSplitType;
}

/**
 * Defines the configuration options for starting a recording session.
 * 
 * Extends {@link RecordingBaseOptions} and includes optional split settings and the output file path.
 *
 * @see {@link RecordingBaseOptions}
 */
interface RecordingOptions extends RecordingBaseOptions {
  /**
   * Configuration for splitting the video recording into smaller segments.
   * If not set, the recording will be saved as a single file.
   *
   * @see {@link SplitOptions}
   */
  split?: SplitOptions;

  /**
   * The full path to the output file (without the file extension).
   * This determines where the recorded video will be saved.
   *
   * @example
   * `"C:/Videos/MyGameRecording"`
   */
  filePath: string;
}

/**
 * Defines the configuration options for using the replay buffer.
 * 
 * Extends {@link RecordingBaseOptions} and includes additional properties
 * for managing replay specific behavior.
 *
 * @see {@link RecordingBaseOptions}
 */
interface ReplayOptions extends RecordingBaseOptions {
  /**
   * The length of the replay buffer in seconds.
   * This determines how much time will be retained in memory
   * before being written to disk on replay save.
   *
   * Example: `30` will capture the last 30 seconds before the save.
   */
  bufferSecond: number;

  /**
   * The root directory where replay videos will be saved.
   * This path must be accessible and writable by the recording service.
   *
   * Example: `"C:/Recordings/Replays"`
   */
  rootFolder: string;
}

/**
 * Callback used to handle a replay video once it's available.
 *
 * @param replay - The replay video instance containing metadata and video data.
 * 
 * @see {@link ReplayVideo}
 * 
 * @example
 * ```ts
 * const onReplayReady: ReplayCallback = (replay) => {
 *   console.log('Replay path:', replay.filePath);
 * };
 * ```
 */
type ReplayCallback = (replay: ReplayVideo) => void;

/**
 * Callback invoked when a recording session stops.
 *
 * @param args - The arguments containing metadata and results about the stopped recording session.
 *
 * @see {@link RecordStopEventArgs}
 *
 * @example
 * ```ts
 * const handleStop: StopCallback = (args) => {
 *   console.log('Recording stopped. File saved to:', args.filePath);
 * };
 * ```
 */
type StopCallback = (args: RecordStopEventArgs) => void;

/**
 * Callback invoked when a recording is split into a new video file.
 *
 * @param videoInfo - Information about the newly created split video file.
 *
 * @see {@link SplitRecordArgs}
 *
 * @example
 * ```ts
 * const onSplit: SplitCallback = (videoInfo) => {
 *   console.log('Split video created at:', videoInfo.filePath);
 * };
 * ```
 */
type SplitCallback = (videoInfo: SplitRecordArgs) => void;

/**
 * Callback triggered when a recording starts successfully.
 *
 * @param args - Metadata and contextual details associated with the start of the recording.
 *
 * @see {@link RecordEventArgs}
 *
 * @example
 * ```ts
 * const onStart: StartCallback = (args) => {
 *   console.log('Recording started with ID:', args.sessionId);
 * };
 * ```
 */
type StartCallback = (args: RecordEventArgs) => void;

/**
 * Callback triggered when a replay recording is stopped.
 *
 * @param args - Details and metadata related to the stopped replay recording session.
 *
 * @see {@link RecordEventArgs}
 *
 * @example
 * ```ts
 * const onReplayStop: ReplayStopCallback = (args) => {
 *   console.log(`Replay stopped. Duration: ${args.duration}ms`);
 * };
 * ```
 */
type ReplayStopCallback = (args: RecordEventArgs) => void;

/**
 * Options used when capturing a replay segment from the active recording buffer.
 *
 * @example
 * ```ts
 * const replayOptions: CaptureReplayOptions = {
 *   fileName: 'epic-kill',
 *   pastDuration: 10000, // Capture last 10 seconds
 *   timeout: 5000         // Automatically stop after 5 seconds
 * };
 * recorder.captureReplay(replayOptions);
 * ```
 */
interface CaptureReplayOptions {
  /**
   * Replay file name (without extension).
   * This value will be used to generate the final video file name.
   */
  fileName: string;

  /**
   * The video length, in milliseconds, to include prior to the time this method is called.
   * This allows capturing moments that happened just before the replay trigger.
   */
  pastDuration: number;

  /**
   * (Optional) Duration in milliseconds to automatically stop the replay after it starts.
   * 
   * - If set to `0`, the replay will include only the `pastDuration` segment (instant clip).
   * - If not set, you must explicitly stop the replay using the `ActiveReplay` handle.
   */
  timeout?: number;
}

/**
 * Information about a completed recording event,
 * including file path, status, error (if any), and stats.
 *
 * @example
 * ```ts
 * const handleRecordingStopped = (args: RecordEventArgs) => {
 *   if (args.error) {
 *     console.error('Recording failed:', args.error);
 *   } else {
 *     console.log('Recording saved to:', args.filePath);
 *   }
 * };
 * ```
 */
interface RecordEventArgs {
  /**
   * The full file path to the saved video recording.
   * `undefined` if the recording failed.
   */
  filePath?: string;

  /**
   * A descriptive error message if the recording failed to complete successfully.
   * `undefined` if no error occurred, 
   */
  error?: string;

  /**
   * The reason the recording was stopped, either by the user or due to an error.
   * This can be a predefined {@link ErrorCode} or a custom numeric value.
   */
  reason?: ErrorCode | number;

  /**
   * Performance and runtime statistics collected during the recording session,
   * such as frame rate, dropped frames, or encoding stats.
   */
  stats?: RecorderStats;
}

/**
 * Provides additional details about a completed recording session,
 * extending {@link RecordEventArgs} with more specific metadata
 * related to the stop event.
 *
 * @example
 * ```ts
 * const onRecordingStopped = (args: RecordStopEventArgs) => {
 *   if (args.hasError) {
 *     console.warn('Recording stopped with error:', args.error);
 *   } else {
 *     console.log(`Recording saved to ${args.filePath}`);
 *     console.log(`Duration: ${args.duration}ms`);
 *     console.log(`Splits: ${args.splitCount}`);
 *   }
 * };
 * ```
 *
 * @see {@link RecordEventArgs}
 */
interface RecordStopEventArgs extends RecordEventArgs {
  /**
   * The total duration of the video in milliseconds,
   * available when the recording ends successfully.
   */
  duration?: number;

  /**
   * Indicates whether the recording ended due to an error.
   * `true` if an error occurred during recording.
   */
  hasError: boolean;

  /**
   * The number of split segments created during the recording.
   */
  splitCount?: number;

  /**
   * The epoch timestamp (in milliseconds) representing
   * when the recording started.
   */
  startTimeEpoch?: number;
}

/**
 * Information about a split video segment created during an ongoing recording.
 * This extends {@link RecordEventArgs} with specific details for split-related events.
 *
 * @example
 * ```ts
 * const onSplit = (args: SplitRecordArgs) => {
 *   console.log(`Split #${args.splitCount} created: ${args.filePath}`);
 *   console.log(`Next segment will be saved to: ${args.nextFilePath}`);
 * };
 * ```
 *
 * @see {@link RecordEventArgs}
 */
interface SplitRecordArgs extends RecordEventArgs {
  /**
   * Duration of the current split segment in milliseconds.
   */
  duration: number;

  /**
   * The current split index. Indicates how many splits have occurred so far.
   */
  splitCount: number;

  /**
   * File path of the next recording segment that will be created after this split.
   */
  nextFilePath: string;

  /**
   * Epoch timestamp (in milliseconds) of when the current split began.
   */
  startTimeEpoch?: number;
}

/**
 * Metadata and statistics about a replay video created from a buffered recording.
 * Extends {@link RecordEventArgs} with replay specific information.
 *
 * @example
 * ```ts
 * const handleReplayComplete = (replay: ReplayVideo) => {
 *   console.log(`Replay saved to: ${replay.filePath}`);
 *   console.log(`Replay duration: ${replay.duration}ms`);
 *   console.log(`Replay started at: ${new Date(replay.startTimeEpoch).toISOString()}`);
 * };
 * ```
 *
 * @see {@link RecordEventArgs}
 */
interface ReplayVideo extends RecordEventArgs {
  /**
   * Duration of the replay video in milliseconds.
   */
  duration: number;

  /**
   * Epoch UTC timestamp (in milliseconds) of when the replay started (first frame).
   */
  startTimeEpoch: number;
}

/**
 * Manages an ongoing replay capture session.
 * Provides control over stopping the active replay either immediately or after a timeout.
 *
 * @example
 * ```ts
 * if (recorder.activeReplay) {
 *   recorder.activeReplay.stop((replay) => {
 *     console.log('Replay complete:', replay.filePath);
 *   });
 * }
 * ```
 *
 * @see {@link ReplayCallback}
 */
interface ActiveReplay {
  /**
   * Callback executed once the replay completes.
   */
  callback?: ReplayCallback;

  /**
   * The current replay timeout in milliseconds, if it has been set.
   */
  readonly timeout?: number;

  /**
   * Immediately stops the active replay.
   *
   * @param callback Optional callback to set or override the existing complete callback.
   */
  stop(callback?: ReplayCallback): void;

  /**
   * Stops the replay after the given timeout.
   *
   * @param timeout Time in milliseconds to wait before stopping the replay.
   * @param callback Optional callback to set or override the existing complete callback.
   */
  stopAfter(timeout: number, callback?: ReplayCallback): void;
}

/**
 * Provides real-time performance statistics of the Recorder.
 * Useful for monitoring system load and diagnosing performance issues during recording.
 *
 * @example
 * ```ts
 * const stats: RecorderStats = recorder.getStats();
 * console.log(`CPU Usage: ${stats.cpuUsage}%`);
 * ```
 */
interface RecorderStats {
  /**
   * Current CPU usage percentage by the recording process.
   */
  cpuUsage: number;

  /**
   * Amount of memory (in megabytes) currently used by the Recorder.
   */
  memoryUsage: number;

  /**
   * Available disk space (in megabytes) on the storage device used for recording.
   */
  availableDiskSpace: number;

  /**
   * Frames per second currently being rendered by the Recorder.
   */
  activeFps: number;

  /**
   * Average time (in milliseconds) taken to render a single frame.
   */
  averageFrameRenderTime: number;

  /**
   * Number of frames skipped in the rendering thread due to performance constraints.
   */
  renderSkippedFrames: number;

  /**
   * Total number of frames rendered by the rendering thread.
   */
  renderTotalFrames: number;

  /**
   * Number of frames skipped in the output thread due to performance constraints.
   */
  outputSkippedFrames: number;

  /**
   * Total number of frames processed and output by the output thread.
   */
  outputTotalFrames: number;
}

/**
 * Recording error information including a specific error code and description.
 * Useful for detailed debugging and error handling during recording operations.
 *
 * @example
 * ```ts
 * try {
 *   await recorder.start();
 * } catch (error) {
 *   if (error instanceof RecorderError) {
 *     console.error(`Recording failed with code ${error.codeStr}: ${error.message}`);
 *   }
 * }
 * ```
 */
export class RecorderError extends Error {
  /**
   * Numeric error code identifying the specific recording error.
   * @see {@link ErrorCode}
   */
  code: ErrorCode;

  /**
   * Human-readable string that maps to the error code.
   */
  codeStr: string;

  /**
   * Optional internal error for more detailed debugging.
   */
  internalError?: Error;
}

/**
 * API interface for managing Overwolf's recording and replay capture services.
 * Includes methods for starting/stopping recordings, replays, configuring capture settings, and querying system capabilities.
 *
 * @see {@link RecordingOptions}
 * @see {@link ReplayOptions}
 * @see {@link RecorderError}
 * @see {@link CaptureSettings}
 * @see {@link RecordingInformation}
 */
interface IOverwolfRecordingApi {
  /**
   * Global runtime options for the recording app (e.g., debug options, override paths).
   *
   * @see {@link RecordingAppOptions}
   */
  options: RecordingAppOptions;

  /**
   * Overlay package version.
   */
  readonly version: string;

  /**
   * Path to ffmpeg file.
   */
  readonly ffmpegPath: string;

  /**
   * Path to OBS binaries folder.
   */
  readonly binFolderPath: string;

  /**
   * Checks if either recording or replays are currently active.
   */
  isActive(): Promise<boolean>;

  /**
   * Checks if a recording is currently active.
   */
  isRecordingActive(): Promise<boolean>;

  /**
   * Checks if a replay session is currently active.
   */
  isReplayActive(): Promise<boolean>;

  /**
   * Queries supported encoders, audio/video devices, and configuration options.
   *
   * @returns A promise that resolves to the full recording capability information.
   * @see {@link RecordingInformation}
   */
  queryInformation(): Promise<RecordingInformation>;

  /**
   * Creates a capture settings builder instance to configure video/audio sources.
   *
   * @param options Optional base options to initialize the settings.
   * @returns A builder used to construct a complete {@link CaptureSettings} object.
   * @see {@link CaptureSettingsBuilder}
   */
  createSettingsBuilder(
    options?: CaptureSettingsOptions
  ): Promise<CaptureSettingsBuilder>;

  /**
   * Starts a video recording session.
   *
   * Fires the `'recording-started'` event when recording begins.
   * Fires the `'recording-stopped'` event when stopped manually, via error, or when the game exits.
   *
   * @param options Recording options such as file path, format, and split config.
   * @param setting Optional capture settings to define sources.
   * @param listener Optional callback for the stop event (overrides global listener).
   * @throws {@link RecorderError} if recording fails to start.
   */
  startRecording(
    options: RecordingOptions,
    setting?: CaptureSettings,
    listener?: StopCallback
  ): Promise<void>;

  /**
   * Stops the active recording.
   *
   * @param listener Optional callback to handle the stop result.
   * @returns A promise that resolves when recording has fully stopped.
   * @see {@link StopCallback}
   */
  stopRecording(listener?: StopCallback): Promise<void>;

  /**
   * Splits the current recording into a new file.
   * Fires `'recording-split'` once the new file is created.
   *
   * @param listener Optional callback triggered on successful split.
   * @throws {@link RecorderError} if splitting fails.
   * @see {@link SplitCallback}
   */
  splitRecording(listener?: SplitCallback): Promise<void>;

  /**
   * Starts replay capture service in memory.
   *
   * Fires the `'replays-started'` event on success.
   *
   * @param options Replay configuration such as buffer length and paths.
   * @param setting Optional capture settings for the replay session.
   * @throws {@link RecorderError} if replays fail to start.
   * @see {@link ReplayOptions}
   */
  startReplays(
    options: ReplayOptions,
    setting?: CaptureSettings
  ): Promise<void>;

  /**
   * Stops the active replay session.
   *
   * Fires `'replays-stopped'` upon success.
   * @throws {@link RecorderError} if stop fails.
   */
  stopReplays(): Promise<void>;

  /**
   * Captures a replay from the memory buffer.
   * Returns an {@link ActiveReplay} object to control the replay after creation.
   *
   * @param option Replay capture parameters (filename, duration).
   * @param callback Optional callback for when replay is ready.
   * @returns A promise resolving to an {@link ActiveReplay} controller object.
   * @throws {@link RecorderError}
   */
  captureReplay(
    option: CaptureReplayOptions,
    callback?: ReplayCallback
  ): Promise<ActiveReplay>;

  /**
   * Registers games to monitor and track for launch/exit detection.
   *
   * @param filter Filtering rules for which games to track.
   */
  registerGames(filter: GamesFilter): void;

  /**
   * Updates runtime settings for an audio device while recording.
   *
   * @param device Updated device settings.
   * @see {@link AudioDeviceSettingsUpdateInfo}
   * @since 0.32.0
   */
  updateAudioDevice(device: AudioDeviceSettingsUpdateInfo): Promise<void>;

  /**
   * Set a source to transform.
   * 
   * Defines how the source will be rendered (for example, position, scale, crop, etc.).
   * Throws an error if the source is not found or if the transform is invalid.
   * 
   * @param sourceTransform
   */
  setSourceTransform(sourceTransform: SourceTransform): Promise<void>;

  /** @event Fired when a registered game is launched. */
  on(eventName: 'game-launched', listener: (gameInfo: GameInfo) => void): this;

  /** @event Fired when a registered game process exits. */
  on(eventName: 'game-exit', listener: (gameInfo: GameInfo) => void): this;

  /** @event Fired when a recording session begins. */
  on(eventName: 'recording-started', listener: StartCallback): this;

  /** @event Fired when a recording session ends. */
  on(eventName: 'recording-stopped', listener: StopCallback): this;

  /** @event Fired when a recording is split into a new file. */
  on(eventName: 'recording-split', listener: SplitCallback): this;

  /** @event Fired when replay service starts. */
  on(eventName: 'replays-started', listener: StartCallback): this;

  /** @event Fired when replay service stops. */
  on(eventName: 'replays-stopped', listener: ReplayStopCallback): this;

  /** @event Fired when a replay video has been captured. */
  on(eventName: 'replay-captured', listener: ReplayCallback): this;

  /**
   * @event Fired periodically with recorder performance metrics.
   * Interval is configured via {@link RecordingAppOptions.statsInterval}.
   */
  on(eventName: 'stats', listener: (args: RecorderStats) => void): this;
}
