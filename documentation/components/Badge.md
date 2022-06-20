# Badge

The Badge component is addition to components. It displays as dot or can accept content.

## Props

| Name                 | Type                    | Default    | Description                                       |
| -------------------- | ----------------------- | ---------- | ------------------------------------------------- |
| `content`?           | ReactNode               | -          | The content of the badge.                         |
| `backgroundColor`?   | ColorKey                | 'grey.700' | The background color of the badge.                |
| `contentColor`?      | ColorKey                | 'white'    | The color of the badge's content.                 |
| `testID`?            | string                  |            | The unique E2E test handler.                      |
| `...HTMLDivElement`? | Partial(HTMLDivElement) | -          | Props that will be passed to the root div element |

## Examples

### React

```javascript
return <Badge content="12" />;
```
