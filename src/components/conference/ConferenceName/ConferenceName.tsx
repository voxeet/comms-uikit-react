import useConference from '../../../hooks/useConference';
import Text, { TextProps } from '../../ui/Text/Text';

type ConferenceNameProps = Partial<TextProps>;

const ConferenceName = ({ testID, type = 'H3', ...rest }: ConferenceNameProps) => {
  const { conference } = useConference();

  if (!conference) return null;

  return (
    <Text testID={testID} type={type} {...rest}>
      {conference.alias}
    </Text>
  );
};

export default ConferenceName;
