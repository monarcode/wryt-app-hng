import { TouchableOpacity, StyleSheet } from 'react-native';

import ColorPickerIcon from '~/assets/icons/color-picker.svg';
import { View } from '~/components/shared';
import { theme } from '~/theme';

interface ColorPickerProps {
  onPress: () => void;
}

const ColorPicker = ({ onPress }: ColorPickerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.colorWrapper}>
        <View style={[styles.activeColor]} />
      </View>

      <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.action}>
        <ColorPickerIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    rowGap: 8,
  },
  action: {
    backgroundColor: theme.colors.light,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    gap: 14,
  },
  colorWrapper: {
    borderWidth: 1,
    padding: 1.2,
    alignSelf: 'flex-start',
    borderRadius: 50,
    marginHorizontal: 'auto',
  },
  activeColor: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#000',
  },
});

export default ColorPicker;
