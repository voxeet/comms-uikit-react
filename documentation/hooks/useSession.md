# useSession

The useSession hook gathers functions responsible for managing sessions.

## Members

| Name | Type | Description |
|-------------| ------------- | ----- |
| `openSession` | () => {} | Opens a new Dolby.io session. |
| `closeSession` | () => {} | Closes the current Dolby.io session. |
| `user` | User | The object of the local participant in a session. |

## Examples

### React

```javascript
const { openSession } = useSession();

openSession();
```
