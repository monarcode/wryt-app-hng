import { SkPath, Skia } from '@shopify/react-native-skia';
import { Point } from '~/types/store';

export const midPointBtw = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
};

export const createSmoothPath = (points: Point[]): SkPath => {
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
};
