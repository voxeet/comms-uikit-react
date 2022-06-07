# IconButton

The IconButton component is responsible for rectangular buttons with icon content.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `variant` |  | Graphic variant of button |
| `backgroundColor` | ColorKey , [ColorKey, ColorKey] | Specifies button background color |
| `iconColor` | ColorKey | Specifies icon color |
| `strokeColor` | ColorKey | Specifies button border color |
| `badge` | boolean | Specifies if small dot indicator should appear above the icon |
| `badgeColor` | ColorKey | Specifies badge color |
| `badgeContentColor` | ColorKey | Specifies badge text color |
| `size` | 'xxs' , 'xs' , 's' , 'm' | Size of button |
| `disabled` | boolean | Specifies if button is active |
| `icon` | Icon | Name of icon to be used as button content |
| `onClick` | Function | Function invoked on button click |

## Examples

### React

```javascript
return (
  <IconButton variant="secondary">
    Text
  </IconButton>
);
```
