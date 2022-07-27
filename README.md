# Dolby.io Communications UIKit for React

## Overview

This UIKit is designed to help React developers reduce the complexity of building a Dolby.io video conferencing application for the web.

The package consists of four elements:

- Providers: These provide the integration with the [Dolby.io](https://dolby.io/) Communications APIs and associated state management.
- Hooks: Functions that provide reusable, shared logic for video calling applications.
- UI components: Basic elements that cover popular UI patterns of web applications.
- Video call components: UI components composed with hooks that provide widely used video call features.

> To see a video call kickstart app that shows the UIKit in action, check out our [GitHub](https://github.com/dolbyio-samples/comms-app-react-videocall).

> For a complete list of components and their usage, go to the [documentation folder](documentation/components).

## Getting Started

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Steps](#steps)
  - [Connect your app to Dolby.io](#connect-your-app-to-dolbyio)
    - [Initialise the SDK](#initialise-the-sdk)
    - [Open a session](#open-a-session)
  - [Add video call features](#add-video-call-features)
    - [Create a conference](#create-a-conference)
    - [Display participants](#display-participants)
    - [Display video](#display-video)
    - [Show user controls](#show-user-controls)
    - [Change input or output devices](#change-input-or-output-devices)
    - [Leave a conference](#leave-a-conference)
- [Optional Features](#optional-features)
  - [Hooks](#hooks)
  - [Theming](#theming)
- [License](#license)

## Prerequisites

- An account with Dolby.io. [Sign up](https://dashboard.dolby.io/signup/) if you don't have one, it's free!
- A Dolby.io [client access token](https://dashboard.dolby.io/dashboard/applications/summary).
- [Node.js 16.x](https://nodejs.org/en/) or later.
- A supported browser, either Chrome 100+, Safari 15+, Firefox 100+, or Edge 100+.

## Setup

```bash
# Create a new React application
npx create-react-app my-app

# Change into the app directory
cd my-app

# Install the UI kit with npm...
npm install @dolbyio/comms-uikit-react --save

# ...or yarn (skip this if you used npm)
yarn add @dolbyio/comms-uikit-react

# Start the dev server
npm start
```

## Steps

### Connect your app to Dolby.io

This section will guide you on opening a connection to the Dolby.io APIs, which will enable the use of video calling features in your app.

#### Initialise the SDK

Dolby.io integration is provided by a `CommsProvider` component, which should be imported and configured at the root of your web app, eg. `src/App.js`.

```javascript
// src/App.js

import logo from './logo.svg';
import './App.css';

// 1. Import `CommsProvider` from the UI kit.
import { CommsProvider } from '@dolbyio/comms-uikit-react';

// 2. Define the `CommsProvider` configuration: we need two props, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// 3. Wrap the existing app code with the configured `CommsProvider`, passing in the `token` and `refreshToken` props.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">...</div>
    </CommsProvider>
  );
}

export default App;
```

> This approach is only for demo purposes. To properly initialise your app for production, see our guide to [API authentication](https://docs.dolby.io/communications-apis/docs/guides-api-authentication#initialize-the-sdk-with-secure-authentication).

#### Open a session

A session is a connection between the client application and the Dolby.io Communications API.

```javascript
// src/App.js

// 1. Import `Session` from the UI kit.
import { CommsProvider, Session } from '@dolbyio/comms-uikit-react';

// 2. Define the `Session` configuration: you should provide a name using a `participantInfo` object, eg. the name of the participant who established the session.
const participantInfo = { name: 'John Doe' };

// 3. Insert the `Session` component, along with the `participantInfo` prop, anywhere inside of `CommsProvider`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>...</Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to create a session using your own component, refer to our [useSession](documentation/hooks/useSession.md) hook.

### Add video call features

Once your app has made the connection to Dolby.io, you can access its video call features.

#### Create a conference

A conference connects participants to one another, enabling them to communicate using audio and/or video.

```javascript
// src/App.js

// 1. Import `Conference` from the UI kit.
import { CommsProvider, Session, Conference } from '@dolbyio/comms-uikit-react';

// 2. Define the `Conference` configuration: you can specify whether to join the conference with audio and/or video enabled, in addition to an alias which can be made visible to all participants.
const audio = true;
const video = true;
const alias = 'My Meeting';

// 3. Insert the `Conference` component, along with the `audio`, `video` and `alias` props, anywhere inside of `Session`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            ...
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to create a conference using your own component, refer to our [useConference](documentation/hooks/useConference.md) hook.

#### Display participants

The `ParticipantsList` component can display a list of participants in the current conference and their status, eg. whether the participant is currently speaking.

```javascript
// src/App.js

// 1. Import `ParticipantsList` from the UI kit.
import { CommsProvider, Session, Conference, ParticipantsList } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsList` configuration: you can customise the text shown for each participant and their status.
const localText = 'you'; // The local participant's name.
const muteText = 'mute'; // Displayed in a tooltip when a participant is not muted.
const unmuteText = 'unmute'; // Displayed in a tooltip when a participant is muted.
const soundOnText = 'sound on'; // Displayed in a tooltip when a participant is speaking.
const soundOffText = 'sound off'; // Displayed in a tooltip when a participant is not speaking.

// 3. Insert the `ParticipantsList` component, along with the text props, anywhere inside of `Conference`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            {/*} Code from previous examples has been removed for brevity */}
            <ParticipantsList
              localText={localText}
              muteText={muteText}
              unmuteText={unmuteText}
              soundOnText={soundOnText}
              soundOffText={soundOffText}
            />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to display participants using your own component, refer to our [useParticipants](documentation/hooks/useParticipants.md) hook.

#### Display video

The `ParticipantsGrid` component displays the video streams of conference participants in a grid tile layout.

```javascript
// src/App.js

// 1. Import `ParticipantsGrid` from the UI kit.
import { CommsProvider, Session, Conference, ParticipantsGrid } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsGrid` configuration: you can customise the text shown for the current participant and their status.
const localText = 'you'; // The local participant's name.

// 3. Insert the `ParticipantsGrid` component, along with the `localText` prop, anywhere inside of `Conference`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            {/*} Code from previous examples has been removed for brevity */}
            <ParticipantsGrid localText={localText} />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

#### Show user controls

The `LocalToggleAudioButton` and `LocalToggleVideoButton` components enable the local participant to toggle their microphone and camera on or off.

```javascript
// src/App.js

// 1. Import `LocalToggleAudioButton` and `LocalToggleVideoButton` from the UI kit.
import {
  CommsProvider,
  Session,
  Conference,
  LocalToggleAudioButton,
  LocalToggleVideoButton,
} from '@dolbyio/comms-uikit-react';

// 2. Insert the `LocalToggleAudioButton` and `LocalToggleVideoButton` components anywhere inside of `Conference`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            {/*} Code from previous examples has been removed for brevity */}
            <LocalToggleAudioButton />
            <LocalToggleVideoButton />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to control audio or video using your own components, refer to our [useAudio](documentation/hooks/useAudio.md) and [useVideo](documentation/hooks/useVideo.md) hooks.

#### Change input or output devices

The local participant can change their preferred camera, microphone or output speaker using the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components.

```javascript
// src/App.js

// 1. Import `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` from the UI kit.
import {
  CommsProvider,
  Session,
  Conference,
  CameraSelect,
  MicrophoneSelect,
  SpeakersSelect,
} from '@dolbyio/comms-uikit-react';

// 2. Define the configuration: each component takes a `label` prop (shown above the component) and a `placeholder` prop (shown when no option is selected).
const cameraLabel = 'Camera';
const cameraPlaceholder = 'Choose a camera';

const microphoneLabel = 'Microphone';
const microphonePlaceholder = 'Choose a microphone';

const speakersLabel = 'Speaker';
const speakersPlaceholder = 'Choose a speaker';

// 3. Insert the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components, along with the `label` and `placeholder` props, anywhere inside of `Conference`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            {/*} Code from previous examples has been removed for brevity */}
            <CameraSelect label={cameraLabel} placeholder={cameraPlaceholder} />
            <MicrophoneSelect label={microphoneLabel} placeholder={microphonePlaceholder} />
            <SpeakersSelect label={speakersLabel} placeholder={speakersPlaceholder} />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to control input devices using your own components, refer to our [useCamera](documentation/hooks/useCamera.md), [useMicrophone](documentation/hooks/useMicrophone.md) and [useSpeaker](documentation/hooks/useSpeaker.md) hooks.

#### Leave a conference

The `LeaveConferenceButton` component, when pressed, will enable the local participant to leave the conference.

```javascript
// src/App.js

// 1. Import `LeaveConferenceButton` from the UI kit.
import { CommsProvider, Session, Conference, LeaveConferenceButton } from '@dolbyio/comms-uikit-react';

// 2. Insert the `LeaveConferenceButton` component anywhere inside of `Conference`.
function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          <Conference audio={audio} video={video} alias={alias}>
            {/*} Code from previous examples has been removed for brevity */}
            <LeaveConferenceButton />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}
```

> If you would like to leave a conference using your own component, refer to our [useConference](documentation/hooks/useConference.md) hook.

## Optional Features

### Hooks

The UI components referenced in this guide use custom hooks to connect to the [Dolby.io Communications APIs](https://docs.dolby.io/communications-apis/docs).

If you would like to connect to our APIs using your own UI components, we have exported these hooks for your convenience which will enable you to add conferencing features to your application as needed.

Click on the name of the hook for detailed usage instructions.

| Hook                                                      | Description                                                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [useSession](documentation/hooks/useSession.md)           | Enables opening and closing sessions, as well as information about the local participant.                |
| [useConference](documentation/hooks/useConference.md)     | Enables creating, joining or leaving conferences.                                                        |
| [useParticipants](documentation/hooks/useParticipants.md) | Provides information about participants in the current conference and their status.                      |
| [useAudio](documentation/hooks/useAudio.md)               | Can be used to mute or unmute audio for local and remote participants.                                   |
| [useVideo](documentation/hooks/useVideo.md)               | Can be used to enable or disable the camera for the local participant.                                   |
| [useCamera](documentation/hooks/useCamera.md)             | Lists and selects available cameras, in addition to requesting camera permissions from the user.         |
| [useMicrophone](documentation/hooks/useMicrophone.md)     | Lists and selects available microphones, in addition to requesting microphone permissions from the user. |
| [useSpeaker](documentation/hooks/useSpeaker.md)           | Lists and selects available output speakers.                                                             |

### Theming

An optional `ThemeProvider` component enables customisation. For detailed usage information for the component, see [ThemeProvider](documentation/providers/ThemeProvider.md). To see the complete range of values that can be overriden, refer to the [default theme](src/theme/defaultTheme.ts).

```javascript
// src/App.js

// 1. Import `ThemeProvider` from the UI kit.
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

// 2. Define a custom theme: any values provided here will be merged with the default theme.
const theme = {
  colors: {
    background: 'white',
  },
};

// 3. Wrap the existing app code with the configured `ThemeProvider`, passing in the `theme` prop.
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App">...</div>
      </CommsProvider>
    </ThemeProvider>
  );
}
```

## License

The Dolby.io Communications UIKit for React and its repository are licensed under the MIT License. Before using the package `@dolbyio/comms-uikit-react`, please review and accept the [Dolby Software License Agreement](LICENSE).

Third-party licenses can be found [here](third-party-licenses.json).

&copy; Dolby, 2022
