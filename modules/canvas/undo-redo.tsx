import { Pressable, StyleSheet } from 'react-native';

import RedoIcon from '~/assets/icons/redo-icon.svg';
import UndoIcon from '~/assets/icons/undo-icon.svg';
import { View } from '~/components/shared';
import { theme } from '~/theme';

const UndoRedo = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.action}>
        <UndoIcon />
      </Pressable>
      <Pressable style={styles.action}>
        <RedoIcon />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: theme.colors.light,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 50,
    flexDirection: 'row',
    gap: 10,
  },
  action: {},
});

export default UndoRedo;
