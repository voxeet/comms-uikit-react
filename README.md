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
  - [Optional Features](#optional-features)
    - [Hooks](#hooks)
    - [Theming](#theming)
  - [License](#license)

## Prerequisites

- A [Dolby.io](https://dashboard.dolby.io/signup/) account
- A working webcam and microphone
- A Dolby.io [client access token](https://dashboard.dolby.io/dashboard/applications/summary)
- [Voxeet Web SDK >=3.6.0](https://www.npmjs.com/package/@voxeet/voxeet-web-sdk) or later
- [Node.js 16.x](https://nodejs.org/en/) or later
- A supported browser, either Chrome 100+, Safari 15+, Firefox 100+, or Edge 100+

## How to use this guide

This guide demonstrates how to use video call UI components to quickly build the essential components of a video call application. Be sure to complete the [Connect your app to Dolby.io](#connect-your-app-to-dolbyio) section before moving onto the [Add video call components](#add-video-call-components) section.

Each component demonstrated within [Add video call components](#add-video-call-components) can be built independent of the others. The code blocks within each section only include the code for that individual component, and exclude the components from other sections.

If you prefer to get started by reviewing a complete code sample containing all of the features in this guide, see [the example here](examples/example_App.js).

## Setup

```bash
# Create a new React application
npx create-react-app my-app

# Change into the app directory
cd my-app

# Install the Voxeet SDK and UI kit with npm...
npm install @voxeet/voxeet-web-sdk @dolbyio/comms-uikit-react --save

# ...or yarn (skip this if you used npm)
yarn add @voxeet/voxeet-web-sdk @dolbyio/comms-uikit-react

# Start the dev server
npm start
```

## Steps

### Connect your app to Dolby.io

This section will guide you on opening a connection to the Dolby.io APIs, which will enable the use of video calling features in your app.

#### Initialize the SDK

Dolby.io integration is provided by a `CommsProvider` component (for communication with our APIs) and a `ThemeProvider` component (provides the look and feel), which should be imported and configured at the root of your web app, eg. `src/App.js`.

```javascript
// src/App.js

import logo from './logo.svg';
import './App.css';

// 1. Import `CommsProvider` and `ThemeProvider` from the UI kit.
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

// 2. Define the `CommsProvider` configuration. We need two properties, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// 3. Wrap the existing app code with `ThemeProvider` and the configured `CommsProvider`, passing in the `token` and `refreshToken` properties. We'll also add a fixed height to the app as we'll need this later in the guide.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          ...
        </div>
      </CommsProvider>
    </ThemeProvider>
  );
}

export default App;
```

> This approach is only for demo purposes. To properly initialize your app for production, see [API Authentication](https://docs.dolby.io/communications-apis/docs/guides-api-authentication#initialize-the-sdk-with-secure-authentication) and [Client Authentication](https://docs.dolby.io/communications-apis/docs/guides-client-authentication).

#### Open a session

A session is a connection between the client application and the Dolby.io Communications APIs.

```javascript
// src/App.js

// 1. Import `Session` from the UI kit.
import { CommsProvider, ThemeProvider, Session } from '@dolbyio/comms-uikit-react';

// 2. Define the `Session` configuration. You should provide a name using a `participantInfo` object, eg. the name of the participant who established the session.
const participantInfo = { name: 'John Doe' };

// 3. Insert the `Session` component, along with the `participantInfo` property, anywhere inside of `CommsProvider`.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>...</Session>
        </div>
      </CommsProvider>
    </ThemeProvider>
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
import {
  CommsProvider,
  ThemeProvider,
  Session,
  Conference,
  JoinConferenceButton,
  LeaveConferenceButton,
} from '@dolbyio/comms-uikit-react';

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
const username = 'John Doe';

// 4. Define the tooltips that are shown when hovering over the Join or Leave buttons.
const joinTooltipText = 'Join meeting';
const leaveTooltipText = 'Leave meeting';

function App() {
  // 5. Define the state for the conference ID.
  const [conferenceId, setConferenceId] = useState();

  /*
  6. Insert the `Conference`, `JoinConferenceButton` and `LeaveConferenceButton` components, along with the `joinOptions` and `meetingName` properties, anywhere inside of `Session`. We want to show "JoinConferenceButton" when there's no conference ID, and "Conference" (which includes the `LeaveConferenceButton`) when there is.

  We also pass `setConferenceId` as a callback to the `onSuccess` properties for both buttons which will set (or unset) the conference ID when the action is successful.

  IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io, If you are using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done!
*/

  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>
            {!conferenceId ? (
              <JoinConferenceButton
                joinOptions={joinOptions}
                meetingName={meetingName}
                username={username}
                tooltipText={joinTooltipText}
                onSuccess={(id) => setConferenceId(id)}
              >
                Join Video Call
              </JoinConferenceButton>
            ) : (
              <Conference id={conferenceId}>
                <LeaveConferenceButton tooltipText={leaveTooltipText} onSuccess={() => setConferenceId(null)} />
              </Conference>
            )}
          </Session>
        </div>
      </CommsProvider>
    </ThemeProvider>
  );
}
```

> If you would like to create, join or leave a conference using your own components, refer to the [useConference](documentation/hooks/useConference.md) hook.

#### Display participants

The `ParticipantsList` component can display a list of participants in the current conference and their status, eg. whether the participant is currently speaking.

```javascript
// src/App.js

// 1. Import `ParticipantsList` from the UI kit.
import { CommsProvider, ThemeProvider, Session, Conference, ParticipantsList } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsList` configuration. You can customize the text shown for each participant and their status.
const localText = 'you'; // The local participant's name.
const muteText = 'mute'; // Displayed in a tooltip when a participant is not muted.
const unmuteText = 'unmute'; // Displayed in a tooltip when a participant is muted.
const soundOnText = 'sound on'; // Displayed in a tooltip when a participant is speaking.
const soundOffText = 'sound off'; // Displayed in a tooltip when a participant is not speaking.

// 3. Insert the `ParticipantsList` component, along with the text properties, anywhere inside of `Conference`.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>
            <Conference id={conferenceId}>
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
    </ThemeProvider>
  );
}
```

> If you would like to display participants using your own component, refer to the [useParticipants](documentation/hooks/useParticipants.md) hook.

#### Display video

The `ParticipantsGrid` component displays the video streams of conference participants in a grid tile layout.

```javascript
// src/App.js

// 1. Import `ParticipantsGrid` from the UI kit.
import { CommsProvider, ThemeProvider, Session, Conference, ParticipantsGrid } from '@dolbyio/comms-uikit-react';

// 2. Define the `ParticipantsGrid` configuration. You can customize the text shown for the current participant and their status.
const localText = 'you'; // The local participant's name.

// 3. Insert the `ParticipantsGrid` component, along with the `localText` property, anywhere inside of `Conference`.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>
            <Conference id={conferenceId}>
              {/*} Code from previous examples has been removed for brevity */}
              <ParticipantsGrid localText={localText} />
            </Conference>
          </Session>
        </div>
      </CommsProvider>
    </ThemeProvider>
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
  ThemeProvider,
  Session,
  Conference,
  LocalToggleAudioButton,
  LocalToggleVideoButton,
} from '@dolbyio/comms-uikit-react';

// 2. Insert the `LocalToggleAudioButton` and `LocalToggleVideoButton` components anywhere inside of `Conference`.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>
            <Conference id={conferenceId}>
              {/*} Code from previous examples has been removed for brevity */}
              <LocalToggleAudioButton />
              <LocalToggleVideoButton />
            </Conference>
          </Session>
        </div>
      </CommsProvider>
    </ThemeProvider>
  );
}
```

> If you would like to control audio or video using your own components, refer to the [useAudio](documentation/hooks/useAudio.md) and [useVideo](documentation/hooks/useVideo.md) hooks.

#### Change input or output devices

The local participant can change their preferred camera, microphone or output speaker using the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components.

```javascript
// src/App.js

// 1. Import `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` from the UI kit.
import {
  CommsProvider,
  ThemeProvider,
  Session,
  Conference,
  CameraSelect,
  MicrophoneSelect,
  SpeakersSelect,
} from '@dolbyio/comms-uikit-react';

// 2. Define the `CameraSelect`, `MicrophoneSelect`, and `SpeakersSelect` configurations: each component takes a `label` prop (shown above the component) and a `placeholder` prop (shown when no option is selected).
const cameraLabel = 'Camera';
const cameraPlaceholder = 'Choose a camera';

const microphoneLabel = 'Microphone';
const microphonePlaceholder = 'Choose a microphone';

const speakersLabel = 'Speaker';
const speakersPlaceholder = 'Choose a speaker';

// 3. Insert the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components, along with the `label` and `placeholder` properties, anywhere inside of `Conference`.
function App() {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          <Session participantInfo={participantInfo}>
            <Conference id={conferenceId}>
              {/*} Code from previous examples has been removed for brevity */}
              <CameraSelect label={cameraLabel} placeholder={cameraPlaceholder} />
              <MicrophoneSelect label={microphoneLabel} placeholder={microphonePlaceholder} />
              <SpeakersSelect label={speakersLabel} placeholder={speakersPlaceholder} />
            </Conference>
          </Session>
        </div>
      </CommsProvider>
    </ThemeProvider>
  );
}
```

> If you would like to control input devices using your own components, refer to the [useCamera](documentation/hooks/useCamera.md), [useMicrophone](documentation/hooks/useMicrophone.md) and [useSpeaker](documentation/hooks/useSpeaker.md) hooks.

## Optional Features

### Hooks

The UI components use custom hooks to connect to the [Dolby.io Communications APIs](https://docs.dolby.io/communications-apis/docs).

If you would like to connect to the Dolby.io Communications APIs using your own UI components, you can use the following exported hooks to add conferencing features to your application:

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

Themes allow you to customize all design aspects of your project in order to meet the specific needs of your business or brand and have a consistent tone of your application. Themes allow you to configure colors of components, the darkness of surfaces, level of shadow, and the opacity of ink elements.

The `ThemeProvider` component enables customisation. When used as is, it will provide a default look and feel for your app, but customisation is possible. For more information, see [ThemeProvider](documentation/providers/ThemeProvider.md).

```javascript
// src/App.js

// 1. Import `ThemeProvider` from the UI kit.
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

// 2. Define a custom theme. Any values provided here will be merged with the default theme.
const theme = {
  grey: {
    100: 'cyan', // This will change basic Text elements and the borders around certain UI elements to cyan
  },
};

// 3. Pass the custom theme object into the ThemeProvider's `theme` property.
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CommsProvider token={token} refreshToken={refreshToken}>
        <div className="App" style={{ height: 400 }}>
          ...
        </div>
      </CommsProvider>
    </ThemeProvider>
  );
}
```

## License

The Dolby.io Communications UIKit for React and its repository are licensed under the MIT License. Before using the package `@dolbyio/comms-uikit-react`, please review and accept the [Dolby Software License Agreement](LICENSE).

Third-party licenses can be found [here](third-party-licenses.json).

&copy; Dolby, 2022
