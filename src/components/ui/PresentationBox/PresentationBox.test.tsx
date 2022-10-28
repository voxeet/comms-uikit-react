// eslint-disable-next-line import/no-extraneous-dependencies

import theme from '../../../theme/defaultTheme';
import { render } from '../../../utils/tests/test-utils';
import Space from '../Space/Space';
import Text from '../Text/Text';

import PresentationBox from './PresentationBox';

const testID = 'testID';
const fallbackTestID = 'fallbackTestID';
const fallbackTextContent = 'Test Fallback Content';
const backgroundColor = 'grey.800';
const containerWidth = 938;
const containerHeight = 556;

const { colors } = theme;

const testFallbackContent = (
  <Space testID={fallbackTestID}>
    <Text>{fallbackTextContent}</Text>
  </Space>
);

describe('PresentationBox component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(
      <PresentationBox
        testID={testID}
        stream={undefined}
        fallbackContent={testFallbackContent}
        isLocalUserPresentationOwner
        backgroundColor={backgroundColor}
      />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should has backgroundColor from props', () => {
    const { getByTestId } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <PresentationBox
          testID={testID}
          stream={undefined}
          fallbackContent={testFallbackContent}
          isLocalUserPresentationOwner
          backgroundColor={backgroundColor}
        />
      </Space>,
    );
    const element = getByTestId(testID);
    expect(element).toHaveStyle(`background: ${colors.grey[800]}`);
  });
  test('Should display fallbackContent if is error and is local user owner', () => {
    const { getByTestId, getByText } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <PresentationBox
          testID={testID}
          stream={undefined}
          fallbackContent={testFallbackContent}
          isLocalUserPresentationOwner
          isError
          backgroundColor={backgroundColor}
        />
      </Space>,
    );
    const fallbackElement = getByTestId(fallbackTestID);
    const fallbackElementByText = getByText(fallbackTextContent);
    expect(fallbackElement).toBeDefined();
    expect(fallbackElementByText).toBeDefined();
  });
  test('Should not display fallbackContent if is error but is not local user presentation owner', () => {
    const { queryByTestId, queryByText } = render(
      <Space style={{ width: containerWidth, height: containerHeight }}>
        <PresentationBox
          testID={testID}
          stream={undefined}
          fallbackContent={testFallbackContent}
          isLocalUserPresentationOwner={false}
          isError
          backgroundColor={backgroundColor}
        />
      </Space>,
    );
    const fallbackElement = queryByTestId(fallbackTestID);
    const fallbackElementByText = queryByText(fallbackTextContent);
    expect(fallbackElement).toBeDefined();
    expect(fallbackElementByText).toBeDefined();
  });
});
