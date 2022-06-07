# SpeakingIndicator

The SpeakingIndicator component is responsible for indicating if the relevant user is speaking.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `backgroundColor` | ColorKey | The background color of the indicator. |
| `iconColor` | ColorKey | The color of the displayed speaking icon. |
| `size` | 'small' , 'medium' | The size of the indicator. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <SpeakingIndicator size="small" />
);
```
