# VideoGrid

The VideoGrid component is responsible for displaying video streams of participants in a grid layout.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `participants` | Participant[] | The array of the participants objects. |
| `gap` | number | The space between tiles. |
| `maxColumns` | number | The maximum number of columns. |
| `maxTiles` | number | The maximum number of tiles. |
| `renderItem` | (participant: Participant) => ReactNode | The function that overwrites the default grid tile layout. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <VideoGrid participants={...} gap={20} />
);
```
