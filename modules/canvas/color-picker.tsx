import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import ColorPickerIcon from '~/assets/icons/color-picker.svg';
import BottomSheet from '~/components/BottomSheet';
import { View } from '~/components/shared';
import { theme } from '~/theme';

const ColorPicker: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recentlyUsedColors, setRecentlyUsedColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('#000');

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    setRecentlyUsedColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)].slice(0, 3);
      return newColors;
    });
    setModalVisible(false);
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.colorWrapper}>
          <View style={[styles.activeColor, { backgroundColor: currentColor }]} />
        </View>

        <Pressable onPress={() => setModalVisible(true)} style={styles.action}>
          <ColorPickerIcon />
        </Pressable>

        <BottomSheet
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          recentlyUsedColors={recentlyUsedColors}
          onColorSelect={handleColorSelect}
        />
      </View>
    </BottomSheetModalProvider>
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
