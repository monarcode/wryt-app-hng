import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Image, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as PopoverPrimitive from '@rn-primitives/popover';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import Entypo from '@expo/vector-icons/Entypo';

import SortIcon from '~/assets/icons/sort-icon.svg';
import { Text, View } from '~/components/shared';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';
import timeAgo from '~/utils/timeAgo';
import DeleteSketchModal from '~/components/modals/DeleteSketchModal';

interface Sketch {
  fileName: string;
  timeStamp: string;
  imageUri: string;
}

const SavedSketches = () => {
  const triggerRef = useRef<PopoverPrimitive.PopoverTriggerRef>(null)
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const getAllSavedDrawings = useSketchPadStore((state) => state.getAllSavedDrawings);
  const refreshTrigger = useSketchPadStore((state) => state.refreshTrigger);
  const deleteDrawing = useSketchPadStore((state) => state.deleteDrawing);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSavedSketches = async () => {
    const drawings = await getAllSavedDrawings();
    setSketches(drawings);
  };

  useEffect(() => {
    loadSavedSketches();
  }, [refreshTrigger]);

  const renderSketch = ({ item }: { item: Sketch }) => {

    const onDeleteSketch = async () => {
      await deleteDrawing(item.timeStamp);
      loadSavedSketches();
      if (triggerRef.current)
        triggerRef.current.close()
    }

    const handleEditSketch = () => {
      if (triggerRef.current)
        triggerRef.current.close()
    };

    return (
      <>
        <ImageBackground
          resizeMode='contain'
          source={{ uri: `data:image/png;base64,${item.imageUri}` }}
          style={styles.sketchContainer}
        >
          <View style={styles.cardHead}>
            <View />
            <PopoverPrimitive.Root>
              <PopoverPrimitive.Trigger ref={triggerRef}>
                <Entypo name="dots-three-vertical" size={15} color="#47474F" />
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content side="bottom" sideOffset={5}>
                  <Animated.View
                    entering={FadeInDown.duration(200)}
                    exiting={FadeOutDown.duration(200)}
                    style={styles.popover}>
                    <TouchableOpacity onPress={handleEditSketch}>
                      <Text style={styles.selectText}>Edit Sketch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalOpen(true)}>
                      <Text style={styles.selectText}>Delete Sketch</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          </View>

          <View>
            <Text style={styles.sketchTitle}>{item.fileName}</Text>
            <Text style={styles.sketchTimestamp}>{timeAgo(item.timeStamp)}</Text>
          </View>
        </ImageBackground>
        <DeleteSketchModal
          onDeleteSketch={onDeleteSketch}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.light }}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Sketches</Text>

        <Pressable style={styles.sort}>
          <SortIcon width={24} height={24} />
        </Pressable>
      </View>
      <FlatList
        data={sketches}
        numColumns={2}
        renderItem={renderSketch}
        keyExtractor={(item, index) => `${item.timeStamp}_${index}`}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20
  },
  sort: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fontFamily.semiBold,
  },
  list: {
    padding: 16,
    width: '100%',
  },
  sketchContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: '46%',
    height: 264,
    marginHorizontal: '2%',

    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  sketchPreview: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  sketchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sketchTimestamp: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.colors.gray,
  },
  cardHead: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  popover: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#DCDCDE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 14,
    fontFamily: theme.fontFamily.regular,
    color: '#47474F',
    height: 25,
  },
});

export default SavedSketches;
