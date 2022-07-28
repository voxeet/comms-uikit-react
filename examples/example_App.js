import {
  CommsProvider,
  Session,
  Conference,
  ParticipantsList,
  ParticipantsGrid,
  LocalToggleAudioButton,
  LocalToggleVideoButton,
  LeaveConferenceButton,
  CameraSelect,
  MicrophoneSelect,
  SpeakersSelect,
} from '@dolbyio/comms-uikit-react';
import './App.css';

// Define the `CommsProvider` configuration: we need two props, a `token` and an async function that refreshes it.
const token = 'YOUR_CLIENT_ACCESS_TOKEN_HERE';
const refreshToken = async () => token;

// Define the `Session` configuration: you should provide a name using a `participantInfo` object, eg. the name of the participant who established the session.
const participantInfo = { name: 'John Doe' };

// Define the `Conference` configuration: you can specify whether to join the conference with audio and/or video enabled, in addition to an alias which can be made visible to all participants.
const audio = true;
const video = true;
const alias = 'My Meeting';

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

// Define the `LeaveConferenceButton` configuration: you can customise the text shown in a tooltip when hovering over the button.
const tooltipText = 'Leave';

function App() {
  return (
    <CommsProvider token={token} refreshToken={refreshToken}>
      <div className="App">
        <Session participantInfo={participantInfo}>
          {/* IMPORTANT: Rendering a <Conference /> component will establish a call using Dolby.io - if you're using your free minutes for this demo, remember to leave the conference or close the browser tab when you're done! */}
          <Conference audio={audio} video={video} alias={alias}>
            <ParticipantsList
              localText={localText}
              muteText={muteText}
              unmuteText={unmuteText}
              soundOnText={soundOnText}
              soundOffText={soundOffText}
            />
            <ParticipantsGrid localText={localText} />
            <LocalToggleAudioButton />
            <LocalToggleVideoButton />
            <CameraSelect label={cameraLabel} placeholder={cameraPlaceholder} />
            <MicrophoneSelect label={microphoneLabel} placeholder={microphonePlaceholder} />
            <SpeakersSelect label={speakersLabel} placeholder={speakersPlaceholder} />
            <LeaveConferenceButton tooltipText={tooltipText} />
          </Conference>
        </Session>
      </div>
    </CommsProvider>
  );
}

export default App;
