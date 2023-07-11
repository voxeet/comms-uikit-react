# Changelog

## 1.2.0

### Minor Changes

- 5ac6e7a2: - Implement invite viewer modal for watch party
  - Duplicate Copy component from V2 events over to UIKit

### Patch Changes

- 5cb17c87: Enable Live recording so that we can record conferences
- bb70d96d: The useRealTime streaming hook can now handle multi-layout mixer changes and determine when the event is live

## 1.1.1

### Patch Changes

- 5cb17c87: Enable Live recording so that we can record conferences

## 1.1.0

### Minor Changes

- 05503b00: Changed RTMP endpoints
- e04db747: - Implement responsive hosts panel grid items
  - Change `Tooltip` component to use absolute positioning instead of fixed positioning
  - Allow `Tooltip` to be positioned to the left and right
- 9616f186: Upgraded Voxeet-Web-SDK to 3.10 and enabled RTMP by default for video call app
- 83882344: Updated SDK to 3.10.0 and Added multi-screen-share support for 2 hosts
- 4a39e616: Implement session view skeleton
- 1c3cb640: Fixed a bug where in multi-screen share was being incorrectly handled

### Patch Changes

- ec90eec7: Added top bar
- 27237560: UiKit Readme Validation
- c5338020: Add support for quality selection and set viewer quality to auto
- 27c15032: The useRealTime streaming hook can now handle multi-layout mixer changes and determine when the event is live
- 11775255: Implement responsive recording button
- f2f3a860: Implement reponsive multi-screenshare
  Refactor media control buttons
  Change style of screenSharingPresentationBox fallback text
- b424d0c3: Refactor stage component
- f4afd837: Implement exit screen for v2
- 6431b247: Fix layut for multi-screen share
- a51111c4: Implement responsive timer
- c422c01f: Make stream button responsive
- 238185f6: Update read me to be less conferencing centric
- 00a51d4d: Turn off echo cancellation with music mode

## 1.0.1

### Patch Changes

- 9f537472: Turn off echo cancellation with music mode

## 1.0.0

### Patch Changes

- d7789fb4: Update images in sample + some reference docs
- 3fda9630: Implement promoting viewers to host
- e70fe30d: Refined UIKit documents

## [v1.0.0](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/1.0.0)

Version 1.0.0 is a stable release of UI kit, rounding out this patch of development. There are only a few changes here, however having this stable release allows us to move on to an improved version 2 development, where we are going to completely reassess our APIs to ensure we are giving you the best experience possible.

## Changes

- New hook for [`useRealtimeStreaming`](./documentation/hooks/useRealTimeStreaming.md)
- New hook for [`useLiveStreaming`](./documentation/hooks/useLiveStreaming.md)
- Documentation review and improvements
- `<Badge />` component is now exported from ui-kit. See [badge documentation](./documentation/components/Badge.md) for usage.
- internal code improvements

## [v0.9.0](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.9.0)

- Improve error handling
- Introduced new components such as exit, add, chevron up and chevron down

## [v0.8](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.8.0)

Released on 2022-12-22

- Update SDK version to 3.8.0
- audio processing hook
- music mode
- echo cancellation
- video forwarding logic

## [v0.7](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.7.0)

Released on 2022-11-24.

- integration tests & documentation improvements
- RTMP streaming hooks

## [v0.6](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.6.0)

Released on 2022-10-28.

- Update SDK version to 3.7.0
- Change of current start/stop video functions to use new SDK approach
- notifications system
- recording service & hooks
- screen sharing service & hooks
- video background blur

## [v0.5](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.5.13)

Released on 2022-07-15.

- Self-reliant components added
- updates in UI components
- rename Select -> Dropdown

## [v0.4](https://www.npmjs.com/package/@dolbyio/comms-uikit-react/v/0.4.2)

Released on 2022-06-17.

- Initial release of Dolby.io Communications UI Kit React. Version 1.0 relies on the web SDK 3.5.2.
