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
  const canvasRef = useCanvasRef(); // Add a ref for the canvas

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
      const uri = snapshot.encodeToBase64(); // Get the base64-encoded URI
      onSaveSnapshot(uri); // Pass the URI to the parent component
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
      pointsRef.current = [];
      currentPath.current = null;
      takeSnapshot(); // Take a snapshot when the path ends
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
