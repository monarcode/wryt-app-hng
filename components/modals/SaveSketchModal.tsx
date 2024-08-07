import { Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import useSketchPadStore from '~/store/store';
import * as Dialog from '@rn-primitives/dialog';
import { theme } from '~/theme';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveSketchModal = ({ isOpen, onOpenChange }: Props) => {
  const [canvasName, setCanvasName] = useState('');
  const setFileName = useSketchPadStore((state) => state.setFileName);
  const saveDrawing = useSketchPadStore((state) => state.saveDrawing);

  const handleSave = async () => {
    setFileName(canvasName);
    await saveDrawing();
    onOpenChange(false);
    setCanvasName('');
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.modalContainer}>
          <Dialog.Title style={styles.title}>Save Drawing</Dialog.Title>
          <Dialog.Description style={styles.subtitle}>
            Enter a name for this canvas
          </Dialog.Description>
          <TextInput style={styles.input} value={canvasName} onChangeText={setCanvasName} />
          <TouchableOpacity
            style={[styles.button, canvasName === '' && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!canvasName}>
            <Text style={styles.buttonText}>Save and Continue</Text>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SaveSketchModal;

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -(0.435 * screenWidth) }, { translateY: -100 }],
    width: '87%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: theme.fontFamily.semiBold,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: theme.fontFamily.medium,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
  },
});
