import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ColorPicker, { Panel1, Preview } from 'reanimated-color-picker';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  recentlyUsedColors: string[];
  onColorSelect: (color: string) => void;
}

const BottomSheet: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  recentlyUsedColors,
  onColorSelect,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%', '100%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  React.useEffect(() => {
    if (visible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      onDismiss={onClose}>
      <BottomSheetView style={styles.modalContent}>
        <View style={styles.modalHeader} />

        <Text style={styles.title}>Pick A Color</Text>
        <Text style={styles.subtitle}>Select color to draw on your canvas</Text>

        <ColorPicker
          style={styles.colorPicker}
          value="#FF5733"
          onComplete={({ hex }) => onColorSelect(hex)}>
          <Preview />
          <Panel1 />
        </ColorPicker>

        <Text style={styles.recentlyUsedText}>Recently Used</Text>
        <View style={styles.recentColors}>
          {recentlyUsedColors.map((color, index) => (
            <View key={index} style={[styles.recentColor, { backgroundColor: color }]} />
          ))}
        </View>

        <TouchableOpacity onPress={onClose} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save and Continue</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
  },
  modalHeader: {
    width: 50,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 20,
  },
  colorPicker: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  recentlyUsedText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 10,
  },
  recentColors: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  recentColor: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2D2966',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BottomSheet;
