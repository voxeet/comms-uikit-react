import { fireEvent, render } from '../../../utils/tests/test-utils';

import CopyConferenceLinkButton from './CopyConferenceLinkButton';

const text = 'copy';
const testID = 'testID';
const successText = 'success';
const url = 'myURL';

describe('CopyConferenceLinkButton component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(
      <CopyConferenceLinkButton testID={testID} tooltipText={text} successText={successText} url={url} />,
    );
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Shows tooltipText and successText after click', async () => {
    const { getByText, getByTestId } = render(
      <CopyConferenceLinkButton testID={testID} tooltipText={text} successText={successText} url={url} />,
    );
    const textRegEx = new RegExp(text, 'i');
    const successRegEx = new RegExp(successText, 'i');
    const element = getByTestId(testID);
    expect(getByText(textRegEx)).not.toBeNull();
    fireEvent.click(element);
    expect(getByText(successRegEx)).not.toBeNull();
  });
});
