# Select

The Select component is responsible for a drop-down list that allows selecting one of the available options. 

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `options` | Array | The array of the available options. |
| `options[].label` | string / ReactNode | The label of each option. |
| `options[].value` | string | The value of each option. |
| `placeholder` | string | The text that appears in the form control when no value is set. |
| `selected` | Option | The selected option. |
| `label` | string | The text displayed above the drop-down list. |
| `onChange` | (value: Option) => void | The event handler property. |
| `testID` | string | The unique E2E test handler. |

## Examples

### React

```javascript
return (
  <Select
    option=[
      {
        label: "1", value: 1
      }, {
        label: "2", value: 2
      }
    ]
  onChange={() => {}}
  />
);
```
