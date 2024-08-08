import AsyncStorage from '@react-native-async-storage/async-storage';
import { Skia, SkPictureRecorder, SkPicture } from '@shopify/react-native-skia';
import { create } from 'zustand';

import { StoreType, PathType, Point } from '~/types/store';
import { createSmoothPath } from '~/utils/store.utils';

const useSketchPadStore = create<StoreType>((set, get) => ({
  recentColors: ['#00BCD4', '#9C27B0', '#FF5722'],

  paths: [],
  redoStack: [],
  color: '#FF5733',
  strokeWidth: 2,
  strokeStyle: 'stroke',
  currentPath: null,
  fileName: '',
  timeStamp: '',
  refreshTrigger: 0,
  currentPoints: [],
  snapshot: null,
  snapshotUri: '',
  currentKey: '',

  setSnapshotUri: (uri: string) => set({ snapshotUri: uri }),

  setColor: (color) => {
    const { recentColors, setRecentColors } = get();
    const updatedRecentColors = [color, ...recentColors.filter((c) => c !== color)].slice(0, 3);
    set({ color, recentColors: updatedRecentColors });
  },

  setRecentColors: (colors) => set({ recentColors: colors }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setStrokeStyle: (strokeStyle) => set({ strokeStyle }),
  setFileName: (fileName) => set({ fileName }),

  startPath: (x, y) => {
    const { color, strokeWidth, strokeStyle } = get();
    const newPath = Skia.Path.Make();
    newPath.moveTo(x, y);
    set({
      currentPath: { path: newPath, color, strokeWidth, strokeStyle },
      currentPoints: [{ x, y }],
    });
  },

  addToPath: (x, y) => {
    const { currentPath, currentPoints } = get();
    if (currentPath) {
      currentPoints.push({ x, y });
      currentPath.path.lineTo(x, y);
      set({ currentPath, currentPoints });
    }
  },

  endPath: () => {
    const { currentPath, paths, currentPoints } = get();
    if (currentPath) {
      const smoothedPath = createSmoothPath(currentPoints);
      const updatedPath = {
        ...currentPath,
        path: smoothedPath,
      };
      set({
        paths: [...paths, updatedPath],
        currentPath: null,
        currentPoints: [],
      });
    }
  },

  addPath: (newPath: PathType) =>
    set((state) => ({
      paths: [...state.paths, newPath],
    })),

  undo: () =>
    set((state) => {
      if (state.paths.length > 0) {
        const newPaths = [...state.paths];
        const lastPath = newPaths.pop()!;
        return {
          paths: newPaths,
          redoStack: [...state.redoStack, lastPath],
        };
      }
      return state;
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length > 0) {
        const newRedoStack = [...state.redoStack];
        const lastRedoPath = newRedoStack.pop()!;
        return {
          paths: [...state.paths, lastRedoPath],
          redoStack: newRedoStack,
        };
      }
      return state;
    }),
  clear: () => {
    set({ paths: [], redoStack: [], currentPath: null, currentPoints: [], snapshot: null });
  },

  saveDrawing: async () => {
    try {
      const { paths, fileName, snapshotUri, clear } = get();
      const serializedPaths = JSON.stringify(
        paths.map((p) => ({
          path: p.path.toSVGString(),
          color: p.color,
          strokeWidth: p.strokeWidth,
          strokeStyle: p.strokeStyle,
        }))
      );

      const timeStamp = new Date().toISOString();
      const key = `@sketchpad_drawing_${timeStamp}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify({ fileName, timeStamp, paths: serializedPaths, imageUri: snapshotUri })
      );
      set({ timeStamp, currentKey: key });
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
      clear();
    } catch (e) {
      console.error('Failed to save drawing.', e);
    }
  },

  deleteDrawing: async (timeStamp: string) => {
    try {
      const { currentKey } = get();
      await AsyncStorage.removeItem(currentKey);
      set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
    } catch (e) {
      console.error('Failed to save drawing.', e);
    }
  },

  loadDrawing: async () => {
    try {
      const serializedData = await AsyncStorage.getItem('@sketchpad_drawing');
      if (serializedData) {
        const { fileName, timeStamp, paths } = JSON.parse(serializedData);
        const loadedPaths: PathType[] = paths.map((p: any) => ({
          path: Skia.Path.MakeFromSVGString(p.path),
          color: p.color,
          strokeWidth: p.strokeWidth,
          strokeStyle: p.strokeStyle,
        }));
        set({ paths: loadedPaths, fileName, timeStamp });
      }
    } catch (e) {
      console.error('Failed to load drawing.', e);
    }
  },

  getAllSavedDrawings: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const drawingKeys = keys.filter((key) => key.startsWith('@sketchpad_drawing_'));
      const drawings = await AsyncStorage.multiGet(drawingKeys);
      return drawings
        .map(([key, value]) => (value ? JSON.parse(value) : null))
        .filter((drawing) => drawing !== null);
    } catch (e) {
      console.error('Failed to load drawings', e);
      return [];
    }
  },
}));

export default useSketchPadStore;
