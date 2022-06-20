# useSpeaker

The useSpeaker hook gathers functions responsible for managing speakers.

## Members

| Name            | Type                     | Description                              |
| --------------- | ------------------------ | ---------------------------------------- |
| `getSpeakers`   | () => Promise<Speaker[]> | Gets the list of the available speakers. |
| `selectSpeaker` | (Speaker) => void)       | Selects a speaker.                       |

## Examples

### React

### Select main speaker

```javascript
const { getSpeakers, selectSpeaker } = useSpeaker();
const speakers = getSpeakers();
...
return (
    speakers.map((s) => (
    <div onClick={() => selectSpeaker(s)}>...</div>
    ))
)
```
