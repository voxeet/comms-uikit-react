import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render } from '../../../utils/tests/test-utils';

import Avatar from './Avatar';

const testID = 'testID';

const singleNameParticipant = createParticipant({ name: 'One', id: 'One' });
const doubleNameParticipant = createParticipant({ name: 'One Two', id: 'One Two' });

describe('Avatar component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Avatar testID={testID} participant={singleNameParticipant} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Has first letter from name', () => {
    const { getByText } = render(<Avatar testID={testID} participant={singleNameParticipant} />);
    const letter = singleNameParticipant.info.name?.charAt(0);
    if (letter) {
      expect(getByText(letter)).not.toBeNull();
    }
  });
  test('Has first letter from name and first from surname', () => {
    const { getByText } = render(<Avatar testID={testID} participant={doubleNameParticipant} />);
    const names = doubleNameParticipant.info.name?.split(' ');
    if (names) {
      const letters = `${names[0].charAt(0)}${names[1].charAt(0)}`;
      expect(getByText(letters)).not.toBeNull();
    }
  });
});
