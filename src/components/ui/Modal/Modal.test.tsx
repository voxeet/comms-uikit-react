import { render, fireEvent } from '../../../utils/tests/test-utils';

import Modal from './Modal';

const testID = 'testID';
const childText = 'Child is here';

const closeMock = jest.fn();
const Child = () => <div>{childText}</div>;
const props = { close: closeMock, testID, isVisible: true };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Modal component', () => {
  test('Passes TestID', () => {
    const { queryByTestId, rerender } = render(<Modal {...props} isVisible={false} />);
    expect(queryByTestId(testID)).toBeNull();
    rerender(<Modal {...props} />);
    expect(queryByTestId(testID)).not.toBeNull();
  });
  test('Renders  children element', () => {
    const { getByText } = render(
      <Modal {...props}>
        <Child />
      </Modal>,
    );
    expect(getByText(childText)).toBeInTheDocument();
  });
  test('Renders close icon and invoke it while clicked', () => {
    const { getByTestId } = render(<Modal {...props} closeButton />);
    const closeButton = getByTestId('ModalCloseIcon');
    expect(getByTestId('ModalCloseIcon')).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(closeMock).toBeCalledTimes(1);
  });
  test('Passes close function to overlay', () => {
    const { getByTestId } = render(<Modal {...props} overlayClickClose />);
    fireEvent.click(getByTestId('Overlay'));
    expect(closeMock).toBeCalledTimes(1);
  });
});
