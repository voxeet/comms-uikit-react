# Dolby.io Communications UI Kit React

## UI Kit

DolbyIO Communications UXKit React is package for React. The main aim is to reduce the complexity of DolbyIO Comms API implementation in both web.

Package consists of three basic elements:

- Provider - Main component allowing to initialize integration with Dolby.io Comms API & state management
- Hooks - Set of functions offering videoconferencing logic
- UI components - Set of UI components covering most popular patterns of videoconferencing apps

## Prerequisites

Make sure that you have:

- A Dolby.io account, if not [sign up](https://dolby.io/signup) for a free Dolby.io account
- React 16.5+
- A working video camera and microphone
- The [Client Access Token](https://docs.dolby.io/communications-apis/docs/overview-developer-tools#client-access-token) copied from the Dolby.io dashboard
- The [supported browser](https://docs.dolby.io/communications-apis/docs/overview-supported-environments#web-sdk)

Please review [Supported Environments](https://docs.dolby.io/communications-apis/docs/overview-supported-environments) for more information on Dolby.io requirements.

## Getting Started

This guide explains how to create a basic conference application for mobile devices with the React UI component. It starts with importing dependencies and guides you through the steps to launch a conference call.

### How to get a Dolby.io account

Dolby.io Comms API requires you to create a Dolby.io account.
To set it up, you need to go to <https://dashboard.dolby.io/signup/> and complete the form. After confirming your email address, you will be logged in.

### Dolby.io dashboard

After logging in, you get access to the full dashboard where you can manage your account.

From this page <https://dashboard.dolby.io/dashboard/applications/summary> you can manage your profile and billing.

The CommsProvider provide the token & refreshToken props to authenticate against the service. For more information, see the section titled Initialize the SDK with secure authentication.
https://docs.dolby.io/communications-apis/docs/guides-authentication#initialize-the-sdk-with-secure-authentication

## Install the SDK, manage the token, and create a conference

### Create a new project

Create a new React project and install the Dolby.io Communications APIs UI Component for React using `npm` or `yarn`:

```bash
npm install @dolbyio/comms-uikit-react --save
```

```bash
yarn add @dolbyio/comms-uikit-react
```

### Initialize your application

To access the Dolby.io Communications APIs service, you need to authenticate your application. To do so, import [CommsProvider](./providers/CommsProvider.md) and use it to wrap your application:

```javascript
import { CommsProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
    return (
        <CommsProvider>
          ...
        </CommsProvider>
    );
};

export default App;
```

To establish a connection with the server, call the VoxeetSDK.initializeToken method that accepts a JSON Web Token (JWT) as a parameter. To authenticate your application, pass the token copied from the dashboard and the refreshToken function to CommsProvider:

```javascript
import { CommsProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
    const refreshToken = () => {
      fetch(url)
        .then(data => data.json())
        .then(json => {
          VoxeetSDK.initializeToken(json.access_token, () => {
            // This callback is called when the token needs to be refreshed

            // Call the server to get a new access token
            return fetch(url)
              .then(data => data.json())
              .then(json => json.access_token)
              .catch(error => {
                // An error has occurred
              });
          });
        })
        .then(() => {
          // Initialize your application
        })
        .catch(error => {
          // An error has occurred
        });
    }

    return (
        <CommsProvider token="XXX" refreshToken={refreshToken}>
          ...
        </CommsProvider>
    );
};

export default App;
```

Import and wrap the application using [ThemeProvider](./providers/ThemeProvider.md) and overwrite the theme by passing the theme prop:

```javascript
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
    return (
        <CommsProvider token="XXX" refreshToken={...}>
          <ThemeProvider theme={{colors: {red: "#f111"}}}>
            ...
          </ThemeProvider>
        </CommsProvider>
    );
};

export default App;
```

### Open a session and create a conference

A session is a connection between the client application and the Dolby.io Communications APIs. Initializing a session happens asynchronously because of the network handshake that must occur. When opening a session, you should provide a name. Commonly, this is the name of the participant who established the session.

Import the [useSession](./hooks/useSession.md) and [useConference](./hooks/useConference.md) hooks and open a session:

```javascript
import { useSession, useConference } from '@dolbyio/comms-uikit-react';

await openSession({
  name: `John Doe`,
});
```

You can call the openSession method to open a session any time after you've initialized the SDK.

To distinguish between multiple conferences, you need to use a conference alias or name. When multiple participants join a conference of the same name using a token for the same Dolby.io application, they will be able to meet in a call. To create a conference, use the [createConference](./hooks/useConference.md) method:

```javascript
import { useSession, useConference } from '@dolbyio/comms-uikit-react';

await openSession({
  name: `John Doe`,
});

const conferenceOptions = {
  alias: 'UIKit',
};

await createConference(conferenceOptions);
```

### Display the conference UI

The conference UI, also called layout, is responsible for the final look of the conference. It displays participants' avatars and video tiles and assigns a specific size and location to these elements.

To create the UI, import the [useParticipants](./hooks/useParticipants.md) hook and the [Avatar](./components/Avatar.md) and [Text](./components/Text.md) components:

```javascript
import { useParticipants, Avatar, Text } from '@dolbyio/comms-uikit-react';
```

Get the participants array and display the participants' avatars on the layout. Additionally, add a speaking indicator to each participant.

```javascript
import { useParticipants, Avatar, Text, SpeakingIndicator } from '@dolbyio/comms-uikit-react';

const { participants } = useParticipants();

return (
  participants.map(p => (
    <>
      <Avatar participant={p} />
      <Text>
        {p.name}
        {p.surname}
      </Text>
      <SpeakingIndicator />
    </>
  ))
)

```

### Display a video

To display participants' video tiles in the layout, we offer the VideoGrid component that allows setting the maximum number of columns, tiles, and spaces between tiles.

Import the [VideoGrid](./components/VideoGrid.md) component, pass the participants array to VideoGrid, and adjust it.

```javascript
import { useParticipants, VideoGrid } from '@dolbyio/comms-uikit-react';

const { participants } = useParticipants();

return (<VideoGrid participants={participants} gap={20} /> );

```

## Summary

All these steps combined might contain the following code snippet:

<!-- We need to add a code sample with code from this procedure that a user can just copy paste -->

If you want to see an example of an application created using the React UI Component, see the [examples](../examples) folder.

## Theming system

TBD

## Example apps

Below is a list of sample projects using Dolby.io Communications UIKit React

### Videoconferencing app

The application available in this repository demonstrates the capabilities of Dolby.io for adding video conferencing functions to browser applications built using React.
https://github.com/dolbyio-samples/comms-app-react-videoconference

## Known issues & limitations

- Copy conference link works only for root directories
- Local mute can result in some other participants mute state desynchronizations

## Requirements & supported platforms

### Dolby.io Comms UIKit React supports 4 main browsers:

- Chrome 100+
- Safari 15+
- Firefox 100+
- Edge 100+

## Documentation

A complete list of the available providers, hooks, and components is available in the [documentation](../documentation) folder.

## UI Component license agreement

The Dolby.io Communications UI Component for React and its repository are licensed under the MIT License.

Before using the latest version of the @dolbyio/comms-uikit-react, please review and accept the [Dolby Software License Agreement](../LICENSE).

## Third Party licenses

Direct licenses can be found [here](./third-party-licenses)

© Dolby, 2022
