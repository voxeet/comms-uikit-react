/* eslint-disable react/jsx-props-no-spreading */
import type { Participant as ParticipantType } from '@voxeet/voxeet-web-sdk/types/models/Participant';
import { useState } from 'react';

import QualityIndicator, { QualityIndicatorProps } from '../../ui/indicators/QualityIndicator/QualityIndicator';

type QualityLevel = -1 | 1 | 2 | 3 | 4 | 5;

type ParticipantQualityIndicatorProps = Partial<Omit<QualityIndicatorProps, 'qualityLevel'>> & {
  participant: ParticipantType | null;
};

const ParticipantQualityIndicator = ({ participant, testID, ...rest }: ParticipantQualityIndicatorProps) => {
  const [qualityLevel] = useState<QualityLevel>(-1);

  if (!participant) return null;

  // TODO - temporary way to show dynamic data in quality indicators
  //   TODO - in the future use quality level based on participant prop

  // const generateRandomLevel = () => {
  //   const values: QualityLevel[] = [-1, 1, 2, 3, 4, 5];
  //   const interval = setInterval(async () => {
  //     setQualityLevel(values[Math.floor(Math.random() * values.length) + 1]);
  //   }, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // };

  // useEffect(() => {
  //   return generateRandomLevel();
  // }, []);

  return <QualityIndicator testID={testID} qualityLevel={qualityLevel} {...rest} />;
};

export default ParticipantQualityIndicator;