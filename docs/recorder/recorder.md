
# ow-electron Recording

This document will describe an example of implementing the ow-electron recording package, how to interact with its interfaces, types, and configurations.

[API specification](api-specification.md)

## About the ow-electron recorder

The ow-electron recorder uses OBS behind the scenes and exposes OBS functions to the app. Using the recorder package, it is possible to record video and audio using the machine's devices, inputs, and running games.

## Recorder package features

### Capture Audio / Video

- Capture video from a specific display device or the running game directly.
- Capture any audio input or output device, such as speakers, a microphone, or the game sound alone.
- Split capture into separate video files on-demand or using a timer.
- Multiple audio and video encoders supported.
- Multiple output formats supported.
- Control bitrate and encoding rate.
- Options to allocate specific audio tracks to specific audio devices.

### Replays Capture

- Record a buffer of X seconds to memory without saving to disk.
- Allow for on-demand video capture to disk with a portion or all of the in-memory buffer.
- For example, when a highlight is detected while the replay is running, capture can be turned on to run for a timer, using X seconds already captured by the replay.

### Game Listener

- Using the recording package, we can register for general events from supported games, such as game launch or exit.
- This can be used to trigger seamless recording as the game is loaded or alternately to start a replay and later trigger capture during appropriate moments.

### Usage stats

While the recorder is actively recording, usage stats are provided such as:

- CPU & memory usage
- Available disk space
- Active FPS
- Dropped frames information

## Getting started

### Installation

Make sure that the following node_modules are installed:

```sh
npm install @overwolf/ow-electron @overwolf/ow-electron-builder @overwolf/ow-electron-packages-types
```

To activate the recording package, place the "recorder" string under \`overwolf -> packages\` in your app's \`package.json\`:

```
{
  ...
  "overwolf": {
    "packages": [
      "recorder"
    ]
  },
  ...
}
```

### Recorder Usage

#### Import and Register

Import the app from 'electron' & overwolf from \`@overwolf/ow-electron\`. Register to the ready state, and once the ready event is fired, verify that the package name is \recorder\.

```javascript
import { app as electronApp } from 'electron';
import { overwolf } from '@overwolf/ow-electron';

const owElectronApp = electronApp as overwolf.OverwolfApp;
owElectronPackages.on('ready', (e, packageName) => {
    if (packageName === 'recorder') {
      console.log('Recorder package is loaded');
    }
});
```
