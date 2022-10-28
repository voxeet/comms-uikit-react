// eslint-disable-next-line import/no-extraneous-dependencies

import { Status as ShareStatus } from '../../../hooks/types/misc';
import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';
import Space from '../../ui/Space/Space';
import Text from '../../ui/Text/Text';

import ScreenSharingPresentationBox from './ScreenSharingPresentationBox';

const testID = 'testID';
const fallbackTestId = 'fallbackTestID';
const customFallbackContentText = 'Test Fallback Content';
const fallbackText = 'Default Fallback Text';
const fallbackButtonText = 'Try again';
const backgroundColor = 'primary.500';
const containerWidth = 938;
const containerHeight = 556;

const testCustomFallbackContent = (
  <Space testID={fallbackTestId}>
    <Text>{customFallbackContentText}</Text>
  </Space>
);

const { colors } = theme;

jest.mock('../../../hooks/useScreenSharing', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useScreenSharing'),
    status: ShareStatus.Error,
    isLocalUserPresentationOwner: true,
  }));
});

describe('ScreenSharingPresentationBox component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <ScreenSharingPresentationBox
        customFallbackContent={testCustomFallbackContent}
        fallbackButtonText={fallbackButtonText}
        fallbackText={fallbackText}
        testID={testID}
      />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should has backgroundColor from props', () => {
    const { getByTestId } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <ScreenSharingPresentationBox
          testID={testID}
          backgroundColor={backgroundColor}
          fallbackButtonText={fallbackButtonText}
          fallbackText={fallbackText}
        />
      </Space>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveStyle(`background: ${colors.primary[500]}`);
  });
  test('Should has fallbackButtonText and fallbackText from props if error and is local user presentation owner', () => {
    const { getByTestId, getByText } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <ScreenSharingPresentationBox
          testID={testID}
          backgroundColor={backgroundColor}
          fallbackButtonText={fallbackButtonText}
          fallbackText={fallbackText}
        />
      </Space>,
    );
    const fallbackElement = getByTestId('DefaultFallback');
    const fallbackTextElement = getByText(fallbackText);
    const fallbackButtonTextElement = getByText(fallbackButtonText);
    expect(fallbackElement).toBeDefined();
    expect(fallbackTextElement).toBeDefined();
    expect(fallbackButtonTextElement).toBeDefined();
  });

  test('Should has testCustomFallbackContent from props if error and is local user presentation owner', () => {
    const { getByTestId, getByText } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <ScreenSharingPresentationBox
          testID={testID}
          backgroundColor={backgroundColor}
          fallbackButtonText={fallbackButtonText}
          fallbackText={fallbackText}
          customFallbackContent={testCustomFallbackContent}
        />
      </Space>,
    );
    const fallbackElement = getByTestId(fallbackTestId);
    const fallbackElementText = getByText(customFallbackContentText);
    expect(fallbackElement).toBeDefined();
    expect(fallbackElementText).toBeDefined();
  });
});
