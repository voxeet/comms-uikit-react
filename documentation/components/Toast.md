# Toast

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `backgroundColor` | ColorKey | Toast background color. |
| `isVisible` | boolean | If true Toast is displayed |
| `children` | React.ReactNode | Toast content |

## Examples

### React

```javascript
return (
  <Toast isVisible={true}>
    <span>Well done!</span>
  </Toast>
);
```
