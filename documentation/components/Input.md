# Input

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `label` | string | Tiny text displayed above input component |
| `value` | string | The value of the input element, required for a controlled component. |
| `borderColor` | ColorKey | Field stroke color |
| `invalidBorderColor` | ColorKey | Field stroke color if value is validated with error |
| `labelColor` | ColorKey | Label color |
| `labelBackground` | ColorKey | Label background |
| `textColor` | ColorKey | Input content color |
| `validation` | { valid: boolean; message?: string } | Props allowing to control over validation |
| `onChange` | function | The event source of the callback. You can pull out the new value by accessing event.target.value (string). |

## Examples

### React

```javascript
return (
  <Input label="Your Name" value={name} onChange={(event) => setName(event.target.value)} />
);
```
