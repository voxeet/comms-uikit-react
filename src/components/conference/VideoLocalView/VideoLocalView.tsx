/* eslint-disable jsx-a11y/media-has-caption */
// eslint-disable-next-line import/no-extraneous-dependencies
import cx from 'classnames';
import React, { useEffect, useRef, useMemo, useState } from 'react';

import soundWave from '../../../assets/animations/soundWaveLottie.json';
import useAudio from '../../../hooks/useAudio';
import useCamera from '../../../hooks/useCamera';
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
  const [videoSrcObject, setVideoSrcObject] = useState<MediaStream | null>(null);
  const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
  const [isUsingRearCamera, setIsUsingRearCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getColor, isDesktop, isTablet } = useTheme();
  const { isVideo } = useVideo();
  const { isAudio } = useAudio();
  const { localCamera, swapCamera, getCameraPermission } = useCamera();
  const { localMicrophone, getMicrophonePermission } = useMicrophone();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const prevIsVideo = useRef<boolean>();
  const prevIsAudio = useRef<boolean>();

  const isMounted = useIsMounted();

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

  const clearVideoSource = () => {
    if (videoSrcObject) {
      videoSrcObject.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoSrcObject(null);
    }
    mediaStreams.forEach((stream) => {
      stream.getVideoTracks().forEach((track) => {
        track.stop();
      });
    });
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
    setTimeout(async () => {
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
    const video: MediaStreamConstraints['video'] = {
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    };
    if (localCamera) {
      if (localCamera.deviceId?.length) {
        video.deviceId = { exact: localCamera.deviceId };
      }
    }
    if (isVideo) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video,
        });
        if (!isDesktop) {
          const { facingMode } = stream.getTracks()[0].getCapabilities();
          if (facingMode?.[0] === FacingModes.Env) {
            setIsUsingRearCamera(true);
          } else {
            setIsUsingRearCamera(false);
          }
        }
        setVideoSrcObject(stream);
        setMediaStreams((prev) => [...prev, stream]);
      } catch (error) {
        throwErrorMessage(error);
        clearVideoSource();
      }
    }
  };

  useEffect(() => {
    clearVideoSource();
    if (localCamera) {
      attachVideoStream();
    }
  }, [localCamera, disabled]);

  useEffect(() => {
    if (audio) {
      clearAudioSource();
      if (localMicrophone?.deviceId) {
        attachAudioStream();
      }
    }
  }, [localMicrophone?.deviceId, disabled, audio]);

  useEffect(() => {
    if (prevIsVideo.current === false && isVideo) {
      clearVideoSource();
      attachVideoStream();
    }
    if (!isVideo) {
      clearVideoSource();
    }
  }, [isVideo, disabled]);

  useEffect(() => {
    prevIsVideo.current = isVideo;
  }, [isVideo]);

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
        clearVideoSource();
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
    let content = <IconIndicator icon="microphone" />;

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
