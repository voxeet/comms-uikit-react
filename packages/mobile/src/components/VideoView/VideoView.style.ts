import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  videoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    marginBottom: 10,
  },
  fallbackWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fallbackContent: {
    height: '100%',
    width: '100%',
  },
});
export default styles;
