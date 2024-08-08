import Entypo from '@expo/vector-icons/Entypo';
import * as PopoverPrimitive from '@rn-primitives/popover';
import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import SortIcon from '~/assets/icons/sort-icon.svg';
import DeleteSketchModal from '~/components/modals/DeleteSketchModal';
import { Text, View } from '~/components/shared';
import EmptyState from '~/components/shared/emptyState';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';
import timeAgo from '~/utils/timeAgo';

interface Sketch {
  fileName: string;
  timeStamp: string;
  imageUri: string;
}

const SavedSketches = () => {
  const triggerRef = useRef<PopoverPrimitive.PopoverTriggerRef>(null);
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const getAllSavedDrawings = useSketchPadStore((state) => state.getAllSavedDrawings);
  const refreshTrigger = useSketchPadStore((state) => state.refreshTrigger);
  const deleteDrawing = useSketchPadStore((state) => state.deleteDrawing);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  const loadSavedSketches = async () => {
    const drawings = await getAllSavedDrawings();
    setSketches(drawings);
  };

  useEffect(() => {
    loadSavedSketches();
  }, [refreshTrigger, isSorted]);

  const renderSketch = ({ item }: { item: Sketch }) => {
    const onDeleteSketch = async () => {
      await deleteDrawing(item.timeStamp);
      loadSavedSketches();
      if (triggerRef.current) triggerRef.current.close();
    };

    const handleEditSketch = () => {
      if (triggerRef.current) {
        triggerRef.current.close();
      }
    };

    return (
      <ImageBackground
        resizeMode="contain"
        source={{ uri: `data:image/png;base64,${item.imageUri}` }}
        style={styles.sketchContainer}>

        <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
          <View style={styles.cardHead}>
            <View />
            <PopoverPrimitive.Root>
              <PopoverPrimitive.Trigger ref={triggerRef}>
                <View style={{ paddingTop: 10, paddingRight: 10 }}>
                  <Entypo name="dots-three-vertical" size={15} color="#47474F" />
                </View>
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

          <View
            style={{
              flex: 1,
              width: '100%',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              resizeMode="contain"
              source={{ uri: `data:image/png;base64,${item.imageUri}` }}
              style={styles.sketchImage}
            />
          </View>

          <View
            style={{
              width: '100%',
              position: 'absolute',
              paddingBottom: 16,
              paddingLeft: 8,
              paddingTop: 8,
              opacity: 0.9,
              bottom: 0,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: theme.colors.light,
            }}>
            <Text style={styles.sketchTitle}>{item.fileName}</Text>
            <Text style={styles.sketchTimestamp}>{timeAgo(item.timeStamp)}</Text>
          </View>
        </TouchableOpacity>

        <DeleteSketchModal
          onDeleteSketch={onDeleteSketch}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentKey={item.timeStamp}
        />
      </ImageBackground>
    );
  };

  const sortedSketches = () => {
    if (isSorted) {
      return sketches.sort((a: Sketch, b: Sketch) => a.fileName.localeCompare(b.fileName));
    }
    return sketches;
  };

  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.colors.light }}>
      {sketches.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Saved Sketches</Text>

            <TouchableOpacity activeOpacity={0.6} style={styles.sort} onPress={toggleSort}>
              <SortIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={sortedSketches()}
            numColumns={2}
            renderItem={renderSketch}
            keyExtractor={(item, index) => `${item.timeStamp}_${index}`}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fontFamily.semiBold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sort: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 50,
  },
  list: {
    padding: 16,
    width: '100%',
  },
  sketchContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
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
  sketchImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  sketchTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.dark,
    textTransform: 'capitalize',
  },
  sketchTimestamp: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.neutral[300],
  },
  cardHead: {
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
