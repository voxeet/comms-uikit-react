# Avatar

The Avatar component is a graphical representation of an object or an entity, for example, a person or an organization.

## Props

| Name | Type | Description |
|-------------| ------------- | ----- |
| `participant` | Participant | The Participant object. |
| `size` | 'xs' / 's' / 'm' / 'l' | The size of the avatar. |
| `borderColor` | ColorKey | The color of the avatar's border.  |

## Examples

### React

```javascript
return (
  <Avatar participant={part} size={l} />
);
```
