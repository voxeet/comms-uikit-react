# VideoView

The VideoView component is responsible for displaying video stream of each conference participant.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `participant` | Participant | The participant object. |
| `width` | number | The size of each video file. |
| `height` | number | The height of each video file. |
| `noVideoFallback` | () => ReactNode | The function that overwrites the default way of displaying streams. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <VideoView participant={...} width={200} height={300} />
);
```
