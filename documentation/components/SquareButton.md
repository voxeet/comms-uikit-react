# SquareButton

The SquareButton component is responsible for square and rectangular buttons.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `type` | 'square' / 'rectangular' | The shape of the button. |
| `backgroundColor` | ColorKey | The background color of the button. |
| `iconColor` | ColorKey | The color of an icon on the button. |
| `label` | string | The tooltip that appears when a user moves a mouse pointer over the button. |
| `size` | 'small' / 'medium' | The size of the button. |
| `disabled` | bool | Information whether the button is disabled. |
| `icon` | string | The icon type. |
| `onClick` | () => void | The event handler property. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <SquareButton type="square" onClick={() => {}} />
);
```
