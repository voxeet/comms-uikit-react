import React from 'react';
import { Text } from 'react-native';

import { render } from '../../utils/test-utils';

import Layout from './Layout';

const testID = 'testID';
const customComponent = <Text testID="say-hello">Hello World</Text>;

describe('Layout component', () => {
  test('Passes TestID', () => {
    const { getByTestId } = render(<Layout testID={testID}>Hello World</Layout>);
    expect(getByTestId(testID)).not.toBeNull();
  });
  test('Should render children correctly', () => {
    const { getByTestId } = render(<Layout testID={testID}>{customComponent}</Layout>);
    const element = getByTestId('say-hello');
    expect(element).not.toBeNull();
    expect(element).toHaveTextContent('Hello World');
  });
});
