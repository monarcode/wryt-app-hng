import {
  Canvas,
  Path,
  Skia,
  SkPath,
  TouchInfo,
  useTouchHandler,
  useCanvasRef,
} from '@shopify/react-native-skia';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import useSketchPadStore from '~/store/store';

interface Point {
  x: number;
  y: number;
}

interface SketchCanvasProps {
  containerStyle: any;
  color?: string;
  strokeWidth?: number;
  onSaveSnapshot: (uri: string) => void;
}

export const SketchCanvas: React.FC<SketchCanvasProps> = ({
  containerStyle,
  color = 'black',
  strokeWidth = 4,
  onSaveSnapshot,
}) => {
  const [paths, setPaths] = useState<SkPath[]>([]);
  const currentPath = useRef<SkPath | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const canvasRef = useCanvasRef();

  const { paths: storePaths, addPath } = useSketchPadStore();

  // Sync local paths with store paths
  useEffect(() => {
    setPaths(storePaths.map((p) => p.path));
  }, [storePaths]);


  const takeSnapshot = async () => {
    if (canvasRef.current) {
      const snapshot = await canvasRef.current.makeImageSnapshot();
      const uri = snapshot.encodeToBase64();
      onSaveSnapshot(uri);
    }
  };

  const { addToPath, startPath, endPath, paths } = useSketchPadStore((store) => store);
  
  const touchHandler = useTouchHandler({
    onStart: ({ x, y }: TouchInfo) => {
      startPath(x, y);
    },
    onActive: ({ x, y }: TouchInfo) => {
      addToPath(x, y);
    },
    onEnd: () => {
      if (currentPath.current) {
        addPath({ path: currentPath.current, color, strokeWidth, strokeStyle: 'stroke' });
      }
      pointsRef.current = [];
      currentPath.current = null;
      takeSnapshot();
    },
  });

  return (
    <Canvas ref={canvasRef} onTouch={touchHandler} style={containerStyle}>
      {paths.map((path, index) => (
        <Path
          key={index}
          path={path.path}
          strokeWidth={path.strokeWidth}
          color={path.color}
          style="stroke"
          strokeCap="round"
          strokeJoin="round"
        />
      ))}
    </Canvas>
  );
};
