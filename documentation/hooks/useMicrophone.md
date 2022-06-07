# useMicrophone

The useMicrophone hook gathers functions responsible for managing microphones.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `getMicrophones` | () => Promise<Mic[]> | Gets a list of the available microphones. |
| `selectMicrophone` | (Mic) => void) | Selects a microphone. |

## Examples

### React

```javascript
const { getMicrophones } = useMicrophone();

console.log(await getMicrophones());
```
