import {
  CommsProvider,
  Session,
  JoinConferenceButton,
  Conference,
  ParticipantsList,
  ParticipantsGrid,
  LocalToggleAudioButton,
  LocalToggleVideoButton,
  LeaveConferenceButton,
  CameraSelect,
  MicrophoneSelect,
  SpeakersSelect,
  InfoBar,
} from '@dolbyio/comms-uikit-react';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react';

// `CommsProvider` configuration: we need two props, a `token` and an async function that refreshes it
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// Create AppBase component which bundles CommsProvider
const AppBase = ({ children }) => {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      {children}
    </CommsProvider>
  );
};

// Create Content component to bundle all of the fundamental parts of the UIKit to serve a basic video call app
const Content = () => {
  // Define the state for the conference ID. We await a response from an API call that will return conferenceID value once the participant joins an active conference. The state is removed once the participant leaves the conference.
  const [conferenceId, setConferenceId] = useState();
  // Define the `Session` configuration: you should provide a name using a `participantInfo` object
  // Refer to docs: https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-participantinfo
  const participantInfo = { name: 'John Doe' };
  // Define the `JoinConferenceButton` configuration: you can specify whether to join the conference with audio and/or video enabled, in addition to a meetingName and username (usually the name of current user) which can be made visible to all participants.
  // Refer to docs: https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-joinoptions
  const joinOptions = {
    constraints: {
      audio: true,
      video: true,
    },
  };

  // Define styles for the containers
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
  // We are using conference service of VoxeetSDK here to observe the participants' status
  useEffect(() => {
    // Define the event handler here
    const handler = (participant) => {
      console.log(participant.info.name, 'status:', participant.status);
      console.log(participant.info.name, 'has audio enabled:', participant.audioTransmitting);
    };
    // Register the handler for 'participantUpdated' event
    VoxeetSDK.conference.on('participantUpdated', handler);
    return () => {
      // Unregister the handler
      VoxeetSDK.conference.removeListener('participantUpdated', handler);
    };
  }, []);

  return (
    <div className="App" style={contentContainerStyle}>
      <InfoBar text="Voxeet Web SDK has been initialized." style={{ margin: '0 auto' }} />
      <Session participantInfo={participantInfo}>
        <InfoBar text="Session has been created." style={{ margin: '0 auto' }} />
        {!conferenceId ? (
          <div style={buttonContainerStyle}>
            <JoinConferenceButton
              joinOptions={joinOptions}
              meetingName="My meeting"
              username="John Doe"
              tooltipText="Join meeting"
              onSuccess={(id) => setConferenceId(id)}
            >
              Join Video Call
            </JoinConferenceButton>
          </div>
        ) : (
          /* IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io - if you're using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done! */
          <div>
            <Conference id={conferenceId}>
              <ParticipantsList
                localText="you"
                muteText="mute"
                unmuteText="unmute"
                soundOnText="sound on"
                soundOffText="sound off"
              />
              <ParticipantsGrid localText="you" additionalContainerStyle={{ height: 400 }} />

              <div style={{ ...buttonContainerStyle, gap: '10px' }}>
                <LocalToggleAudioButton />
                <LocalToggleVideoButton />
              </div>
              <CameraSelect label="Camera" placeholder="Choose a camera" labelColor="white" />
              <MicrophoneSelect label="Microphone" placeholder="Choose a microphone" labelColor="white" />
              <SpeakersSelect label="Speaker" placeholder="Choose a speaker" labelColor="white" />
              <div style={buttonContainerStyle}>
                <LeaveConferenceButton tooltipText="Leave meetings" onSuccess={() => setConferenceId(undefined)} />
              </div>
            </Conference>
          </div>
        )}
      </Session>
    </div>
  );
};

// Connect AppBase component with Content
const App = () => {
  // Define styles for the containers
  const appContainerStyles = `
        body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `;

  return (
    <>
      <style>{appContainerStyles}</style>
      <AppBase>
        <Content />
      </AppBase>
    </>
  );
};

export default App;
