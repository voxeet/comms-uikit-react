# Dolby.io Communications UIKit for React

[![NPM](https://img.shields.io/npm/l/@dolbyio/comms-uikit-react)](https://github.com/DolbyIO/comms-uikit-react/blob/main/LICENSE) [![npm](https://img.shields.io/npm/v/@dolbyio/comms-uikit-react)](https://www.npmjs.com/package/@dolbyio/comms-uikit-react)

## Overview

The Dolby.io Communications UIKit for React is designed to help React developers reduce the complexity of building and embedding a Dolby.io video call application for web.

The package consists of three basic elements:

- **Providers**: The main components for initializing integration with Dolby.io Communications APIs and state management.
- **Hooks**: Functions responsible for video calling logic of video calling applications.
- **UI components**: Components that cover the most popular patterns of video conferencing applications.
- **Video call components**: UI components with built-in logic for the most widely used video call features.

If you want to see an example of an application created using this UIKit, you can also check our [video call application](https://github.com/dolbyio-samples/comms-app-react-videocall).

## Getting Started

This procedure will help you create a simple web application that supports making a video call using the Dolby.io Communications APIs. It is a good starting point that you can follow along in your code editor. This starter project will provide the foundation upon which you can add additional features as you build out your own solutions for meetings, events, collaboration, or education.

### Prerequisites

Make sure that you have:

- A Dolby.io account. If you do not have an account, [sign up](https://dolby.io/signup) for a free account. After confirming your email address, you will be logged in to your dashboard. The dashboard allows you to manage your applications, account settings, and billing.
- A working video camera and microphone.
- The client access token copied from the [Dolby.io dashboard](https://dashboard.dolby.io/). To create the token, log in to the Dolby.io dashboard, create an application and navigate to API keys category. Navigate to the client access token section and copy the token.
- The supported browser, either Chrome 100+, Safari 15+, Firefox 100+, or Edge 100+.

Please review [Supported Environments](https://docs.dolby.io/communications-apis/docs/overview-supported-environments) for more information.

We offer two approaches for using UIKit, you can either use video call components or hooks mixed with plain UIKit components:

- Video call components: Allows you to use components that are ready-to-use solutions for the most common features. If you prefer using this approach, follow the [Build the application using video call components](#build-the-application-using-video-call-components) procedure.
- Hooks & UI components: Allows you to build your application with visual components, without built-in logic, and extend the components with functions from our hooks. If you prefer using this approach, follow the [Build the application using hooks and UI components](#build-the-application-using-hooks-and-ui-components) procedure.

_In most cases, you can mix these approaches._

### Build the application using video call components

#### 1. Create a new project

Create a new project with the [Create React App](https://create-react-app.dev/).

```bash
npx create-react-app dolbyio-app --template typescript
```

After successful install, navigate to the newly created project directory

```bash
cd dolbyio-app
```

Install the Dolby.io Communications APIs UI Component for React using `npm` or `yarn`

```bash
npm install @dolbyio/comms-uikit-react --save

or

yarn add @dolbyio/comms-uikit-react
```

#### 2. Initialize your application

To access the Dolby.io Communications APIs service, you need to authenticate your application. For proper SDK initialization, you need to prepare one thing:

- The client access token generated from [Dolby.io dashboard](https://dashboard.dolby.io/).

Next, we need to import [CommsProvider](documentation/providers/CommsProvider.md) and use it. Replace whole content of `src/App.tsx` with this code snippet:

```javascript
import { CommsProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
  return <CommsProvider token="REPLACE_WITH_YOUR_CLIENT_ACCESS_TOKEN">...</CommsProvider>;
};

export default App;
```

In `src/App.tsx` find place where you need to insert previously prepared token `REPLACE_WITH_YOUR_CLIENT_ACCESS_TOKEN`.

<hr />

**IMPORTANT NOTE**

This approach is only for the demo purpose. To properly initialize your app for production, you need to pass `refreshToken` prop to `CommsProvider`.
For more information, see the [API Authentication](https://docs.dolby.io/communications-apis/docs/guides-api-authentication#initialize-the-sdk-with-secure-authentication) guide.

Example usage of `refreshToken`:

```javascript
import { CommsProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
  const refreshToken = async () => {
    // Call your backend to request a new client access token
    const newToken = await fetch(REPLACE_WITH_YOUR_REFRESHING_TOKEN_ENDPOINT);
    return newToken.json();
  };

  return (
    <CommsProvider token="REPLACE_WITH_YOUR_CLIENT_ACCESS_TOKEN" refreshToken={refreshToken}>
      ...
    </CommsProvider>
  );
};

export default App;
```

<hr />

Let's proceed with our demo app.

Import and wrap the application using [ThemeProvider](documentation/providers/ThemeProvider.md). In your `src/App.tsx` at the top of the file add `ThemeProvider` to existing import statement, next find `...` and replace it with:

```javascript
<ThemeProvider theme={{ colors: { red: '#f111' } }}>...</ThemeProvider>
```

You can use `theme` prop to overwrite default theme.

At this point your `src/App.tsx` should look like this:

```javascript
import { CommsProvider, ThemeProvider } from '@dolbyio/comms-uikit-react';

const App = () => {
  return (
    <CommsProvider token="YOUR_TOKEN_LIKE_eyJ0eXAiOiJKV1QiLCJhbGciOiq6bTQ673XENDLoQ">
      <ThemeProvider theme={{ colors: { red: '#f111' } }}>...</ThemeProvider>
    </CommsProvider>
  );
};

export default App;
```

#### 3. Create setup

In `src/App.tsx` import [useState](https://reactjs.org/docs/hooks-state.html) from React and `Button`,
`Input` and `Space` component from `UIKit`.

```javascript
import { CommsProvider, ThemeProvider, Button, Input, Space } from '@dolbyio/comms-uikit-react';
import React, { useState } from 'react';
```

In the new line after `const App = () => {` paste this:

```javascript
const [inMeeting, setInMeeting] = useState(false);
const [name, setName] = useState('');
const [alias, setAlias] = useState('');
const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setName(e.target.value);
};
const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setAlias(e.target.value);
};
```

Find `...` inside `<ThemeProvider>` and insert our previously imported components.

```javascript
<Space p="l">
  <Space mb="s">
    <Input value={name} label="Name" onChange={handleNameChange} />
  </Space>
  <Space mb="s">
    <Input value={alias} label="Meeting" onChange={handleAliasChange} />
  </Space>
  <Button variant="primary" onClick={() => setInMeeting(true)}>
    Join
  </Button>
</Space>
```

At this point we have UI and logic for gathering user name and conference alias.

#### 4. Open session and create a video call

A session is a connection between the client application and the Dolby.io Communications APIs. Initializing a session happens asynchronously because of the network handshake that must occur. When opening a session, you should provide a name. Commonly, this is the name of the participant who established the session.

Import the [Session](documentation/components/Session.md) and [Conference](documentation/components/Conference.md) video call components and use them in `src/App.tsx`.

```javascript
import { CommsProvider, ThemeProvider, Button, Input, Space, Session, Conference } from '@dolbyio/comms-uikit-react';
```

Both components need additional props and some of them we will take from `name` and `alias` state.

Our simplified logic suggest that we should render `Session` and `Conference` components when `inMeeting` state will be `true`. In `src/App.tsx`, find previously added code block and replace it with below code.

```javascript
{
  (inMeeting && name.length > 2 && alias.length > 2) ? (
    <Session participantInfo={{ name }}>
      <Conference audio video alias={alias}>
        <Layout>...</Layout>
      </Conference>
    </Session>
  ) : (
    <Space p="l">
      <Space mb="s">
        <Input value={name} label="Name" onChange={handleNameChange} />
      </Space>
      <Space mb="s">
        <Input value={alias} label="Meeting" onChange={handleAliasChange} />
      </Space>
      <Button variant="primary" onClick={() => setInMeeting(true)}>
        Join
      </Button>
    </Space>
  )
}
```

Now, when user inserts `name`, conference `alias` and clicks join button, our component will render video call components `Session` and `Conference`.

Our `src/App.tsx` file should look like this:

```javascript
import {
  CommsProvider,
  ThemeProvider,
  Button,
  Input,
  Space,
  Session,
  Conference,
  Layout,
} from '@dolbyio/comms-uikit-react';
import React, { useState } from 'react';

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value);
  };
  return (
    <CommsProvider token="YOUR_TOKEN_LIKE_eyJ0eXAiOiJKV1QiLCJhbGciOiq6bTQ673XENDLoQ">
      <ThemeProvider>
        {inMeeting && name.length > 2 && alias.length > 2 ? (
          <Session participantInfo={{ name }}>
            <Conference audio video alias={alias}>
              <Layout>...</Layout>
            </Conference>
          </Session>
        ) : (
          <Space p="l">
            <Space mb="s">
              <Input value={name} label="Name" onChange={handleNameChange} />
            </Space>
            <Space mb="s">
              <Input value={alias} label="Meeting" onChange={handleAliasChange} />
            </Space>
            <Button variant="primary" onClick={() => setInMeeting(true)}>
              Join
            </Button>
          </Space>
        )}
      </ThemeProvider>
    </CommsProvider>
  );
};

export default App;
```

#### 5. Display participants

Add [ParticipantsList](documentation/components/ParticipantsList.md) component to our import atop `scr/App.tsx`. This component will list all video call participants in the layout:

```javascript
import { ..., ParticipantsList } from '@dolbyio/comms-uikit-react';
```

Find `...` and use `ParticipantsList`:

```javascript
<ParticipantsList localText="you" muteText="mute" unmuteText="unmute" soundOnText="sound on" soundOffText="sound off" />
```

#### 6. Display a video

To add a video grid, use the [ParticipantsGrid](documentation/components/ParticipantsGrid.md) component with the `localText` prop to display the name of the local participant. Again you have to update import statement with `ParticipantsGrid` and use under `<ParticipantsList>`.

```javascript
<ParticipantsGrid localText="you" />
```

#### 7. User controls

To control the state of the local participant's camera and microphone, use the video call [LocalToggleAudioButton](documentation/components/LocalToggleAudioButton.md) and [LocalToggleVideoButton](documentation/components/LocalToggleVideoButton.md) components. Add `LocalToggleAudioButton` and `LocalToggleVideoButton` to `uikit` import in `src/App.tsx`.
Find `<ParticipantsGrid />` and paste this under:

```javascript
<Space style={{ display: 'flex', justifyContent: 'center' }} mv="m">
  <Space mr="s">
    <LocalToggleAudioButton />
  </Space>
  <Space mr="s">
    <LocalToggleVideoButton />
  </Space>
  {/* Leave */}
</Space>;
{
  /* Selects */
}
```

Please notice usage of [Space](documentation/components/Space.md) component which is ideal for creating gaps, margins and paddings.

#### 8. Leave the call

Use the [LeaveConferenceButton](documentation/components/LeaveConferenceButton.md) component to leave the video call. Update import with LeaveConferenceButton`, find `{/_ Leave _/}` and replace it with:

```javascript
<LeaveConferenceButton tooltipText="Leave" onSuccess={() => setInMeeting(false)} />
```

We have to provide prop for `tooltipText` and optionally `onSuccess`. In our case this method will change `inMeeting` state which will cause render of video call setup.

#### 9. Different devices

To manage the used devices, use the [CameraSelect](documentation/components/CameraSelect.md), [MicrophoneSelect](documentation/components/MicrophoneSelect.md), and [SpeakersSelect](documentation/components/SpeakersSelect.md) components. Update import with `CameraSelect`, `MicrophoneSelect` and `SpeakersSelect`. Find `{/* Selects */}` and replace it with:

```javascript
<Space>
  <Space mb="s">
    <CameraSelect label="Camera" placeholder="Camera" labelColor="white" />
  </Space>
  <Space mb="s">
    <MicrophoneSelect label="Microphone" placeholder="Microphone" labelColor="white" />
  </Space>
  <Space mb="s">
    <SpeakersSelect label="Speakers" placeholder="Speakers" labelColor="white" />
  </Space>
</Space>
```

### Build the application using hooks and UI components

In this section we will only show the difference between our app building approaches.

#### 1. Create a new project & initialize your application

This step is identical to the [Create a New Project](#1-create-a-new-project) and [Initialize your application](#2-initialize-your-application) sections in the video call components, above.

#### 2. Difference - creating session and conference

In video call components approach user imports the [Session](documentation/components/Session.md) and [Conference](documentation/components/Conference.md) components to establish connection with [Dolby.io](https://dolby.io).

Using hooks it will look like this:

In `src` directory create file called `CreateAndJoin.tsx`. This component will use our [useSession](documentation/components/useSession.md) and [useConference](documentation/components/useConference.md) hooks.

```javascript
import React, { useEffect } from 'react';
import { useSession, useConference, Button, Layout } from '@dolbyio/comms-uikit-react';

type CreateAndJoinProps = {
  children: React.ReactNode,
};

export const CreateAndJoin = ({ children }: CreateAndJoinProps) => {
  // consume UIKit hooks
  // create and join function
  // return value
};
```

Let's use our hooks. Copy code snippet and paste it into `src/CreateAndJoin.tsx` instead of `// consume UIKit hooks`.

```javascript
const { openSession } = useSession();
const { createConference, joinConference, conference } = useConference();
```

Use our hook methods `openSession`, `createConference` and `joinConference`. To distinguish between multiple conferences, you need to use a conference alias. When multiple participants join a conference of the same alias using an access token from the same Dolby.io application, they will be able to meet in a call. Insert below snippet instead of `// create and join function`.

```javascript
const createAndJoin = async () => {
  await openSession({
    name: 'John Doe',
  });
  const conferenceOptions = {
    alias: 'UIKita',
  };

  const conference = await createConference(conferenceOptions);

  const joinOptions = {
    constraints: {
      audio: true,
      video: false,
    },
  };

  await joinConference(conference, joinOptions);
};
```

Last thing to do is return value from our component and run `createAndJoin` function on `Button` click. Add it instead of `// return value`.

```javascript
if (!conference) {
  return (
    <Button variant="primary" onClick={createAndJoin}>
      Create and join
    </Button>
  );
}
return <Layout>{children}</Layout>;
```

Your `src/CreateAndJoin.tsx` should look like this.

```javascript
import React from 'react';
import { useSession, useConference, Button } from '@dolbyio/comms-uikit-react';

type CreateAndJoinProps = {
  children: React.ReactNode,
};

export const CreateAndJoin = ({ children }: CreateAndJoinProps) => {
  const { openSession } = useSession();
  const { createConference, joinConference, conference } = useConference();

  const createAndJoin = async () => {
    await openSession({
      name: 'John Doe',
    });
    const conferenceOptions = {
      alias: 'UIKita',
    };

    const conference = await createConference(conferenceOptions);

    const joinOptions = {
      constraints: {
        audio: true,
        video: true,
      },
    };

    await joinConference(conference, joinOptions);
  };

  if (!conference) {
    return (
      <Button variant="primary" onClick={createAndJoin}>
        Create and join
      </Button>
    );
  }
  return <Layout>{children}</Layout>;
};
```

Now, we need to use our freshly created component. Go back to `src/App.tsx` and atop file insert import.

```javascript
import { CreateAndJoin } from './CreateAndJoin';
```

Find `...` in the same file and replace it with:

```javascript
<CreateAndJoin>...</CreateAndJoin>
```

As you can see this approach is more complicated but gives you more flexibility. In fact video call components use our hooks inside and every component can be recreated with hooks approach.

From this point you can use video call components, hooks and UI components.

## Theming system

Themes allow you to customize all design aspects of your project in order to meet the specific needs of your business or brand and have a consistent tone of your application. Themes allow you to configure colors of components, the darkness of surfaces, level of shadow, and the opacity of ink elements.

### Theme provider

The UIKit requires you to use the [ThemeProvider](documentation/components/ThemeProvider.md) component in order to inject a theme into your application.

ThemeProvider relies on the context feature of React to pass the theme down to the components, so you need to make sure that ThemeProvider is a parent of the components you are trying to customize.

```javascript
<ThemeProvider>
  <Navigator />
</ThemeProvider>
```

### Theme variables

The default theme variables are listed in the [src/common/theme/defaultTheme.ts](src/common/theme/defaultTheme.ts) file.

### Customization

Theme variables can be overwritten with the `theme` prop of the [ThemeProvider](documentation/components/ThemeProvider.md) component:

```javascript
<ThemeProvider theme={{ colors: { white: 'yellow', primary: { 400: 'red' } } }}>
  <Navigator />
</ThemeProvider>
```

If you have a couple of themes present in your application, you can achieve them using the `customThemes` prop of the [ThemeProvider](documentation/components/ThemeProvider.md) component:

```javascript
<ThemeProvider
  customThemes={{
    dark: { colors: { white: 'yellow', primary: { 400: 'red' }, secondary: { 400: 'blue' } } },
  }}
>
  <Navigator />
</ThemeProvider>
```

To select one theme, use the `setActiveTheme` function from the [useTheme](documentation/hooks/useTheme.md hook:

```javascript
import { useTheme } from '@dolbyio/comms-uxkit-react';

const { setActiveTheme } = useTheme();

setActiveTheme('dark');
```

### Usage in UIKit components

UIKit exported components can take string keys of the `theme` variable. It means that passing the prop in the following way causes that the Text component uses a value of the 300th key of the colors object in the theme variable:

```javascript
<Text color="grey.300" />
```

### Usage in custom components

Custom components can rely on the theme system. The [useTheme](documentation/hooks/useTheme.md) hook offers several functions:

```javascript
import { useTheme } from '@dolbyio/comms-uxkit-react';

const { getColor } = useTheme();

return (<div style={{backgroundColor: getColor('grey.300')}} />
```

## Known issues and limitations

- The speaker selection is available only on Chrome and Edge
- By default, the copy conference link function works only for root directories
- Entering a video call may take more than 3 seconds in some cases
- On Safari 15.4 and earlier, the local participant can hear an echo

## Documentation

A complete list of the available providers, hooks, and components is available in the [documentation](documentation) folder.

## UI Component license agreement

The Dolby.io Communications UIKit for React and its repository are licensed under the MIT License.

Before using the package `@dolbyio/comms-uikit-react`, please review and accept the [Dolby Software License Agreement](LICENSE).

## Third-Party licenses

Direct licenses can be found [here](./third-party-licenses.json)

© Dolby, 2022
