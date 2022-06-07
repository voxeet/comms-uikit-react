# Tooltip

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `text` | string | The text to display.|
| `position` | 'top' / 'bottom' | Tooltip placement. |
| `backgroundColor` | ColorKey | Tooltip background color. |
| `textColor` | ColorKey | Tooltip text color. |
| `children` | ReactElement | Tooltip reference element.|

## Examples

### React

```javascript
return (
  <Tooltip text="John Doe">
    <Button>Aaa</Button>
  </Tooltip>
);
```
