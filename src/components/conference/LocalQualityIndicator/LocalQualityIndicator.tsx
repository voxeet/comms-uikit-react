/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';

import useSession from '../../../hooks/useSession';
import QualityIndicator, { QualityIndicatorProps } from '../../ui/indicators/QualityIndicator/QualityIndicator';

type QualityLevel = -1 | 1 | 2 | 3 | 4 | 5;

type LocalQualityIndicatorProps = Partial<Omit<QualityIndicatorProps, 'qualityLevel'>>;

const LocalQualityIndicator = ({ testID, ...rest }: LocalQualityIndicatorProps) => {
  const [qualityLevel] = useState<QualityLevel>(-1);
  const { participant } = useSession();

  if (!participant) return null;

  //   TODO - temporary way to show dynamic data in quality indicators
  //   TODO - in the future use quality level based on participant from useSession()

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

export default LocalQualityIndicator;
