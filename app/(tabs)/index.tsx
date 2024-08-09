import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SketchCanvas } from '~/components/SketchCanvas';
import ClearSketchModal from '~/components/modals/ClearSketchModal';
import SaveSketchModal from '~/components/modals/SaveSketchModal';
import BottomSheetContent from '~/modules/bottom-sheet/Bottom-sheet-content';
import CustomBackdrop from '~/modules/bottom-sheet/custom-backdrop';
import ColorPicker from '~/modules/canvas/color-picker';
import SaveErase from '~/modules/canvas/save-erase';
import StrokePicker from '~/modules/canvas/stroke-picker';
import UndoRedo from '~/modules/canvas/undo-redo';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEraseModalOpen, setIsEraseModalOpen] = useState(false);
  const setSnapshotUri = useSketchPadStore((state) => state.setSnapshotUri);

  const handleEraseModalOpenChange = (open: boolean) => {
    setIsEraseModalOpen(open);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const handleSaveSnapshot = (uri: string) => {
    setSnapshotUri(uri);
  };

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const handleOpenPalette = () => {
    bottomSheetRef.current?.present();
  };

  const SaveSelectedColor = () => {
    bottomSheetRef.current?.dismiss();
  };

  return (
    <>
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, paddingHorizontal: 18, backgroundColor: theme.colors.light }}>
        <View style={styles.container}>
          <SketchCanvas containerStyle={{ flex: 1 }} onSaveSnapshot={handleSaveSnapshot} />
          <SaveErase handleErase={handleEraseModalOpenChange} handleSave={handleModalOpenChange} />
          <UndoRedo />
          <ColorPicker onPress={handleOpenPalette} />
          <StrokePicker />
        </View>
        <SaveSketchModal isOpen={isModalOpen} onOpenChange={handleModalOpenChange} />
        <ClearSketchModal isOpen={isEraseModalOpen} onOpenChange={handleEraseModalOpenChange} />

        {/* Color Palette Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          handleStyle={{
            backgroundColor: '#fff',
            paddingTop: 16,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
          backdropComponent={({ animatedIndex, style, animatedPosition }) => (
            <CustomBackdrop
              style={style}
              animatedIndex={animatedIndex}
              animatedPosition={animatedPosition}
              close={SaveSelectedColor}
            />
          )}
          enablePanDownToClose>
          <BottomSheetView style={styles.sheetContentContainer}>
            <BottomSheetContent onPress={SaveSelectedColor} />
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },

  sheetContentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 8,
  },
});
