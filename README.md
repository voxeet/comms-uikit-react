# Dolby.io Communications UIKit for React

## Overview

The Dolby.io Communications UIKit for React is designed to help React developers reduce the complexity of building apps based on the [Dolby.io Communications SDK for Web](https://docs.dolby.io/communications-apis/docs/js-overview).

The package consists of four basic elements:

- `Providers`: The main components for initializing integration with [Dolby.io](https://dolby.io/) Communications APIs and state management.
- `Hooks`: Functions responsible for video call logic of video call applications.
- `UI components`: Components that cover the most popular patterns of video conferencing applications.
- `Conference components`: UI components with built-in logic for the most widely used video call/live events features.

> If you prefer to get started by reviewing a complete code sample of this guide, see [the example here](examples/example_Foundations.js).

> For a complete list of components and their usage, go to the [documentation folder](documentation/components).

## Sample Projects

The following Dolby.io sample projects demonstrates the UIkit in action:

- [Video Call app](https://github.com/dolbyio-samples/comms-app-react-videocall)
  - Build and embed a one-to-one or small-group live video conferencing app with features like recording, screen share, background blur and more.
- [Events app](https://github.com/dolbyio-samples/comms-app-react-events)
  - Develop and customize a virtual event application with Dolby-quality audio/video and ultra-low latency.

## Getting Started

- [Dolby.io Communications UIKit for React](#dolbyio-communications-uikit-for-react)
  - [Overview](#overview)
  - [Sample Projects](#sample-projects)
  - [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [Supported Browsers](#supported-browsers)
  - [How to use this guide](#how-to-use-this-guide)
  - [Setup](#setup)
    - [How to get a Dolby.io account](#how-to-get-a-dolbyio-account)
    - [How to obtain access token](#how-to-obtain-access-token)
  - [Steps](#steps)
    - [Connect your app to Dolby.io](#connect-your-app-to-dolbyio)
      - [Initialize the SDK](#initialize-the-sdk)
      - [Open a session](#open-a-session)
    - [Add components](#add-components)
      - [Join or leave a session](#join-or-leave-a-session)
      - [Display participants](#display-participants)
      - [Display video](#display-video)
      - [Show user controls](#show-user-controls)
      - [Change input or output devices](#change-input-or-output-devices)
      - [Observe participants' status](#observe-participants-status)
    - [Additional configuration](#additional-configuration)
  - [License](#license)

## Prerequisites

- A [Dolby.io](https://dashboard.dolby.io/signup/) account
- A Dolby.io [client access token](https://dashboard.dolby.io/dashboard/applications/summary)
- [Voxeet Web SDK >=3.8.0](https://www.npmjs.com/package/@voxeet/voxeet-web-sdk) or later
- [Node.js 16.x](https://nodejs.org/en/) or later
- [Yarn v1.22.19](https://yarnpkg.com) installed.
- A working webcam and microphone

### Supported Browsers

This UI kit is tested to work best with the following browser versions

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+

## How to use this guide

This guide demonstrates how to use UI components to quickly build the essential components of a Dolby.IO Communications SDK based app. Be sure to complete the [Connect your app to Dolby.io](#connect-your-app-to-dolbyio) section before moving onto the [Adding components](#add-components) section.

Each component demonstrated within [Add video call components](#add-components) can be built independent of the others. The code blocks within each section only include the code for that individual component, and exclude the components from other sections.

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

### How to get a Dolby.io account

To setup your Dolby.io account, go to [Dolby.io dashboard](https://dashboard.dolby.io) and complete the form. After confirming your email address, you will be logged in.

### How to obtain access token

You will need to generate a client access token to run this app. Follow the steps to obtain a token.

1. Go to the Dashboard, and find the _Applications_ menu item, ![dashboard](documentation/assets/Dashboard.png)

2. On the next screen, there is a token field where you can copy the client access token to your clipboard. The generated token is active for the indicated amount of time.

   ![token](documentation/assets/apps-dashboard.png)

## Steps

### Connect your app to Dolby.io

This section will guide you on connecting to the Dolby.io APIs, which will enable the use of our Communications related features.

#### Initialize the SDK

Dolby.io integration is provided by a `CommsProvider` component (for communication with our APIs), which should be imported and configured at the root of your web app, eg. `src/App.js`. Replace the placeholder value for `token` with your [client access token](#how-to-obtain-access-token) from the [Dolby.io dashboard](https://dashboard.dolby.io).

> For the purpose of this demo, you will only be working in `src/App.js`. This file follows the structure below:
>
> 1. `Import statements`
> 2. `Global variables`
> 3. `AppBase Component`
> 4. `Content Component`
> 5. `App`

```javascript
// src/App.js

// 1. Import `CommsProvider` and `ThemeProvider` from the UI kit.
import { CommsProvider, InfoBar } from '@dolbyio/comms-uikit-react';

// 2. Define the `CommsProvider` configuration. We need two properties, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// 3. Create wrapper with `CommsProvider` for entire app. Pass the `token` and `refreshToken` properties.

const AppBase = ({ children }) => {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      {children}
    </CommsProvider>
  );
};

// 4. Create `Content` component. It will be main component of our app. Wrap it with previously created `AppBase`. We'll also add a fixed height to the content as we'll need this later in the guide.

function Content() {
  // 5. Define styles for the main content and button containers
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
  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

1. Import `Session` from the UI kit.

```javascript
import { Session } from '@dolbyio/comms-uikit-react';
```

2. Define the `Session` configurations in the `Content` Component. You should provide a name using a [`participantInfo`](https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-participantinfo) object, eg. the name of the participant who established the session.

```javascript
const participantInfo = { name: 'John Doe' };
```

3. Insert the `Session` component inside the return statement in `Content` component.

```javascript
<Session participantInfo={participantInfo}>
  <InfoBar text="Session has been created." style={{ margin: '0 auto' }} />
</Session>
```

> If you would like to create a session using your own component, refer to the [useSession](documentation/hooks/useSession.md) hook.

### Add components

Once your app has made the connection to Dolby.io, you can access its features.

#### Join or leave a session

A session connects participants to one another, enabling them to communicate using audio and/or video.

1. Import `Conference`, `JoinConferenceButton` and `LeaveConferenceButton` from the UI kit. Import `useState` from React.

```javascript
import { Conference, JoinConferenceButton, LeaveConferenceButton } from '@dolbyio/comms-uikit-react';
import { useState } from 'react';
```

2. Define the `JoinConferenceButton` configuration in the `Content` component. The [`joinOptions`](https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-joinoptions) property allows you to specify whether to join the conference with audio and/or video enabled, in addition to a meetingName and username (usually the name of current user) which can be made visible to all participants.

```javascript
const joinOptions = {
  constraints: {
    audio: true,
    video: true,
  },
};
```

3. Define a functional component `JoinOrLeave` with a state for conference ID. Insert the `Conference`, `JoinConferenceButton` and `LeaveConferenceButton` components, along with the `joinOptions` and `meetingName`. We want to show `JoinConferenceButton` when there is no conference ID, and `Conference` (which includes the `LeaveConferenceButton`) when there is. You can customise the `toolipText` property each respective join/leave buttons. Now, insert `<JoinOrLeave>` component inside the return statement in `Content` component (ie. Nested inside `Session`).

We also pass `setConferenceId` as a callback to the `onSuccess` properties for both buttons which will set (or unset) the conference ID when the action is successful.

> IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io, If you are using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done!

```javascript
const JoinOrLeave = () => {
  const [conferenceId, setConferenceId] = useState();

  return !conferenceId ? (
    <div style={buttonContainerStyle}>
      <JoinConferenceButton
        joinOptions={joinOptions}
        meetingName="My Meeting"
        username={participantInfo.name}
        tooltipText="Join Meeting"
        onSuccess={(id) => setConferenceId(id)}
      >
        Join Video Call
      </JoinConferenceButton>
    </div>
  ) : (
    <Conference id={conferenceId}>
      <div style={buttonContainerStyle}>
        <LeaveConferenceButton tooltipText="Leave Meeting" onSuccess={() => setConferenceId(null)} />
      </div>
    </Conference>
  );
};
```

> If you would like to create, join or leave a conference using your own components, refer to the [useConference](documentation/hooks/useConference.md) hook.

All of the video call components below are assumed to be wrapped within an `Conference` component that resides within the [`Session`](#open-a-session) Component. The components are all defined and rendered within the `Content` component. See below for the skeleton:

```javascript
// import { Session, Conference } from '@dolbyio/comms-uikit-react';
<Session participantInfo={participantInfo}>
  <Conference id={conferenceId}>...</Conference>
</Session>
```

> `Conference` component contains other optional properties including `alias`(string), `audio`(bool), `video`(bool), `liveRecording`(bool).

#### Display participants

The `ParticipantsList` component can display a list of participants in the current conference and their status, eg. whether the participant is currently speaking.

1. Import `ParticipantsList` from the UI kit.

```javascript
import { ParticipantsList } from '@dolbyio/comms-uikit-react';
```

2. Insert the `ParticipantsList` component anywhere inside of `Conference`. You can customize the text properties shown for each participant and their status.

```javascript
<ParticipantsList localText="you" muteText="mute" unmuteText="unmute" soundOnText="sound on" soundOffText="sound off" />
```

> If you would like to display participants using your own component, refer to the [useParticipants](documentation/hooks/useParticipants.md) hook.

#### Display video

The `ParticipantsGrid` component displays the video streams of conference participants in a grid tile layout.

1. Import `ParticipantsGrid` from the UI kit.

```javascript
import { ParticipantsGrid } from '@dolbyio/comms-uikit-react';
```

3. Insert the `ParticipantsGrid` component anywhere inside of `Conference`.You can customize the `localText` property, which is shown for the local participant.

```javascript
<ParticipantsGrid localText="you" additionalContainerStyle={{ height: 400 }} />
```

#### Show user controls

The `LocalToggleAudioButton` and `LocalToggleVideoButton` components enable the local participant to toggle their microphone and camera on or off.

1. Import `LocalToggleAudioButton` and `LocalToggleVideoButton` from the UI kit.

```javascript
import { LocalToggleAudioButton, LocalToggleVideoButton } from '@dolbyio/comms-uikit-react';
```

2. Insert the `LocalToggleAudioButton` and `LocalToggleVideoButton` components anywhere inside of `Conference`.

```javascript
<div style={buttonContainerStyle}>
  <LocalToggleAudioButton />
  <LocalToggleVideoButton />
</div>
```

> If you would like to control audio or video using your own components, refer to the [useAudio](documentation/hooks/useAudio.md) and [useVideo](documentation/hooks/useVideo.md) hooks.

#### Change input or output devices

The local participant can change their preferred camera, microphone or output speaker using the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components.

1. Import `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` from the UI kit.

```javascript
import { CameraSelect, MicrophoneSelect, SpeakersSelect } from '@dolbyio/comms-uikit-react';
```

2. Insert the `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect` components, along with the `label` and `placeholder` properties, anywhere inside of `Conference`. You can customize the text shown for the `label` prop (shown above the component) and a `placeholder` prop (shown when no option is selected).

```javascript
<CameraSelect label="Camera" placeholder="Choose a camera" labelColor="white" />
<MicrophoneSelect label="Microphone" placeholder="Choose a microphone" labelColor="white" />
<SpeakersSelect label="Speaker" placeholder="Choose a speaker" labelColor="white" />
```

> If you would like to control input devices using your own components, refer to the [useCamera](documentation/hooks/useCamera.md), [useMicrophone](documentation/hooks/useMicrophone.md) and [useSpeaker](documentation/hooks/useSpeaker.md) hooks.

#### Observe participants' status

You can use the installed VoxeedSDK's APIs in the application directly without relying on our UIKit components. Let's enhance our example app to observe the participants' status.

1. Import Voxeet SDK. Import `useEffect` from React.

```javascript
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { useEffect } from 'react';
```

2. Insert the useEffect hook here to the `Content` component. This hook subscribes to the `participantUpdated` event from the voxeet SDK. Define the effect of the handler. Here, you observe the participant's status and the state of their audio through the console.

```javascript
useEffect(() => {
  // define the event handler here
  const handler = (participant) => {
    console.log(participant.info.name, 'status:', participant.status);
    console.log(participant.info.name, 'has audio enabled:', participant.audioTransmitting);
  };
  // register the handler for 'participantUpdated' event
  VoxeetSDK.conference.on('participantUpdated', handler);
  return () => {
    // unregister the handler
    VoxeetSDK.conference.removeListener('participantUpdated', handler);
  };
}, []);
```

> You can learn more about the Voxeet WebSDK [here](https://docs.dolby.io/communications-apis/docs/js-overview)

> Download the sample source code [here](examples/example_Foundations.js).

### Additional configuration

Please see the [additional configuration options guide](additional-configurations.md) to learn more about other features including:

- Theming
- Screen sharing
- Recording
- Logging
- Hooks

## License

The Dolby.io Communications UIKit for React and its repository are licensed under the MIT License. Before using the package `@dolbyio/comms-uikit-react`, please review and accept the [Dolby Software License Agreement](LICENSE).

Third-party licenses can be found [here](third-party-licenses.json).

&copy; Dolby, 2023
