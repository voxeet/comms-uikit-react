# Select

The Select component is responsible for a drop-down list that allows selecting one of the available options. It has flexible API, so user can control rendered elements. Select component uses compound components pattern. It is a main wrapper component. It creates the state for all of the children components.

### Props

| Name                 | Type                    | Default | Description                                       |
| -------------------- | ----------------------- | ------- | ------------------------------------------------- |
| `selected`           | SelectOptionType / null | -       | The SelectOptionType object or null.              |
| `children`           | ReactNode               | -       | React nodes, that will be rendered as childs.     |
| `...HTMLDivElement`? | Partial(HTMLDivElement) | -       | Props that will be passed to the root div element |

```javascript
return (
  <Select selected={selectedDevice}>
    <SelectLabel label="Label text" color="black" />
    <SelectControl placeholder="Camera" />
    <SelectDropdown onChange={onChange} options={devices} />
  </Select>
);
```

## \<SelectLabel />

The SelectLabel component renders a label for a drop-down list.

### Props

| Name             | Type               | Default | Description                                                 |
| ---------------- | ------------------ | ------- | ----------------------------------------------------------- |
| `label`          | string             | -       | Label text                                                  |
| `...TextProps` ? | Partial(TextProps) | -       | Props which are passed to Text component inside SelectLabel |

## \<SelectControl />

The SelectControl component renders an element which is responsible for toggling visibility of dropdown list.

### Props

| Name                     | Type                       | Default | Description                                               |
| ------------------------ | -------------------------- | ------- | --------------------------------------------------------- |
| `placeholder`            | string                     | -       | Placeholder text used when selected value is null         |
| `color` ?                | ColorKey                   | -       | The color of the text.                                    |
| `borderColor` ?          | ColorKey                   | -       | The color of the box border.                              |
| `...HTMLButtonElement` ? | Partial(HTMLButtonElement) | -       | Props which are passed to button tag inside SelectControl |

## \<SelectDropdown />

The SelectDropdown component renders an element which is responsible for rendering drop-down list.

### Props

| Name                | Type                              | Default | Description                                                                  |
| ------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `options`           | SelectOptionType[]                | -       | Array of available options                                                   |
| `onChange`          | (value: SelectOptionType) => void | -       | Function that is triggered when user selects one element from drop-down list |
| `color` ?           | ColorKey                          | -       | The color of the text.                                                       |
| `backgroundColor` ? | ColorKey                          | -       | The color of the background.                                                 |
