import { Pressable, StyleSheet } from 'react-native';

import EraserIcon from '~/assets/icons/eraser-icon.svg';
import SaveIcon from '~/assets/icons/save-icon.svg';
import { View } from '~/components/shared';
import { theme } from '~/theme';

interface Props {
  handleSave: (open: boolean) => void;
  handleErase: (open: boolean) => void;
}

const SaveErase = ({ handleSave, handleErase }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.action} onPress={() => handleSave(true)}>
        <SaveIcon />
      </Pressable>
      <Pressable onPress={() => handleErase(true)} style={styles.action}>
        <EraserIcon />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: theme.colors.light,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 50,
    flexDirection: 'row',
    gap: 14,
  },
  action: {},
});

export default SaveErase;
