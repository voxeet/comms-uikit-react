# useTheme

The useTheme hook gathers functions responsible for managing themes.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `theme` | Theme | Gets the theme object. |
| `themeMode` | (Mode) => void) | Gets the currently used theme mode. |
| `setThemeMode` | () => Mode) | Sets a theme mode. |
| `getColorOrGradient` | (string) => string | Gets the gradient of the provided colors or the color that is used in the theme. |
| `getColor` | (string) => string | Gets the color of the theme. |
| `getGradient` | (string) => string | Gets the gradient value of the theme. |

## Examples

### React

```javascript
const { getColor } = useTheme();

console.log(getColor('red'));
```
