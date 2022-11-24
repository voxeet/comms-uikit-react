import { render, fireEvent, waitFor } from '../../../utils/tests/test-utils';

import Input from './Input';

const invalidMessage = 'invalid';

const onChange = jest.fn();

const props = {
  testID: 'testID',
  label: 'label',
  value: 'value',
  onChange,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Text component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Input {...props} />);
    expect(getByTestId(props.testID)).not.toBeNull();
  });
  test('Has initial value', () => {
    const { getByDisplayValue } = render(<Input {...props} />);
    expect(getByDisplayValue(props.value)).not.toBeNull();
  });
  test('Displays invalid message', () => {
    const { getByText } = render(<Input validation={{ valid: false, message: invalidMessage }} {...props} />);
    expect(getByText(invalidMessage)).not.toBeNull();
  });
  test('Displays label when passed', () => {
    const { getByText } = render(<Input {...props} />);
    expect(getByText(props.label)).not.toBeNull();
  });
  test('Properly set input for secure option', async () => {
    const { getByTestId, container } = render(<Input {...props} secure />);
    const clearButton = getByTestId('SecureIcon');
    expect(clearButton).not.toBeNull();
    const input = container.querySelector('input');
    expect(input).toHaveClass('securePadding');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(clearButton);
    await waitFor(() => {
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
  test('Properly clear input value', async () => {
    const { getByTestId } = render(<Input {...props} secure />);
    const clearButton = getByTestId('CloseIcon');
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(onChange).toBeCalledTimes(1);
    });
  });
});
