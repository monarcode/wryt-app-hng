import React from 'react';
import { StyleSheet, View } from 'react-native';
import ColorPicker, { Panel4, returnedResults } from 'reanimated-color-picker';

import { Button, Text } from '~/components/shared';
import RecentColor from '~/components/shared/RecentColor';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';

const BottomSheetContent: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { color, setColor, recentColors, setRecentColors } = useSketchPadStore();

  const handleColorSelect = (colors: returnedResults) => {
    const selectedColor = colors.hex;
    setColor(selectedColor);
    const updatedRecentColors = [
      selectedColor,
      ...recentColors.filter((c) => c !== selectedColor),
    ].slice(0, 3);
    setRecentColors(updatedRecentColors);
  };

  return (
    <View style={styles.sheetContentContainer}>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text style={styles.title}>Pick A Color</Text>
        <Text style={styles.subtitle}>Select color to draw on your canvas</Text>
      </View>

      <View style={styles.colorContainer}>
        <ColorPicker value={color} onComplete={handleColorSelect}>
          <Panel4 style={{ width: '100%', height: 180 }} />
        </ColorPicker>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={styles.recentlyUsedText}>Recently Used</Text>
        <View style={styles.recentColors}>
          {recentColors.map((color, index) => (
            <RecentColor key={index} color={color} />
          ))}
        </View>
      </View>

      <Button children="Save and Continue" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContentContainer: {
    flex: 1,
    rowGap: 16,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.dark,
    fontFamily: theme.fontFamily.semiBold,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.neutral[200],
  },
  colorContainer: {
    width: '100%',
    minHeight: 180,
    backgroundColor: theme.colors.light,
    borderRadius: 16,
    padding: 10,
  },
  recentlyUsedText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.dark,
    fontFamily: theme.fontFamily.medium,
    paddingBottom: 8,
  },
  recentColors: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default BottomSheetContent;
