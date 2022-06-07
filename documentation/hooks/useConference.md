# useConference

The useConference hook gathers functions responsible for managing conferences.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `conference` | Conference | The object of the current conference. |
| `joinConference` | (Conference) => void | Joins a conference. |
| `createConference` | (ConferenceOptions) => void | Creates a conference. |
| `leaveConference` | () => void) | Leaves a conference. |

## Examples

### React

```javascript
const { conference } = useConference();

console.log(conference);
```
