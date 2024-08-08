import { Text, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import React from 'react';
import * as Dialog from '@rn-primitives/dialog';
import { theme } from '~/theme';
import useSketchPadStore from '~/store/store';

interface Props {
  onDeleteSketch: () => void;
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
}

const DeleteSketchModal = ({ isOpen, onClose, onDeleteSketch, currentKey }: Props) => {
  const deleteDrawing = useSketchPadStore((state) => state.deleteDrawing);

  const handleDelete = async () => {
    await deleteDrawing(currentKey);
    onDeleteSketch();
    onClose();
  };
  const handleCancel = async () => {
    onClose();
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.modalContainer}>
          <Dialog.Title style={styles.title}>
            Are You Sure You Want to delete this Canvas?
          </Dialog.Title>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteSketchModal;

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
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
    textAlign: 'center',
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
    width: '48%',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: '#D3D3D3',
    width: '48%',
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
  },
});
