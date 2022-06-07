# VideoView

The VideoLocalView component is responsible for displaying video from local camera.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `width` | number | The size of each video file. |
| `height` | number | The height of each video file. |
| `noVideoFallback` | () => ReactNode | The function that overwrites the default way of displaying streams. |
| `username` | string | Allows to display Avatar before starting session |
| `device` | string / null | Allows to specify device id |
| `indicator` | boolean | If true component displays IconIndicator in top right corner |
| `audio` | boolean | If true component plays audio from microphone |

## Examples

### React

```javascript
return (
  <VideoLocalView width={200} height={300} />
);
```
