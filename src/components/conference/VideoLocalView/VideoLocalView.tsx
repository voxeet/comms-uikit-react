/* eslint-disable jsx-a11y/media-has-caption */
import cx from 'classnames';
import React, { useEffect, useRef, useMemo, useState } from 'react';

import soundWave from '../../../assets/animations/soundWaveLottie.json';
import useAudio from '../../../hooks/useAudio';
import useCamera from '../../../hooks/useCamera';
import useConference from '../../../hooks/useConference';
import useLocalStream from '../../../hooks/useLocalStream';
import useMicrophone from '../../../hooks/useMicrophone';
import useSession from '../../../hooks/useSession';
import useTheme from '../../../hooks/useTheme';
import useVideo from '../../../hooks/useVideo';
import { throwErrorMessage } from '../../../utils/throwError.util';
import { useIsMounted } from '../../../utils/useIsMounted';
import AnimationIndicator from '../../ui/indicators/AnimationIndicator/AnimationIndicator';
import IconIndicator from '../../ui/indicators/IconIndicator/IconIndicator';
import Space from '../../ui/Space/Space';
import LocalAvatar from '../LocalAvatar/LocalAvatar';

import styles from './VideoLocalView.module.scss';

export type VideoViewProps = React.HTMLAttributes<HTMLDivElement> & {
  testID?: string;
  width?: number;
  height?: number;
  noVideoFallback?: React.ReactNode;
  username?: string;
  indicator?: boolean;
  cameraReverseButton?: boolean;
  audio?: boolean;
  disabled?: boolean;
  isMicrophonePermission?: boolean;
  speakingIndicator?: boolean;
};

enum FacingModes {
  Env = 'environment',
  User = 'user',
}

let speakingIndicatorInterval: ReturnType<typeof setTimeout> | undefined;
let audioContext: AudioContext | undefined;

