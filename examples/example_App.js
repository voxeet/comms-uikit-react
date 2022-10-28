import {
  CommsProvider,
  ThemeProvider,
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
  ScreenShareButton,
  ScreenSharingPresentationBox,
  ScreenSharingActionBar,
  useScreenSharing,
  Space,
  RecordButton,
  useRecording,
  RecordingStatus,
  ShareStatus,
  RecordingActionBar,
} from '@dolbyio/comms-uikit-react';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import React, { useEffect, useState } from 'react';

// Create AppBase component which bundles CommsProvider and ThemeProvider
const AppBase = ({ children }) => {
  return (
    <ThemeProvider>
      <CommsProvider token={token} refreshToken={refreshToken}>
        {children}
      </CommsProvider>
    </ThemeProvider>
  );
};

// Define the `CommsProvider` configuration: we need two props, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// Define the `Session` configuration: you should provide a name using a `participantInfo` object, eg. the name of the participant who established the session.
const participantInfo = { name: 'John Doe' };

// Define the `JoinConferenceButton` configuration: you can specify whether to join the conference with audio and/or video enabled, in addition to a meetingName and username (usually the name of current user) which can be made visible to all participants.

const joinOptions = {
  constraints: {
    audio: true,
    video: true,
  },
};

const meetingName = 'My Meeting';
const username = 'John Doe';

// Define the tooltips that are shown when hovering over the Join or Leave buttons.
const joinTooltipText = 'Join meeting';
const leaveTooltipText = 'Leave';

// Define the `ParticipantsList` configuration: you can customise the text shown for each participant and their status.
const localText = 'you'; // The local participant's name.
const muteText = 'mute'; // Displayed in a tooltip when a participant is not muted.
const unmuteText = 'unmute'; // Displayed in a tooltip when a participant is muted.
const soundOnText = 'sound on'; // Displayed in a tooltip when a participant is speaking.
const soundOffText = 'sound off'; // Displayed in a tooltip when a participant is not speaking.

// Define the `ParticipantsGrid` configuration: you can customise the text shown for the current participant and their status.

// const localText = 'you';

/*
    We are re-using the previously declared `localText` in this example for `ParticipantsGrid` but you can use any value you prefer
  */

// Define the `CameraSelect`, `MicrophoneSelect`, and `SpeakersSelect` configurations: each component takes a `label` prop (shown above the component) and a `placeholder` prop (shown when no option is selected).
const cameraLabel = 'Camera';
const cameraPlaceholder = 'Choose a camera';

const microphoneLabel = 'Microphone';
const microphonePlaceholder = 'Choose a microphone';

const speakersLabel = 'Speaker';
const speakersPlaceholder = 'Choose a speaker';

// Define the `ScreenSharingActionBar` configurations: component takes a statusLabels (shown depends of sharing status) and buttonLabels.

const screenSharingActionBarTexts = {
  status: {
    active: 'Screen sharing active',
    error: 'Screen sharing issue',
    loading: 'Screen sharing loading',
    other: 'Screen sharing other status',
  },
  button: {
    label: 'Stop presenting',
    tooltip: 'Stop presenting',
  },
  guest: 'Someone is presenting',
};

// Define the `ScreenSharingPresentationBox` configurations: component takes a "fallbacktext" and "fallbackButtonText" props for default fallback content.

const fallbackText = 'There is some problem with screen sharing';
const fallbackButtonText = 'try again';

// Define the `RecordingActionBar` configurations: component takes a statusLabels (shown depends of recording status) and buttonLabels.

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

// Define the app container reset styles
const appContainerStyles = `
    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `;

// Create Content component for bundle all app stuff
const Content = () => {
  // Define the state for the conference ID.
  const [conferenceId, setConferenceId] = useState();
  const { status, isLocalUserPresentationOwner, isPresentationModeActive } = useScreenSharing();
  const { status: recordingStatus, isLocalUserRecordingOwner } = useRecording();

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
  // We are using conference service of VoxeetSDK here
  // to observe the participants' status
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

  // We are defining if presentation is active primary we are basing on ShareStatus. Secondary if share status is other than ACTIVE, but local user is presentation owner, we are checking if isPresentationModeActive
  const isPresentationActive =
    status === ShareStatus.Active || (isLocalUserPresentationOwner && isPresentationModeActive);

  // We are defining if recording is active primary we are basing on RecordingStatus. Secondary if recording status is other than ACTIVE, we check if local user is recording owner.

  const isRecordingActive = isLocalUserRecordingOwner || recordingStatus === RecordingStatus.Active;

  return (
    <div className="App" style={contentContainerStyle}>
      <InfoBar text="Voxeet Web SDK has been initialized." style={{ margin: '0 auto' }} />
      <Session participantInfo={participantInfo}>
        <InfoBar text="Session has been created." style={{ margin: '0 auto' }} />
        {!conferenceId ? (
          <div style={buttonContainerStyle}>
            <JoinConferenceButton
              joinOptions={joinOptions}
              meetingName={meetingName}
              username={username}
              tooltipText={joinTooltipText}
              onSuccess={(id) => setConferenceId(id)}
            >
              Join Video Call
            </JoinConferenceButton>
          </div>
        ) : (
          /* IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io - if you're using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done! */
          <Conference id={conferenceId} liveRecording>
            <Space fw style={{ height: 100, overflowY: 'scroll' }}>
              <ParticipantsList
                localText={localText}
                muteText={muteText}
                unmuteText={unmuteText}
                soundOnText={soundOnText}
                soundOffText={soundOffText}
              />
            </Space>

            {isPresentationActive && (
              <ScreenSharingActionBar
                statusLabels={{
                  active: screenSharingActionBarTexts.status.active,
                  error: screenSharingActionBarTexts.status.error,
                  loading: screenSharingActionBarTexts.status.loading,
                  other: screenSharingActionBarTexts.status.other,
                }}
                buttonLabels={{
                  tooltip: screenSharingActionBarTexts.button.tooltip,
                  label: screenSharingActionBarTexts.button.label,
                }}
                guestLabel={screenSharingActionBarTexts.guest}
              />
            )}
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
            <Space fw style={{ display: 'flex' }}>
              {isPresentationActive && (
                <Space style={{ height: 400, width: '50%', flexGrow: 1 }}>
                  <ScreenSharingPresentationBox fallbackText={fallbackText} fallbackButtonText={fallbackButtonText} />
                </Space>
              )}

              <Space style={{ height: 400, flexGrow: 1 }}>
                <ParticipantsGrid localText={localText} additionalContainerStyle={{ height: 400 }} />
              </Space>
            </Space>

            <div style={{ ...buttonContainerStyle, gap: '10px' }}>
              <LocalToggleAudioButton />
              <LocalToggleVideoButton />
              <ScreenShareButton />
              <RecordButton />
            </div>
            <CameraSelect label={cameraLabel} placeholder={cameraPlaceholder} labelColor="white" />
            <MicrophoneSelect label={microphoneLabel} placeholder={microphonePlaceholder} labelColor="white" />
            <SpeakersSelect label={speakersLabel} placeholder={speakersPlaceholder} labelColor="white" />
            <div style={buttonContainerStyle}>
              <LeaveConferenceButton tooltipText={leaveTooltipText} onSuccess={() => setConferenceId(undefined)} />
            </div>
          </Conference>
        )}
      </Session>
    </div>
  );
};

// Connect AppBase component with Content
const App = () => {
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
