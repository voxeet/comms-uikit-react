import type { SVGProps } from 'react';

import Add from './Add';
import ArrowLeft from './ArrowLeft';
import BackgroundBlur from './BackgroundBlur';
import Camera from './Camera';
import CameraGradient from './CameraGradient';
import CameraOff from './CameraOff';
import CameraOffGradient from './CameraOffGradient';
import CameraReverse from './CameraReverse';
import CameraReverseGradient from './CameraReverseGradient';
import Chat from './Chat';
import ChatGradient from './ChatGradient';
import ChevronDown from './ChevronDown';
import ChevronUp from './ChevronUp';
import Circle from './Circle';
import Close from './Close';
import Copy from './Copy';
import CopyGradient from './CopyGradient';
import Delete from './Delete';
import DotsHorizontal from './DotsHorizontal';
import DotsHorizontalGradient from './DotsHorizontalGradient';
import DotsVertical from './DotsVertical';
import DotsVerticalGradient from './DotsVerticalGradient';
import Echo from './Echo';
import Exit from './Exit';
import EyeClosed from './EyeClosed';
import EyeOpen from './EyeOpen';
import Failure from './Failure';
import Friends from './Friends';
import Handset from './Handset';
import HandsetGradient from './HandsetGradient';
import Headphones from './Headphones';
import HeadphonesGradient from './HeadphonesGradient';
import Info from './Info';
import InfoFilled from './InfoFilled';
import InfoGradient from './InfoGradient';
import Invite from './Invite';
import Loader from './Loader';
import Lossless from './Lossless';
import Microphone from './Microphone';
import MicrophoneGradient from './MicrophoneGradient';
import MicrophoneOff from './MicrophoneOff';
import MicrophoneOffGradient from './MicrophoneOffGradient';
import Participants from './Participants';
import ParticipantsGradient from './ParticipantsGradient';
import Pin from './Pin';
import PinGradient from './PinGradient';
import Present from './Present';
import PresentGradient from './PresentGradient';
import Record from './Record';
import RecordGradient from './RecordGradient';
import SendMessage from './SendMessage';
import SendMessageGradient from './SendMessageGradient';
import Settings from './Settings';
import SettingsGradient from './SettingsGradient';
import Speaker from './Speaker';
import SpeakerGradient from './SpeakerGradient';
import SpeakerOff from './SpeakerOff';
import SpeakerOffGradient from './SpeakerOffGradient';
import Stream from './Stream';
import Success from './Success';
import SuccessFilled from './SuccessFilled';
import Tiles from './Tiles';
import Tune from './Tune';
import Warning from './Warning';
import WarningFilled from './WarningFilled';

const IconComponents = {
  arrowLeft: ArrowLeft,
  backgroundBlur: BackgroundBlur,
  camera: Camera,
  cameraGradient: CameraGradient,
  cameraOff: CameraOff,
  cameraOffGradient: CameraOffGradient,
  cameraReverse: CameraReverse,
  cameraReverseGradient: CameraReverseGradient,
  chat: Chat,
  chatGradient: ChatGradient,
  close: Close,
  copy: Copy,
  copyGradient: CopyGradient,
  delete: Delete,
  dotsHorizontal: DotsHorizontal,
  dotsHorizontalGradient: DotsHorizontalGradient,
  dotsVertical: DotsVertical,
  dotsVerticalGradient: DotsVerticalGradient,
  exit: Exit,
  eyeClosed: EyeClosed,
  eyeOpen: EyeOpen,
  failure: Failure,
  friends: Friends,
  handset: Handset,
  handsetGradient: HandsetGradient,
  headphones: Headphones,
  headphonesGradient: HeadphonesGradient,
  info: Info,
  infoFilled: InfoFilled,
  infoGradient: InfoGradient,
  invite: Invite,
  loader: Loader,
  lossless: Lossless,
  microphone: Microphone,
  microphoneGradient: MicrophoneGradient,
  microphoneOff: MicrophoneOff,
  microphoneOffGradient: MicrophoneOffGradient,
  participants: Participants,
  participantsGradient: ParticipantsGradient,
  pin: Pin,
  pinGradient: PinGradient,
  present: Present,
  presentGradient: PresentGradient,
  record: Record,
  recordGradient: RecordGradient,
  sendMessage: SendMessage,
  sendMessageGradient: SendMessageGradient,
  settings: Settings,
  settingsGradient: SettingsGradient,
  speaker: Speaker,
  speakerGradient: SpeakerGradient,
  speakerOff: SpeakerOff,
  speakerOffGradient: SpeakerOffGradient,
  success: Success,
  successFilled: SuccessFilled,
  warning: Warning,
  warningFilled: WarningFilled,
  stream: Stream,
  tune: Tune,
  tiles: Tiles,
  echo: Echo,
  add: Add,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  circle: Circle,
};

export default IconComponents;
export type IconComponentName = keyof typeof IconComponents;
export interface SVGComponent extends SVGProps<SVGSVGElement> {
  testID: string;
}
