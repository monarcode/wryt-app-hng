import { Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import React, { useState } from 'react';
import useSketchPadStore from '~/store/store';
import * as Dialog from '@rn-primitives/dialog';
import { theme } from '~/theme';
import { FractalNoise } from '@shopify/react-native-skia';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClearSketchModal = ({ isOpen, onOpenChange }: Props) => {
  const clearPaths = useSketchPadStore((store) => store.clear);
  const handleClear = async () => {
    clearPaths();
    onOpenChange(false)
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.modalContainer}>
          <Dialog.Title style={styles.title}>
            Are you sure you want to erase this canvas?
          </Dialog.Title>
          <View style={styles.buttonGroups}>
            <TouchableOpacity
              style={[styles.button, styles.buttonDisabled]}
              onPress={() => onOpenChange(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button]} onPress={handleClear}>
              <Text style={styles.buttonText}>Erase All</Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ClearSketchModal;

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
    textAlign: 'center',
    fontFamily: theme.fontFamily.semiBold,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: theme.fontFamily.medium,
  },
  buttonGroups: {
    flexDirection: 'row',
    width: '87%',
    flex: 1,
    gap: 20,
  },
  button: {
    width: '48%',
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
