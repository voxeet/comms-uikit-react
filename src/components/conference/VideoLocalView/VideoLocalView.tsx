/* eslint-disable jsx-a11y/media-has-caption */
import cx from 'classnames';
import React, { useEffect, useRef, useMemo, useState } from 'react';

import soundWave from '../../../assets/animations/soundWaveLottie.json';
import useAudio from '../../../hooks/useAudio';
import useCamera from '../../../hooks/useCamera';
import useLocalStream from '../../../hooks/useLocalStream';
import useMicrophone from '../../../hooks/useMicrophone';
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
  const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
  const [isUsingRearCamera, setIsUsingRearCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<MediaStream | null>(null);

  const { getColor, isDesktop, isTablet } = useTheme();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { localCamera, swapCamera, getDefaultLocalCamera } = useCamera();
  const { localMicrophone, getMicrophonePermission } = useMicrophone();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { localStream } = useLocalStream();

  const prevIsAudio = useRef<boolean>();

  const isMounted = useIsMounted();

  useEffect(() => {
    if (!localCamera) {
      getDefaultLocalCamera();
    }
  }, []);

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

  useEffect(() => {
    if (localStream) {
      if (!isDesktop && localStream) {
        const streamTrack = localStream.getVideoTracks()[0];
        if (streamTrack) {
          const { facingMode } = streamTrack.getCapabilities();
          if (facingMode?.[0] === FacingModes.Env) {
            setIsUsingRearCamera(true);
          } else {
            setIsUsingRearCamera(false);
          }
        }
      }
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
    if (localStream) {
      setVideoSrc(localStream);
    }
  }, [localStream]);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.srcObject = videoSrc;
    }
  }, [videoSrc]);

  useEffect(() => {
    return () => {
      if (!isMounted()) {
        if (audio) {
          clearAudioSource();
        }
        clearMediaStreams();
      }
    };
  }, [mediaStreams, localStream, disabled]);

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
          testID="SpeakingIndicator"
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
      {videoSrc && isVideo && !disabled ? (
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
