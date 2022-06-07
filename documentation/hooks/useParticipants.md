# useParticipants

The useParticipants hook gathers functions responsible for managing conference participants.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `participants` | Participant[] | The list of conference participants. |
| `muteParticipant` | (participant: Participant, isMuted: boolean) => void | Mutes the selected participants. |
| `isMuted` | bool | Checks whether the local participant is muted. |
| `toggleMute` | (participant: Participant) => void | Mutes and unmutes the selected participants. |
| `participantsIsSpeaking` | Record<string, boolean> | Lists all conference participants and their speaking status. |
| `isVideo` | bool | Checks whether the local participant's camera is enabled. |
| `toggleVideo` | (participant: Participant) => void | Enables and disables cameras of the selected participants. |

## Examples

### React

```javascript
const { participants } = useParticipants();

console.log(participants);
```
