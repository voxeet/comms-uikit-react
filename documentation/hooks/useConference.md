# useConference

The useConference hook gathers functions responsible for managing conferences.

## Members

| Name               | Type                        | Description                           |
| ------------------ | --------------------------- | ------------------------------------- |
| `conference`       | Conference                  | The object of the current conference. |
| `joinConference`   | (Conference) => void        | Joins a conference.                   |
| `createConference` | (ConferenceOptions) => void | Creates a conference.                 |
| `leaveConference`  | () => void)                 | Leaves a conference.                  |

## Examples

### React

### Get conference data

```javascript
const { conference } = useConference();

<span>{conference.alias}</span>;
```

### Create and join conference

```javascript
const { createConference, joinConference } = useConference();

const conferenceOptions = {
  alias: 'My Conference',
  params: {
    dolbyVoice: true,
  },
};
const newConference = await createConference(conferenceOptions);

const joinOptions = {
  constraints: {
    audio: true,
    video: false,
  },
};

await joinConference(newConference, joinOptions);
```

### Leave conference

```javascript
const { leaveConference } = useConference();

<button onClick={leaveConference}>...</button>;
```
