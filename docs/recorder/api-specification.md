# API Specification

## Properties
  - `options` - contains Global options (For Debugging) [RecordingAppOptions](types.md#recordingappoptions)

## Methods
  - `isActive()` - Is recording or replays status active
    ```
    const active = await recorderApi.isActive();
    ```
  - `queryInformation()` - Query System information, (Supported encoder, Available    Audio\Video devices and monitors)
    ```
    const info = await recorderApi.queryInformation();
    console.log(info.monitors);
    ```

  - `registerGames(filter)` - Registration function for game launches, pass a filter of games desired to trigger the game-launched event when process is detected.
    Accepts the [GamesFilter](types.md#gamesfilter)  object

    ```
    const gamesFilter = {
      gameIds: [1111, 2222], // use [] for all games
      // all: true,
    };

    recorderApi.registerGames(gamesFilter);
    ```

 - `createSettingsBuilder(options)` -
-  `startRecording(options, setting, listener)`
-  `stopRecording(listener)`
-  `splitRecording(listener)`
-  `startReplays(options, setting)`
-  `stopReplays()`
-  `captureReplay(options, listener)`

## Event listeners
**Important:** it is recommended to wrap the event listeners in a try / catch block to catch any possible exceptions from the recording api.

  - `game-launched` - Fired when registered game process launch is detected, Returns the [gameInfo](types.md#GameInfo) object
      ```
      recorderApi.on('game-launched', (gameInfo) => {
        const name = gameInfo.name;
      });
      ```

  - `game-exit` - Fired on registered game process terminated.
      detected, Returns the [gameInfo](types.md#GameInfo) object
      ```
      recorderApi.on('game-exit', (gameInfo) => {
        const gameId = gameInfo.id;
      });
      ```

  - `recording-started` - Fired on video recording started, Returns the StartCallback with [RecordEventArgs](types.md#recordeventargs)
      ```
      recorderApi.on('recording-started', (RecordEventArgs) => {
        console.log(RecordEventArgs.filePath);
      });
      ```

  - `recording-stopped` - Fired on video recording stopped, Returns the StopCallback with [RecordStopEventArgs](types.md#recordstopeventargs)
      ```
      recorderApi.on('recording-stopped', (RecordStopEventArgs) => {
        console.log(RecordStopEventArgs.duration);
      });
      ```

  - `recording-split` - Fired on recording video split (manual/size/time), Returns the SplitCallback with [SplitRecordArgs](types.md#splitrecordargs)
      ```
      recorderApi.on('recording-split', (SplitRecordArgs) => {
        console.log(SplitRecordArgs.splitCount);
      });
      ```
  - `replays-started` - Fired on replays recording started, Returns the StartCallback with [RecordEventArgs](types.md#recordeventargs)
      ````
      recorderApi.on('replays-started', (RecordEventArgs) => {
        console.log(RecordEventArgs.filePath);
      });
      ```
  - `replays-stopped` - Fired on replays record stopped, Returns the ReplayStopCallback with [RecordEventArgs](types.md#recordeventargs)
      ```
      recorderApi.on('replays-stopped', (RecordEventArgs) => {
        console.log(RecordEventArgs.filePath);
      });
      ```
  - `replay-captured` - Fired on replay video was captured Returns the ReplayCallback with [ReplayVideo](types.md#replayvideo)
     ```
    recorderApi.on('replay-captured', (ReplayVideo) => {
      console.log(ReplayVideo.duration);
    });
    ```

- `stats` - Fired every |statsIntervalMS| (RecordingAppOptions) interval,  Returns the [RecorderStats](types.md#recorderstats)
    ```
    recorderApi.on('stats', (RecorderStats) => {
      console.log(RecorderStats.cpuUsage);
    });
    ```
