import { render } from '../../utils/test-utils';

import Input from './Input';

const testID = 'testID';
const label = 'label';
const initValue = 'value';
const invalidMessage = 'invalid';

const onChange = jest.fn();

describe('Text component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Input testID={testID} value={initValue} onChange={onChange} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Has initial value', () => {
    const { getByDisplayValue } = render(<Input testID={testID} value={initValue} onChange={onChange} />);
    expect(getByDisplayValue(initValue)).not.toBeNull();
  });
  test('Displays invalid message', () => {
    const { getByText } = render(
      <Input
        testID={testID}
        value={initValue}
        onChange={onChange}
        validation={{ valid: false, message: invalidMessage }}
      />,
    );
    expect(getByText(invalidMessage)).not.toBeNull();
  });
  test('Displays label when passed', () => {
    const { getByText } = render(<Input testID={testID} value={initValue} onChange={onChange} label={label} />);
    expect(getByText(label)).not.toBeNull();
  });
});
