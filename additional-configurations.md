# Additional Configuration Options for the Dolby.io Communications UIKit for React

> If you prefer to get started by reviewing a complete code sample of this guide, see [the example here](examples/example_App.js).

- [Additional Configuration Options for the Dolby.io Communications UIKit for React](#additional-configuration-options-for-the-dolbyio-communications-uikit-for-react)
  - [Theming](#theming)
  - [Screen sharing](#screen-sharing)
  - [Recording](#recording)
  - [Logging](#logging)
  - [Hooks](#hooks)

### Theming

Themes allow you to customize all design aspects of your project in order to meet the specific needs of your business or brand and have a consistent tone of your application. Themes allow you to configure colors of components, the darkness of surfaces, level of shadow, and the opacity of ink elements.

The `ThemeProvider` component enables customisation. When used as is, it will provide a default look and feel for your app, but customisation is possible. For more information, see [ThemeProvider](documentation/providers/ThemeProvider.md).

```javascript
// src/App.js

// 1. Import `ThemeProvider` from the UI kit.
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

// 2. Define a custom theme. Any values provided here will be merged with the default theme.
const theme = {
  colors: {
    grey: {
      600: 'cyan', // This will change background color of certain UI elements to cyan
    },
  },
};

// 3. Pass the custom theme object into the ThemeProvider's `theme` property.

const AppBase = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CommsProvider token={token} refreshToken={refreshToken}>
        {children}
      </CommsProvider>
    </ThemeProvider>
  );
};
```

### Screen sharing

Screen sharing allows to present screen for other conference participants.
Basically you can use `useScreenSharing` hook which connects to the `Dolby.io Communications APIs`, `ScreenShareButton` for toggling screen share, `ScreenSharingPresentationBox` for catching share stream and `ScreenSharingActionBar` for displaying statuses.

```javascript
// src/App.js

// 1. Import `ScreenShareButton`, `ScreenSharingPresentationBox`, `ScreenSharingActionBar`, `useScreenSharing`, `ShareStatus`, `Space` from the UI kit.
import {
  ScreenShareButton,
  ScreenSharingPresentationBox,
  ScreenSharingActionBar,
  useScreenSharing,
  ShareStatus,
  Space,
} from '@dolbyio/comms-uikit-react';

// 2. Define the `ScreenSharingActionBar` configurations: component takes a statusLabels (shown depends of sharing status) and buttonLabels.

const ScreenSharingActionBarTexts = {
  status: {
    active: 'Screen sharing active',
    error: 'Screen sharing error',
    loading: 'Screen sharing loading',
    other: 'Screen sharing other status',
  },
  button: {
    label: 'Stop presenting',
    tooltip: 'Stop presenting',
  },
  guest: 'Someone is presenting',
};

// 3. Define the `ScreenSharingPresentationBox` configurations: component takes a "fallbacktext" and "fallbackButtonText" props for default fallback content.

const fallbackText = 'There is some problem with screen sharing';
const fallbackButtonText = 'try again';

// 4. Place the components to the `Content`. ScreenSharingPresentationBox fits 100% of parent element width and height. We are defining if presentation is active primary we are basing on ShareStatus. Secondary if share status is other than ACTIVE, but local user is presentation owner, we are checking if isPresentationModeActive

function Content() {
  const { status, isLocalUserPresentationOwner, isPresentationModeActive } = useScreenSharing();

  const isPresentationActive =
    status === ShareStatus.Active || (isLocalUserPresentationOwner && isPresentationModeActive);

  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        <Conference id={conferenceId}>
          {isPresentationActive && (
            <ScreenSharingActionBar
              statusLabels={{
                active: ScreenSharingActionBarTexts.status.active,
                error: ScreenSharingActionBarTexts.status.error,
                loading: ScreenSharingActionBarTexts.status.loading,
                other: ScreenSharingActionBarTexts.status.other,
              }}
              buttonLabels={{
                tooltip: ScreenSharingActionBarTexts.button.tooltip,
                label: ScreenSharingActionBarTexts.button.label,
              }}
              guestLabel={ScreenSharingActionBarTexts.guest}
            />
          )}
          {/* Code from previous examples has been removed for brevity */}

          {isPresentationActive && (
            <Space style={{ height: 400 }}>
              <ScreenSharingPresentationBox fallbackText={fallbackText} fallbackButtonText={fallbackButtonText} />
            </Space>
          )}
          <div style={buttonContainerStyle}>
            {/* Code from previous examples has been removed for brevity */}
            <ScreenShareButton />
          </div>
        </Conference>
      </Session>
    </div>
  );
}
```

### Recording

Recording allows to record videocall.
Basically you can use `RecordButton` component. It has built-in logic responsible for toggling recording. Additionally you can use logic from `useRecording` hook which connects to `Dolby.io Communications APIs` and `RecordingActionBar` which is responsible for displaying recording status. After stop recording, you can download it from Dolby.io dashboard. It is placed in your application details under `Communications APIs` in `monitor` tab.

```javascript
// src/App.js

// 1. Import `RecordButton`, `RecordingActionBar`, `useRecording` hook and `RecordingStatus` from the UI kit.
import { RecordButton, RecordingStatus, useRecording, RecordingActionBar } from '@dolbyio/comms-uikit-react';

// 2. Define the `RecordingActionBar` configurations: component takes a statusLabels (shown depends of recording status) and buttonLabels.

const RecordingActionBarTexts = {
  status: {
    active: 'Recording active',
    error: 'Recording error',
    loading: 'Recording loading',
    other: 'Recording other status',
  },
  buttonLabels: {
    active: {
      tooltip: `Stop recording`,
      label: `Stop recording`,
    },
    error: {
      tooltip: `Try again`,
      label: `Try again`,
    },
  },
  guest: 'Someone is recording',
};

// 3. Insert RecordButton and RecordingActionBar anywhere to the `Conference`.

function Content() {
  // We are defining if recording is active primary we are basing on RecordingStatus. Secondary if recording status is other than ACTIVE, we check if local user is recording owner.

  const { status: recordingStatus, isLocalUserRecordingOwner } = useRecording();

  const isRecordingActive = isLocalUserRecordingOwner || recordingStatus === RecordingStatus.Active;

  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        <Conference id={conferenceId}>
          {/* Code from previous examples has been removed for brevity */}
          {isRecordingActive && (
            <RecordingActionBar
              statusLabels={{
                active: RecordingActionBarTexts.status.active,
                error: RecordingActionBarTexts.status.error,
                loading: RecordingActionBarTexts.status.loading,
                other: RecordingActionBarTexts.status.other,
              }}
              buttonLabels={{
                active: {
                  tooltip: RecordingActionBarTexts.buttonLabels.active.tooltip,
                  label: RecordingActionBarTexts.buttonLabels.active.label,
                },
                error: {
                  tooltip: RecordingActionBarTexts.buttonLabels.error.tooltip,
                  label: RecordingActionBarTexts.buttonLabels.error.label,
                },
              }}
              guestLabel={RecordingActionBarTexts.guest}
            />
          )}
          <div style={buttonContainerStyle}>
            <RecordButton />
            {/* Code from previous examples has been removed for brevity */}
          </div>
        </Conference>
      </Session>
    </div>
  );
}
```

### Logging

The Dolby.io Communications UI Kit comes with a small logging framework that allows you to pump logs to the browser console to see things as they happen. The functionality is exposed through the `useLogger()` react hook.
The `LogProvider` controls the scope and level of logging you desire for the application, and can be set using the `minLogLevel` prop. By default, the level of logging is set to `LogLevel.Info`, with the possible options being `LogLevel.info`, `LogLevel.warn` and `LogLevel.error`.

`LogProvider` has to be the parent of `CommsProvider` in order to see logs from `CommsProvider`.

To setup LogProvider in your app, follow this flow.

```javascript
// Step 1 - Add the necessary imports
import { LogProvider, LogLevel } from '@dolbyio/comms-uikit-react';

// Step 2 - Set it up inside your app

const AppBase = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LogProvider minLogLevel={LogLevel.warn}>
        <CommsProvider token={token} refreshToken={refreshToken}>
          {children}
        </CommsProvider>
      </LogProvider>
    </ThemeProvider>
  );
};
```

To write logs in your app, follow this flow.

```javascript
// src/App.js

// Add in the import statement
import { useLogger } from '@dolbyio/comms-uikit-react';
const getCameraPermission = () => {
  // import the function from the hook
  const { log } = useLogger();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    });
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  } catch (error) {
    // Add in a log message with the appropriate Log Level
    log(LogLevel.error, 'Error occured while retrieving microphone permission', error);
  }
}



export default foo;
```

### Hooks

The UI components use custom hooks to connect to the [Dolby.io Communications APIs](https://docs.dolby.io/communications-apis/docs).

If you would like to connect to the Dolby.io Communications APIs using your own UI components, you can use the following exported hooks to add conferencing features to your application:

| Hook                                                            | Description                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [useAudio](documentation/hooks/useAudio.md)                     | Can be used to mute or unmute audio for local and remote participants.                                   |
| [useAudioProcessing](documentation/hooks/useAudioProcessing.md) | Gathers functions responsible for audio processing.                                                      |
| [useBlur](documentation/hooks/useBlur.md)                       | Can be used to toggle background blur effect for local participant                                       |
| [useCamera](documentation/hooks/useCamera.md)                   | Lists and selects available cameras, in addition to requesting camera permissions from the user.         |
| [useConference](documentation/hooks/useConference.md)           | Enables creating, joining or leaving conferences.                                                        |
| [useErrors](documentation/hooks/useErrors.md)                   | Expose errors and methods to remove handled ones.                                                        |
| [useLiveStreaming](documentation/hooks/useLiveStreaming.md)     | Gathers functions responsible for managing live streaming.                                               |
| [useLogger](documentation/hooks/useLogger.md)                   | Exposes function to create logs with specific log type.                                                  |
| [useMessage](documentation/hooks/useMessage.md)                 | Gathers functions responsible for managing messages.                                                     |
| [useMicrophone](documentation/hooks/useMicrophone.md)           | Lists and selects available microphones, in addition to requesting microphone permissions from the user. |
| [useNotifications](documentation/hooks/useNotifications.md)     | Expose notifications as well as handlers to remove display notification.                                 |
| [useParticipants](documentation/hooks/useParticipants.md)       | Provides information about participants in the current conference and their status.                      |
| [useRecording](documentation/hooks/useRecording.md)             | Gathers functions responsible for managing videocall recording.                                          |
| [useScreenSharing](documentation/hooks/useScreenSharing.md)     | Gathers functions responsible for managing screen sharing.                                               |
| [useSession](documentation/hooks/useSession.md)                 | Enables opening and closing sessions, as well as information about the local participant.                |
| [useSpeaker](documentation/hooks/useSpeaker.md)                 | Lists and selects available output speakers.                                                             |
| [useTheme](documentation/hooks/useTheme.md)                     | Gathers functions responsible for managing themes.                                                       |
| [useVideo](documentation/hooks/useVideo.md)                     | Can be used to enable or disable the camera for the local participant.                                   |
