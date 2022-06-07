# useCamera

The useCamera hook gathers functions responsible for managing cameras.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `getCameras` | () => Promise<Camera[]> | Gets the list of the available cameras. |
| `selectCamera` | (Camera) => void) | Selects a camera. |

## Examples

### React

```javascript
const { getCameras } = useCamera();

console.log(await getCameras());
```
