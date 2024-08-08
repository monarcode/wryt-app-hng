import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import RedoIcon from '~/assets/icons/redo-icon.svg';
import UndoIcon from '~/assets/icons/undo-icon.svg';
import { View } from '~/components/shared';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';

const UndoRedo = () => {
  const undo = useSketchPadStore((state) => state.undo);
  const redo = useSketchPadStore((state) => state.redo);
  const pathsLength = useSketchPadStore((state) => state.paths.length);
  const redoStackLength = useSketchPadStore((state) => state.redoStack.length);

  const handleUndo = useCallback(() => {
    console.log('Undo pressed');
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    console.log('Redo pressed');
    redo();
  }, [redo]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.action}
        onPress={handleUndo}
        activeOpacity={0.7}
        disabled={pathsLength === 0}>
        <UndoIcon opacity={pathsLength === 0 ? 0.5 : 1} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.action}
        onPress={handleRedo}
        activeOpacity={0.7}
        disabled={redoStackLength === 0}>
        <RedoIcon opacity={redoStackLength === 0 ? 0.5 : 1} />
      </TouchableOpacity>
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
