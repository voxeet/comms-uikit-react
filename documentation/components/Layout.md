# Layout

The Layout component is a wrapper responsible for displaying a full-screen view of a conference and setting a background color.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `children` | ReactNode | The content of the component. |
| `backgroundColor` | ColorKey | The background color of the layout. |
| `style` | CSSProperties | The style of the layout. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <Layout>
    ....
  </Layout>
);
```
