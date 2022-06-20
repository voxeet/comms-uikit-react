# useCamera

The useCamera hook gathers functions responsible for managing cameras.

## Members

| Name                    | Type                    | Description                                 |
| ----------------------- | ----------------------- | ------------------------------------------- |
| `getCameras`            | () => Promise<Camera[]> | Gets the list of the available cameras.     |
| `selectCamera`          | (Camera) => void)       | Selects a camera.                           |
| `getDefaultLocalCamera` | () => Promise<Camera>)  | Gets data of default camera.                |
| `hasCameraPermission`   | () => Promise<boolean>) | Check status of browser camera permissions. |

## Examples

### React

### Select source camera

```javascript
const { getCameras, selectCamera } = useCamera();
const cameras = getCameras();
...
return (
  cameras.map((c) => (
    <div onClick={() => selectCamera(c)}>...</div>
  ))
)
```

### Use default camera as source

```javascript
const { getDefaultLocalCamera } = useCamera();
const [localCamera, setLocalCamera] = useState(null);

useEffect(() => {
  if (localCamera === null) {
    (async () => {
      setLocalCamera(await getDefaultLocalCamera());
    })();
  }
}, [localCamera]);
```

### Check camera permission

```javascript
const { hasCameraPermission } = useCamera();
const [isCameraPermission, setIsCameraPermission] = useState(false);

useEffect(() => {
  (async () => {
    try {
      const hasAccess = await hasCameraPermission();
      setIsCameraPermission(hasAccess);
    } catch {
      setIsCameraPermission(false);
    }
  })();
}, []);

<button disabled={!isCameraPermission}>...</button>;
```