const VideoLocalView = ({
  testID,
  width = 712,
  height = 400,
  noVideoFallback,
  username,
  indicator = true,
  audio = true,
  cameraReverseButton = true,
  disabled = false,
  isMicrophonePermission,
  className,
  ...props
}: VideoViewProps) => {
  const [videoSrcObject, setVideoSrcObject] = useState<MediaStream | null>(null);
  const { participant } = useSession();
  const { conference } = useConference();
  const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
  const [isUsingRearCamera, setIsUsingRearCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getColor, isDesktop, isTablet } = useTheme();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { localCamera, swapCamera, getCameraPermission, startLocalVideo } = useCamera();
  const { localMicrophone, getMicrophonePermission } = useMicrophone();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { localStream, setLocalStream } = useLocalStream();

  const prevIsAudio = useRef<boolean>();

  const isMounted = useIsMounted();

  useEffect(() => {
    if (participant) {
      attachVideoStream();
    }
  }, [participant, localCamera]);

  const clearAudioSource = async () => {
    mediaStreams.forEach((stream) => {
      stream.getAudioTracks().forEach((track) => {
        track.stop();
      });
    });
    if (speakingIndicatorInterval !== undefined) {
      clearInterval(speakingIndicatorInterval);
      speakingIndicatorInterval = undefined;
    }
    if (audioContext && audioContext.state !== 'closed') {
      await audioContext.close();
      audioContext = undefined;
    }
  };

  const clearMediaStreams = () => {
    mediaStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    });
    setMediaStreams([]);
  };

  const attachAudioContext = (stream: MediaStream) => {
    audioContext = undefined;
    audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 512;
    analyzer.smoothingTimeConstant = 0.1;
    const sourceNode = audioContext.createMediaStreamSource(stream);
    sourceNode.connect(analyzer);

    clearInterval(speakingIndicatorInterval);

    speakingIndicatorInterval = setInterval(() => {
      const fftBins = new Float32Array(analyzer.frequencyBinCount);
      analyzer.getFloatFrequencyData(fftBins);
      const audioPeakDB = Math.max(...fftBins);

      if (audioPeakDB > -60) {
        setIsSpeaking(true);
      } else {
        setIsSpeaking(false);
      }
    }, 500);
  };

  const attachAudioStream = () => {
    return setTimeout(async () => {
      if (audio) {
        let audioOptions: boolean | MediaTrackConstraints | undefined;
        await getMicrophonePermission();

        if (localMicrophone && localMicrophone.deviceId?.length !== 0) {
          audioOptions = {
            deviceId: { exact: localMicrophone.deviceId },
          };
        } else {
          audioOptions = true;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: audioOptions,
            video: false,
          });
          setMediaStreams((prev) => [...prev, stream]);
          attachAudioContext(stream);
        } catch (error) {
          throwErrorMessage(error);
        }
      }
    }, 100);
    // in some scenarios, iOS starts audio stream with flags enabled:true and muted:true
    // it shouldn't happen anytime, there is no way to change muted state because it is readonly
    // postponing initialization of audio stream helps with this issue
    // it may be related to our situation where we fire two separate streams
    // one for video and one for audio
  };

  const attachVideoStream = async () => {
    await getCameraPermission();
    if (localStream && localStream.getVideoTracks()[0].readyState !== 'ended') {
      return setVideoSrcObject(localStream);
    }
    if (isVideo && participant) {
      try {
        let streamTrack: MediaStreamTrack;
        if (conference && participant.streams.length) {
          const { streams } = participant;
          const tracks = streams[0]?.getVideoTracks?.();
          // eslint-disable-next-line prefer-destructuring
          streamTrack = tracks[0];
        } else {
          streamTrack = await startLocalVideo({
            deviceId: localCamera ? localCamera.deviceId : undefined,
          });
        }

        if (!isDesktop && localStream) {
          const { facingMode } = streamTrack.getCapabilities();
          if (facingMode?.[0] === FacingModes.Env) {
            setIsUsingRearCamera(true);
          } else {
            setIsUsingRearCamera(false);
          }
        }
        setLocalStream(new MediaStream([streamTrack]));
      } catch (error) {
        throwErrorMessage(error);
      }
    }
    return true;
  };

  useEffect(() => {
    if (localStream) {
      if (!isDesktop && localStream) {
        const streamTrack = localStream.getVideoTracks()[0];
        const { facingMode } = streamTrack.getCapabilities();
        if (facingMode?.[0] === FacingModes.Env) {
          setIsUsingRearCamera(true);
        } else {
          setIsUsingRearCamera(false);
        }
      }
      setVideoSrcObject(localStream);
    }
  }, [localStream]);

  useEffect(() => {
    if (audio) {
      clearAudioSource();
      if (localMicrophone?.deviceId) {
        attachAudioStream();
      }
    }
  }, [localMicrophone?.deviceId, disabled, audio]);

  useEffect(() => {
    if (audio) {
      if (prevIsAudio.current === false && isAudio) {
        clearAudioSource();
        attachAudioStream();
      }
      if (!isAudio) {
        clearAudioSource();
      }
    }
  }, [isAudio, disabled, audio]);

  useEffect(() => {
    if (audio) {
      prevIsAudio.current = isAudio;
    }
  }, [isAudio]);

  useEffect(() => {
    if (videoRef?.current) {
      if (videoSrcObject) {
        videoRef.current.srcObject = videoSrcObject;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [videoSrcObject]);

  useEffect(() => {
    return () => {
      if (!isMounted()) {
        if (audio) {
          clearAudioSource();
        }
        clearMediaStreams();
      }
    };
  }, [mediaStreams, videoSrcObject, disabled]);

  const reverseCamera = async () => {
    await swapCamera();
  };

  const handleDoubleClick = async () => {
    if (!isDesktop) {
      await reverseCamera();
    }
  };

  const isBigAvatar = isTablet || isDesktop;

  const indicatorContent = useMemo(() => {
    let content;

    if (isSpeaking && isAudio && isMicrophonePermission) {
      content = (
        <AnimationIndicator
          animationData={soundWave}
          backgroundColor={getColor('white')}
          contentColor={getColor('primary.500')}
        />
      );
    } else if (!isSpeaking && isAudio && isMicrophonePermission) {
      content = <IconIndicator icon="microphone" />;
    } else {
      content = <IconIndicator icon="microphoneOff" />;
    }

    return content;
  }, [isSpeaking, isAudio, isMicrophonePermission]);

  return (
    <Space
      onDoubleClick={handleDoubleClick}
      className={cx(styles.videoWrapper, !isDesktop && styles.mobile, className)}
      testID={testID}
      style={{ backgroundColor: getColor('grey.700'), width, height }}
      {...props}
    >
      {videoSrcObject && isVideo && !disabled ? (
        <video
          muted
          data-testid="videoTag"
          ref={videoRef}
          autoPlay
          playsInline
          width={width}
          height={height}
          className={cx({ [styles.rearCamera]: isUsingRearCamera }, className)}
        />
      ) : (
        <Space fw fh className={styles.fallbackWrapper} testID="FallbackWrapper">
          {noVideoFallback || (
            <Space fh className={styles.fallbackContent} testID="FallbackContent">
              <LocalAvatar size={isBigAvatar ? 'l' : 'm'} testID="LocalAvatar" username={username} />
            </Space>
          )}
        </Space>
      )}
      {indicator && !disabled && <Space className={styles.indicator}>{indicatorContent}</Space>}
      {cameraReverseButton && !isDesktop && isVideo && !disabled && (
        <Space onClick={reverseCamera} className={styles.cameraReverse}>
          <IconIndicator icon="cameraReverse" testID="ReverseCameraIcon" />
        </Space>
      )}
    </Space>
  );
};

export default React.memo(VideoLocalView);
