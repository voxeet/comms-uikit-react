# useSpeaker

The useSpeaker hook gathers functions responsible for managing speakers.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `getSpeakers` | () => Promise<Speaker[]> | Gets the list of the available speakers. |
| `selectSpeaker` | (Speaker) => void) | Selects a speaker. |

## Examples

### React

```javascript
const { getSpeakers } = useSpeaker();

console.log(await getSpeakers());
```
