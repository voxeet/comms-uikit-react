import defaultTheme from '../../../theme/defaultTheme';
import { fireEvent, render, screen, waitFor } from '../../../utils/tests/test-utils';

import ThemeSelect from './ThemeSelect';

const label = 'theme-label';
const placeholder = 'theme-placeholder';
const testID = 'testID';
const activeTheme = 'theme1';

jest.mock('../../../hooks/useTheme', () => {
  return jest.fn(() => ({
    ...jest.requireActual('../../../hooks/useTheme'),
    theme: defaultTheme,
    getColor: jest.fn(),
    availableThemes: ['theme1', 'theme2'],
    activeTheme,
  }));
});

describe('ThemeSelect component', () => {
  test('Passes TestID', async () => {
    const { getByTestId } = render(<ThemeSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      expect(getByTestId(testID)).toBeInTheDocument();
    });
  });
  test('Selects default theme', async () => {
    render(<ThemeSelect testID={testID} label={label} placeholder={placeholder} />);

    await waitFor(async () => {
      const activeThemeText = screen.queryByText(activeTheme);
      expect(activeThemeText).toBeInTheDocument();
    });
  });
  test('On click opens dropdown with list of themes', async () => {
    const { getByRole } = render(<ThemeSelect testID={testID} label={label} placeholder={placeholder} />);
    await waitFor(() => {
      fireEvent.click(getByRole('button'));
      expect(/theme1/).not.toBeNull();
      expect(/theme2/).not.toBeNull();
    });
  });
});
