# Dolby.io Communications UIKit for React

## Overview

The Dolby.io Communications UIKit for React is designed to help React developers reduce the complexity of building a Dolby.io video call application for web.

The package consists of four basic elements:

- Providers: The main components for initializing integration with [Dolby.io](https://dolby.io/) Communications APIs and state management.
- Hooks: Functions responsible for video call logic of video call applications.
- UI components: Components that cover the most popular patterns of video conferencing applications.
- Video call components: UI components with built-in logic for the most widely used video call features.

> If you prefer to get started by reviewing a complete code sample of this guide, see [the example here](examples/example_App.js).

> To see a video call kickstart app that shows the UIKit in action, check out our [GitHub](https://github.com/dolbyio-samples/comms-app-react-videocall).

> For a complete list of components and their usage, go to the [documentation folder](documentation/components).

## Getting Started

- [Dolby.io Communications UIKit for React](#dolbyio-communications-uikit-for-react)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [How to use this guide](#how-to-use-this-guide)
  - [Setup](#setup)
  - [Steps](#steps)
    - [Connect your app to Dolby.io](#connect-your-app-to-dolbyio)
      - [Initialize the SDK](#initialize-the-sdk)
      - [Open a session](#open-a-session)
    - [Add video call components](#add-video-call-components)
      - [Join or leave a conference](#join-or-leave-a-conference)
      - [Display participants](#display-participants)
      - [Display video](#display-video)
      - [Show user controls](#show-user-controls)
      - [Change input or output devices](#change-input-or-output-devices)
      - [Observe participants' status](#observe-participants-status)
  - [Theming](#theming)
  - [Optional Features](#optional-features)
    - [Screen sharing](#screen-sharing)
    - [Recording](#recording)
    - [Logging](#logging)
    - [Hooks](#hooks)
  - [License](#license)

## Prerequisites

- A [Dolby.io](https://dashboard.dolby.io/signup/) account
- A working webcam and microphone
- A Dolby.io [client access token](https://dashboard.dolby.io/dashboard/applications/summary)
- [Voxeet Web SDK >=3.8.0](https://www.npmjs.com/package/@voxeet/voxeet-web-sdk) or later
- [Node.js 16.x](https://nodejs.org/en/) or later
- A supported browser, either Chrome 100+, Safari 15+, Firefox 100+, or Edge 100+
- [Yarn v1.22.19](https://yarnpkg.com) installed.

## How to use this guide

This guide demonstrates how to use video call UI components to quickly build the essential components of a video call application. Be sure to complete the [Connect your app to Dolby.io](#connect-your-app-to-dolbyio) section before moving onto the [Add video call components](#add-video-call-components) section.

Each component demonstrated within [Add video call components](#add-video-call-components) can be built independent of the others. The code blocks within each section only include the code for that individual component, and exclude the components from other sections.

If you prefer to get started by reviewing a complete code sample containing all the features in this guide, see [the example here](examples/example_App.js).

## Setup

**Note:** This guide is written with Yarn in mind. You can swap out yarn for NPM or a different package manager if you like.

```bash
# Create a new React application
npx create-react-app my-app

# Change into the app directory
cd my-app

# Install UI kit
yarn add @voxeet/voxeet-web-sdk @dolbyio/comms-uikit-react

# Start the dev server
yarn run start
```

## Steps

### Connect your app to Dolby.io

This section will guide you on opening a connection to the Dolby.io APIs, which will enable the use of video calling features in your app.

#### Initialize the SDK

Dolby.io integration is provided by a `CommsProvider` component (for communication with our APIs) and a `ThemeProvider` component (provides the look and feel), which should be imported and configured at the root of your web app, eg. `src/App.js`.

```javascript
// src/App.js

// 1. Import `CommsProvider` and `ThemeProvider` from the UI kit.
import { CommsProvider, ThemeProvider, InfoBar } from '@dolbyio/comms-uikit-react';

// 2. Define the `CommsProvider` configuration. We need two properties, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// 3. Create wrapper with `CommsProvider` and `ThemeProvider` for entire app. Pass the `token` and `refreshToken` properties.

const AppBase = ({ children }) => {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        {children}
      </CommsProvider>
    </ThemeProvider>
  );
};

// 4. Create `Content` component. It will be main component of our app. Wrap it with previously created `AppBase`. We'll also add a fixed height to the content as we'll need this later in the guide.

function Content() {
  // 5. Define styles for the containers
  const contentContainerStyle = {
    minHeight: '100vh',
    gap: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#14141A',
    padding: '20px 0',
    boxSizing: 'border-box',
  };

  return (
    <div className="App" style={contentContainerStyle}>
      <InfoBar text="Voxeet Web SDK has been initialized." style={{ margin: '0 auto' }} />
      ...
    </div>
  );
}

// 6. Connect `BaseApp` with `Content` component.

const App = () => {
  return (
    <AppBase>
      <Content />
    </AppBase>
  );
};

export default App;
```

> This approach is only for demo purposes. To properly initialize your app for production, see [API Authentication](https://docs.dolby.io/communications-apis/docs/guides-api-authentication#initialize-the-sdk-with-secure-authentication) and [Client Authentication](https://docs.dolby.io/communications-apis/docs/guides-client-authentication).

#### Open a session

A session is a connection between the client application and the Dolby.io Communications APIs.

```javascript
// src/App.js

// 1. Import `Session` from the UI kit.
import { Session } from '@dolbyio/comms-uikit-react';

// 2. Define the `Session` configuration. You should provide a name using a `participantInfo` object, eg. the name of the participant who established the session.
const participantInfo = { name: 'John Doe' };

// 3. Insert the `Session` component, along with the `participantInfo` property, anywhere inside of `Content` component.
function Content() {
  return (
    <div className="App" style={contentContainerStyle}>
      {/* Code from previous examples has been removed for brevity */}
      <Session participantInfo={participantInfo}>
        <InfoBar text="Session has been created." style={{ margin: '0 auto' }} />
      </Session>
      ...
    </div>
  );
}
```

> If you would like to create a session using your own component, refer to the [useSession](documentation/hooks/useSession.md) hook.

### Add video call components

Once your app has made the connection to Dolby.io, you can access its video call features.

#### Join or leave a conference

A conference connects participants to one another, enabling them to communicate using audio and/or video.

```javascript
// src/App.js

// 1. Import `Conference`, `JoinConferenceButton` and `LeaveConferenceButton` from the UI kit.
import { Session, Conference, JoinConferenceButton, LeaveConferenceButton } from '@dolbyio/comms-uikit-react';

// 2. import `useState` from React.
import { useState } from 'react';

// 3. Define the `JoinConferenceButton` configuration. You can specify whether to join the conference with audio and/or video enabled, in addition to a meetingName and username (usually the name of current user) which can be made visible to all participants.

const joinOptions = {
  constraints: {
    audio: true,
    video: true,
  },
};

const meetingName = 'My Meeting';

// 4. Define the tooltips that are shown when hovering over the Join or Leave buttons.
const joinTooltipText = 'Join meeting';
const leaveTooltipText = 'Leave meeting';

function Content() {
  // 5. Define the state for the conference ID.
  const [conferenceId, setConferenceId] = useState();

  // 6. Define styles for the containers
  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  /*
  7. Insert the `Conference`, `JoinConferenceButton` and `LeaveConferenceButton` components, along with the `joinOptions` and `meetingName` properties, anywhere inside of `Session`. We want to show "JoinConferenceButton" when there's no conference ID, and "Conference" (which includes the `LeaveConferenceButton`) when there is.

  We also pass `setConferenceId` as a callback to the `onSuccess` properties for both buttons which will set (or unset) the conference ID when the action is successful.

  IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io, If you are using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done!
*/

  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        {/* Code from previous examples has been removed for brevity */}
        {!conferenceId ? (
          <div style={buttonContainerStyle}>
            <JoinConferenceButton
              joinOptions={joinOptions}
              meetingName={meetingName}
              username={participantInfo.name}
              tooltipText={joinTooltipText}
              onSuccess={(id) => setConferenceId(id)}
            >
              Join Video Call
            </JoinConferenceButton>
          </div>
        ) : (
          <Conference id={conferenceId}>
            <div style={buttonContainerStyle}>
              <LeaveConferenceButton tooltipText={leaveTooltipText} onSuccess={() => setConferenceId(null)} />
            </div>
          </Conference>
        )}
      </Session>
    </div>
  );
}
```

> If you would like to create, join or leave a conference using your own components, refer to the [useConference](documentation/hooks/useConference.md) hook.

#### Display participants

The `ParticipantsList` component can display a list of participants in the current conference and their status, eg. whether the participant is currently speaking.

```javascript
// src/App.js

// 1. Import `ParticipantsList` from the UI kit.
import { Session, Conference, ParticipantsList } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsList` configuration. You can customize the text shown for each participant and their status.
const localText = 'you'; // The local participant's name.
const muteText = 'mute'; // Displayed in a tooltip when a participant is not muted.
const unmuteText = 'unmute'; // Displayed in a tooltip when a participant is muted.
const soundOnText = 'sound on'; // Displayed in a tooltip when a participant is speaking.
const soundOffText = 'sound off'; // Displayed in a tooltip when a participant is not speaking.

// 3. Insert the `ParticipantsList` component, along with the text properties, anywhere inside of `Conference`.
function Content() {
  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        {/* Code from previous examples has been removed for brevity */}
        <Conference id={conferenceId}>
          <ParticipantsList
            localText={localText}
            muteText={muteText}
            unmuteText={unmuteText}
            soundOnText={soundOnText}
            soundOffText={soundOffText}
          />
          <div style={buttonContainerStyle}>
            <LeaveConferenceButton tooltipText={leaveTooltipText} onSuccess={() => setConferenceId(null)} />
          </div>
        </Conference>
      </Session>
    </div>
  );
}
```

> If you would like to display participants using your own component, refer to the [useParticipants](documentation/hooks/useParticipants.md) hook.

#### Display video

The `ParticipantsGrid` component displays the video streams of conference participants in a grid tile layout.

```javascript
// src/App.js

// 1. Import `ParticipantsGrid` from the UI kit.
import { Session, Conference, ParticipantsGrid } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsGrid` configuration. You can customize the text shown for the current participant and their status.
const localText = 'you'; // The local participant's name.

// 3. Insert the `ParticipantsGrid` component, along with the `localText` property, anywhere inside of `Conference`.
function Content() {
  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        <Conference id={conferenceId}>
          {/* Code from previous examples has been removed for brevity */}
          <ParticipantsGrid localText={localText} additionalContainerStyle={{ height: 400 }} />
          <div style={buttonContainerStyle}>
            <LeaveConferenceButton tooltipText={leaveTooltipText} onSuccess={() => setConferenceId(null)} />
          </div>
        </Conference>
      </Session>
    </div>
  );
}
```

#### Show user controls

The `LocalToggleAudioButton` and `LocalToggleVideoButton` components enable the local participant to toggle their microphone and camera on or off.

```javascript
// src/App.js

// 1. Import `LocalToggleAudioButton` and `LocalToggleVideoButton` from the UI kit.
import { Session, Conference, LocalToggleAudioButton, LocalToggleVideoButton } from '@dolbyio/comms-uikit-react';

// 2. Insert the `LocalToggleAudioButton` and `LocalToggleVideoButton` components anywhere inside of `Conference`.
function Content() {
  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        <Conference id={conferenceId}>
          {/* Code from previous examples has been removed for brevity */}
          <div style={buttonContainerStyle}>
            <LocalToggleAudioButton />
            <LocalToggleVideoButton />
            {/* Code from previous examples has been removed for brevity */}
          </div>
        </Conference>
      </Session>
    </div>
  );
}
```

> If you would like to control audio or video using your own components, refer to the [useAudio](documentation/hooks/useAudio.md) and [useVideo](documentation/hooks/useVideo.md) hooks.

#### Change input or output devices

The local participant can change their preferred camera, microphone or output speaker using the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components.

```javascript
// src/App.js

// 1. Import `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` from the UI kit.
import { Session, Conference, CameraSelect, MicrophoneSelect, SpeakersSelect } from '@dolbyio/comms-uikit-react';

// 2. Define the `CameraSelect`, `MicrophoneSelect`, and `SpeakersSelect` configurations: each component takes a `label` prop (shown above the component) and a `placeholder` prop (shown when no option is selected).
const cameraLabel = 'Camera';
const cameraPlaceholder = 'Choose a camera';

const microphoneLabel = 'Microphone';
const microphonePlaceholder = 'Choose a microphone';

const speakersLabel = 'Speaker';
const speakersPlaceholder = 'Choose a speaker';

// 3. Insert the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components, along with the `label` and `placeholder` properties, anywhere inside of `Conference`.
function Content() {
  return (
    <div className="App" style={contentContainerStyle}>
      <Session participantInfo={participantInfo}>
        <Conference id={conferenceId}>
          {/* Code from previous examples has been removed for brevity */}
          <CameraSelect label={cameraLabel} placeholder={cameraPlaceholder} labelColor="white" />
          <MicrophoneSelect label={microphoneLabel} placeholder={microphonePlaceholder} labelColor="white" />
          <SpeakersSelect label={speakersLabel} placeholder={speakersPlaceholder} labelColor="white" />
        </Conference>
      </Session>
    </div>
  );
}
```

> If you would like to control input devices using your own components, refer to the [useCamera](documentation/hooks/useCamera.md), [useMicrophone](documentation/hooks/useMicrophone.md) and [useSpeaker](documentation/hooks/useSpeaker.md) hooks.

#### Observe participants' status

You can use the installed VoxeedSDK's APIs in the application directly without relying on our UIKit components. Let's enhance our example app to observe the participants' status.

```javascript
// src/App.js

// 1. import Voxeet SDK
import VoxeetSDK from '@voxeet/voxeet-web-sdk';

// 2. import `useEffect` from React.
import { useEffect } from 'react';

// ... exsiting code

function Content() {
  // 3. insert the useEffect hook here
  useEffect(() => {
    // 4. define the event handler here
    const handler = (participant) => {
      console.log(participant.info.name, 'status:', participant.status);
      console.log(participant.info.name, 'has audio enabled:', participant.audioTransmitting);
    };
    // 5. register the handler for 'participantUpdated' event
    VoxeetSDK.conference.on('participantUpdated', handler);
    return () => {
      // 6. unregister the handler
      VoxeetSDK.conference.removeListener('participantUpdated', handler);
    };
  }, []);

  // ... existing code
}
```

> More information about Voxeet WebSDK is [here](https://docs.dolby.io/communications-apis/docs/js-overview)

## Theming

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

## Optional Features

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
// Step 1 - Add the necessary imports
import { useLogger } from '@dolbyio/comms-uikit-react';

// Step 2 - Consume the hook
const { log } = useLogger();

// Step 3 - Write your log methods
//... your code above
log(LogLevel.error, 'Error occured while retrieving microphone permission', error);
// ...
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

## License

The Dolby.io Communications UIKit for React and its repository are licensed under the MIT License. Before using the package `@dolbyio/comms-uikit-react`, please review and accept the [Dolby Software License Agreement](LICENSE).

Third-party licenses can be found [here](third-party-licenses.json).

&copy; Dolby, 2022
