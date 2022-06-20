# Dolby.io Communications UI Kit React

## Overview

The Dolby.io Communications React UIKit is designed to help React developers reduce the complexity of building a Dolby.io video conference calling web application.
This package will help reduce the complexity of building a web application with Dolby.io.

The package consists of three basic elements:

- Provider: The main component for initializing integration with Dolby.io's Communications APIs and state management
- Hooks: Set of functions offering video conferencing logic
- UI components: Set of UI components covering the most popular patterns of video conferencing applications

If you want to see an example of an application created using the React UI Component, you can also check our [video conferencing application](https://github.com/dolbyio-samples/comms-app-react-videoconference).

## Dolby.io account and dashboard

To use the Dolby.io Communications UI Component for React, you need to have a Dolby.io account. If you do not have an account, [sign up](https://dolby.io/signup) for a free account. After confirming your email address, you will be logged in to your dashboard. The dashboard allows you to manage your applications, account settings, and billing.

The CommsProvider provides the token and refreshToken props to authenticate against the Dolby.io service. For more information, see the [Authentication](https://docs.dolby.io/communications-apis/docs/guides-authentication#initialize-the-sdk-with-secure-authentication) guide.

## Getting Started

This procedure will help you create a simple web application that supports making a video call using the Dolby.io Communications APIs. It is a good starting point that you can follow along in your code editor. This starter project will provide the foundation upon which you can add additional features as you build out your own solutions for meetings, events, collaboration, or education.

### Prerequisites

Make sure that you have:

- A Dolby.io account, if not [sign up](https://dolby.io/signup) for a free Dolby.io account
- React 16.5+
- A working video camera and microphone
- The [Client Access Token](https://docs.dolby.io/communications-apis/docs/overview-developer-tools#client-access-token) copied from the Dolby.io dashboard
- The supported browser, either Chrome 100+, Safari 15+, Firefox 100+, or Edge 100+

Please review [Supported Environments](https://docs.dolby.io/communications-apis/docs/overview-supported-environments) for more information on Dolby.io communication API's.

### Build the application

#### Create a new project

Create a new React project and install the Dolby.io Communications APIs UI Component for React using `npm` or `yarn`:

```bash
npm install @dolbyio/comms-uikit-react --save
```

```bash
yarn add @dolbyio/comms-uikit-react
```

#### Initialise your application


To access the Dolby.io Communications APIs service, you need to authenticate your application. To do so, import [CommsProvider](documentation/providers/CommsProvider.md) and use it to wrap your application:

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

To initialize the SDK, call the VoxeetSDK.initializeToken method that accepts a developer access token as a parameter. To authenticate your application, pass the token copied from the dashboard and the refreshToken function to CommsProvider:

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
          // Initialise your application
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

Import and wrap the application using [ThemeProvider](documentation/providers/ThemeProvider.md) and overwrite the theme by passing the theme prop:

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

#### Open a session and create a conference

A session is a connection between the client application and the Dolby.io Communications APIs. Initializing a session happens asynchronously because of the network handshake that must occur. When opening a session, you should provide a name. Commonly, this is the name of the participant who established the session.

Import the [useSession](documentation/hooks/useSession.md) and [useConference](documentation/hooks/useConference.md) hooks and open a session:

```javascript
import { useSession, useConference } from '@dolbyio/comms-uikit-react';

await openSession({
  name: `John Doe`,
});
```

You can call the openSession method to open a session any time after initializing the SDK.

To distinguish between multiple conferences, you need to use a conference alias or name. When multiple participants join a conference of the same name using a token for the same Dolby.io application, they will be able to meet in a call. To create a conference, use the [createConference](documentation/hooks/useConference.md) method:

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

#### Display the conference UI

The conference UI, also called layout, is responsible for the final look of the conference. It displays participants' avatars and video tiles and assigns a specific size and location to these elements.

To create the UI, import the [useParticipants](documentation/hooks/useParticipants.md) hook and the [Avatar](documentation/components/Avatar.md) and [Text](documentation/components/Text.md) components:

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

#### Display a video

To display participants' video tiles in the layout, we offer the VideoGrid component that allows setting a maximum number of columns, tiles, and spaces between tiles.

Import the [VideoGrid](documentation/components/VideoGrid.md) component, pass the participants array to VideoGrid, and adjust it.

```javascript
import { useParticipants, VideoGrid } from '@dolbyio/comms-uikit-react';

const { participants } = useParticipants();

return (<VideoGrid participants={participants} gap={20} /> );

```

## Theming system

The theme specifies the color of the components, darkness of the surfaces, level of shadow, appropriate opacity of ink elements, etc.

Themes let you apply a consistent tone to your app. It allows you to customize all design aspects of your project in order to meet the specific needs of your business or brand.

### Theme provider

UIKit requires you to use the ThemeProvider component in order to inject a theme into your application.

ThemeProvider relies on the context feature of React to pass the theme down to the components, so you need to make sure that ThemeProvider is a parent of the components you are trying to customize.

```
<ThemeProvider>
  <Navigator />
</ThemeProvider>
```

### Theme variables

Default theme variables are listed in [src/common/theme/defaultTheme.ts](src/common/theme/defaultTheme.ts)

### Customization

Theme variables can be overwritten with ThemeProvider prop `theme`

```
<ThemeProvider theme={{ colors: { white: 'yellow', primary: { 400: 'red' }}}}>
  <Navigator />
</ThemeProvider>
```

For some reasons you might have a couple of themes present in your app. To achieve this use ThemeProvider prop `customThemes`

```
<ThemeProvider
  customThemes={{
    'dark': { colors: { white: 'yellow', primary: { 400: 'red' }, secondary: { 400: 'blue' } } },
  }}
>
  <Navigator />
</ThemeProvider>
```

To select one of it use function `setActiveTheme` from `useTheme` hook

```
import {useTheme} from '@dolbyio/comms-uxkit-react';

...

const {setActiveTheme} from useTheme();

...

setActiveTheme('dark');

```

### Usage in UIKit components?

UIKit exported components can take theme variable string keys.
It means that passing the prop in a way:

```
<Text color="grey.300" />
```

means that component Text will use value for key 300 of colors object in theme variable.

### Usage in custom components?

Custom components can also rely on theme system. useTheme hook comes with bunch of useful functions.

```
const { getColor } = useTheme();

return (<div style={{backgroundColor: getColor('grey.300')}} />
```

Full documentation fo useTheme hook is located in [documentation/hooks/useTheme.md](documentation/hooks/useTheme.md)

## Known issues and limitations

- Copy conference link works only for root directories by default
- In some cases entering conference may take more than 3 seconds
- On Safari 15.4 and below local user can hear echo

## Documentation

A complete list of the available providers, hooks, and components is available in the [documentation](documentation) folder.

## UI Component license agreement

The Dolby.io Communications UI Component for React and its repository are licensed under the MIT License.

Before using the latest version of the @dolbyio/comms-uikit-react, please review and accept the [Dolby Software License Agreement](LICENSE).

## Third-Party licenses

Direct licenses can be found [here](./third-party-licenses)

© Dolby, 2022
