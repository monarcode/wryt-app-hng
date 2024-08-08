export type Point = {
  x: number;
  y: number;
};

export type PathType = {
  path: SkPath;
  color: string;
  strokeWidth: number;
  strokeStyle: 'stroke' | 'fill';
};

export type StoreType = {
  getAllSavedDrawings: any;
  paths: PathType[];
  redoStack: PathType[];
  color: string;
  strokeWidth: number;
  strokeStyle: 'stroke' | 'fill';
  currentPath: PathType | null;
  currentPoints: Point[];
  fileName: string;
  timeStamp: string;
  snapshot: null;
  refreshTrigger: number;
  snapshotUri: string;
  currentKey: string;

  setColor: (color: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setStrokeStyle: (strokeStyle: 'stroke' | 'fill') => void;
  setFileName: (fileName: string) => void;
  setSnapshotUri: (snapshotUri: string) => void;

  startPath: (x: number, y: number) => void;
  addToPath: (x: number, y: number) => void;
  endPath: () => void;
  addPath: (x: PathType) => void;

  undo: () => void;
  redo: () => void;
  clear: () => void;

  saveDrawing: () => Promise<void>;
  deleteDrawing: (timeStamp: string) => Promise<void>;
  loadDrawing: () => Promise<void>;
};
