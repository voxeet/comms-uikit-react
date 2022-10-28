import defaultTheme from '../../../theme/defaultTheme';
import { render, fireEvent } from '../../../utils/tests/test-utils';

import ActionBar from './ActionBar';

const testID = 'testID';
const customComponent = <span className="say-hello">Hello World</span>;
const props = {
  testID,
  actionButtonConfig: { callback: jest.fn(), label: 'click me', tooltip: 'tool' },
};

let isDesktop = true;

jest.mock('../../../hooks/useTheme', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useTheme'),
    theme: defaultTheme,
    getColor: jest.fn(),
    availableThemes: ['theme1', 'theme2'],
    isDesktop,
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  isDesktop = true;
});

describe('ActionBar component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<ActionBar {...props}>Hello World</ActionBar>);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('should display button component while passing callback', () => {
    const mockCallback = jest.fn();
    const { getByTestId } = render(
      <ActionBar {...props} actionButtonConfig={{ ...props.actionButtonConfig, callback: mockCallback }}>
        {customComponent}
      </ActionBar>,
    );
    const element = getByTestId('ActionBarButton');
    expect(element).not.toBeNull();
    fireEvent.click(element);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should not display button while no callback is provided', async () => {
    isDesktop = false;

    const { queryByTestId } = render(
      <ActionBar {...props} actionButtonConfig={undefined}>
        {customComponent}
      </ActionBar>,
    );
    expect(await queryByTestId('ActionBarButton')).not.toBeInTheDocument();
  });
  test('should apply compact classname', () => {
    const { getByTestId } = render(
      <ActionBar {...props} compact actionButtonConfig={undefined}>
        {customComponent}
      </ActionBar>,
    );
    expect(getByTestId(testID)).toHaveClass('compact');
  });
  test('should apply mobile classname', () => {
    isDesktop = false;
    const { getByTestId } = render(
      <ActionBar {...props} actionButtonConfig={undefined}>
        {customComponent}
      </ActionBar>,
    );
    expect(getByTestId(testID)).toHaveClass('mobile');
  });
  test('should apply proper classname while unified prop is provided', () => {
    isDesktop = false;
    const { getByTestId } = render(
      <ActionBar {...props} actionButtonConfig={undefined} unified>
        {customComponent}
      </ActionBar>,
    );
    expect(getByTestId(testID)).not.toHaveClass('mobile');
  });
});
