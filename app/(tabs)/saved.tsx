import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SortIcon from '~/assets/icons/sort-icon.svg';
import { Text, View } from '~/components/shared';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';

interface Sketch {
  fileName: string;
  timeStamp: string;
  imageUri: string;
}

const SavedSketches = () => {
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const getAllSavedDrawings = useSketchPadStore((state) => state.getAllSavedDrawings);
  const refreshTrigger = useSketchPadStore((state) => state.refreshTrigger);

  useEffect(() => {
    const loadSavedSketches = async () => {
      const drawings = await getAllSavedDrawings();
      setSketches(drawings);
    };

    loadSavedSketches();
  }, [refreshTrigger]);

  const renderSketch = ({ item }: { item: Sketch }) => (
    <View style={styles.sketchContainer}>
      <Image
        source={{ uri: `data:image/png;base64,${item.imageUri}` }}
        style={styles.sketchPreview}
      />
      <Text style={styles.sketchTitle}>{item.fileName}</Text>
      <Text style={styles.sketchTimestamp}>{new Date(item.timeStamp).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Sketches</Text>
        <Pressable style={styles.sort}>
          <SortIcon width={24} height={24} />
        </Pressable>
      </View>
      <FlatList
        data={sketches}
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
    padding: 16,
    backgroundColor: theme.colors.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sort: {
    padding: 8,
  },
  list: {
    padding: 16,
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
    color: theme.colors.gray,
  },
});

export default SavedSketches;
