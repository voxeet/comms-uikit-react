# Pill

The Pill component is responsible for displaying labels that contain additional descriptions.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `text` | string | The text to display.|
| `active` | bool | The activity state. |
| `size` | 'small' , 'medium' | The size of the component. |
| `textColor.default` | ColorKey | The default color of the text. |
| `textColor.active` | ColorKey | The color of the text when the label is active. |
| `backgroundColor.default` | ColorKey | The default background color of the label. |
| `backgroundColor.active` | ColorKey | The background color of the active label. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <Pill text="John Doe" active />
);
```
