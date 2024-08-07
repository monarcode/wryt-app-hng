import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SortIcon from '~/assets/icons/sort-icon.svg';
import { Text, View } from '~/components/shared';
import { theme } from '~/theme';

const SavedSketches = () => {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Sketches</Text>

        <Pressable style={styles.sort}>
          <SortIcon width={24} height={24} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: theme.fontFamily.semiBold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sort: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 50,
  },
});

export default SavedSketches;
