import { render, screen } from '../../../utils/tests/test-utils';
import Avatar from '../Avatar/Avatar';

import Status from './Status';

const props = {
  testID: 'testID',
  label: 'Test Status',
  icon: 'present',
} as const;

describe('StatusActionBar component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Status {...props}>Hello World</Status>);
    expect(getByTestId(props.testID)).not.toBeNull();
  });

  test('renders avatar instead fo icon ', () => {
    const avatarTestId = 'AVATAR';
    const avatar = <Avatar size="s" participant="Test" testID={avatarTestId} />;
    render(<Status {...props} avatar={avatar} />);
    expect(screen.queryByTestId(avatarTestId)).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  test('renders label of current status ', () => {
    const { getByText } = render(<Status {...props} />);
    expect(getByText(props.label)).toBeInTheDocument();
  });
});
