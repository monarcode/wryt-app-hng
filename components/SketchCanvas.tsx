import {
  Canvas,
  Path,
  Skia,
  SkPath,
  TouchInfo,
  useTouchHandler,
  useCanvasRef,
} from '@shopify/react-native-skia';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
  const canvasRef = useCanvasRef(); // Add a ref for the canvas


  const takeSnapshot = async () => {
    if (canvasRef.current) {
      const snapshot = await canvasRef.current.makeImageSnapshot();
      const uri = snapshot.encodeToBase64(); // Get the base64-encoded URI
      onSaveSnapshot(uri); // Pass the URI to the parent component
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
      endPath();
      takeSnapshot(); // Take a snapshot when the path ends
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
