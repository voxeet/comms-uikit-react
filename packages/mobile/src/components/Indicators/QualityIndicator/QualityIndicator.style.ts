import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  quality: {
    boxSizing: 'border-box',
    width: 26,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 4,
    borderRadius: 6,
  },

  line: {
    width: 2,
    borderRadius: 2,
  },

  first: {
    height: 4,
  },
  second: {
    height: 6,
  },
  third: {
    height: 8,
  },
  fourth: {
    height: 10,
  },
  fifth: {
    height: 12,
  },
});

export default styles;
