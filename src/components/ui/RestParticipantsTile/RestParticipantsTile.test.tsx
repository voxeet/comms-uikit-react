import { createParticipant } from '../../../utils/tests/dataCreators.util';
import { render } from '../../../utils/tests/test-utils';

import RestParticipantsTile from './RestParticipantsTile';

const testID = 'testID';

const oneParticipant = [createParticipant({ name: 'One', id: 'One' })];
const twoParticipants = [...oneParticipant, createParticipant({ name: 'Two', id: 'Two' })];
const threeParticipants = [...twoParticipants, createParticipant({ name: 'Three', id: 'Three' })];
const fourParticipants = [...threeParticipants, createParticipant({ name: 'Four', id: 'Four' })];

describe('RestParticipantsTile component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<RestParticipantsTile testID={testID} participants={[]} />);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Displays proper length of participants', () => {
    const { getByText, rerender } = render(<RestParticipantsTile testID={testID} participants={[]} />);
    expect(getByText('0')).not.toBeNull();
    rerender(<RestParticipantsTile testID={testID} participants={oneParticipant} />);
    expect(getByText('1')).not.toBeNull();
    rerender(<RestParticipantsTile testID={testID} participants={twoParticipants} />);
    expect(getByText('2')).not.toBeNull();
    rerender(<RestParticipantsTile testID={testID} participants={threeParticipants} />);
    expect(getByText('3')).not.toBeNull();
    rerender(<RestParticipantsTile testID={testID} participants={fourParticipants} />);
    expect(getByText('4')).not.toBeNull();
  });
  test('Displays proper length of avatars, max 3', () => {
    const { getByTestId, rerender } = render(<RestParticipantsTile testID={testID} participants={oneParticipant} />);
    expect(getByTestId('avatarRow').childNodes.length).toBe(1);
    rerender(<RestParticipantsTile testID={testID} participants={twoParticipants} />);
    expect(getByTestId('avatarRow').childNodes.length).toBe(2);
    rerender(<RestParticipantsTile testID={testID} participants={threeParticipants} />);
    expect(getByTestId('avatarRow').childNodes.length).toBe(3);
    rerender(<RestParticipantsTile testID={testID} participants={fourParticipants} />);
    expect(getByTestId('avatarRow').childNodes.length).toBe(3);
  });
});
