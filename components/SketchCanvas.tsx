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

export const SketchCanvas: React.FC<SketchCanvasProps> = ({ containerStyle, onSaveSnapshot }) => {
  const [paths, setPaths] = useState<SkPath[]>([]);
  const currentPath = useRef<SkPath | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const canvasRef = useCanvasRef();

  const { paths: storePaths, addPath, color, strokeWidth } = useSketchPadStore();

  // Sync local paths with store paths
  useEffect(() => {
    setPaths(storePaths.map((p) => p.path));
  }, [storePaths]);

  const midPointBtw = useCallback((p1: Point, p2: Point) => {
    return {
      x: p1.x + (p2.x - p1.x) / 2,
      y: p1.y + (p2.y - p1.y) / 2,
    };
  }, []);

  const createSmoothPath = useMemo(
    () =>
      (points: Point[]): SkPath => {
        const path = Skia.Path.Make();
        if (points.length < 2) return path;

        path.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const midPoint = midPointBtw(p1, p2);
          path.quadTo(p1.x, p1.y, midPoint.x, midPoint.y);
        }

        const lastPoint = points[points.length - 1];
        path.lineTo(lastPoint.x, lastPoint.y);

        return path;
      },
    [midPointBtw]
  );

  const takeSnapshot = async () => {
    if (canvasRef.current) {
      const snapshot = await canvasRef.current.makeImageSnapshot();
      const uri = snapshot.encodeToBase64();
      onSaveSnapshot(uri);
    }
  };

  const touchHandler = useTouchHandler({
    onStart: ({ x, y }: TouchInfo) => {
      pointsRef.current = [{ x, y }];
      currentPath.current = createSmoothPath(pointsRef.current);
      setPaths((prev) => [...prev, currentPath.current!]);
    },
    onActive: ({ x, y }: TouchInfo) => {
      if (!currentPath.current) return;
      pointsRef.current.push({ x, y });
      currentPath.current = createSmoothPath(pointsRef.current);
      setPaths((prev) => [...prev.slice(0, -1), currentPath.current!]);
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
          path={path}
          strokeWidth={strokeWidth}
          color={color}
          style="stroke"
          strokeCap="round"
          strokeJoin="round"
        />
      ))}
    </Canvas>
  );
};
