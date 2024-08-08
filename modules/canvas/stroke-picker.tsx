import * as PopoverPrimitive from '@rn-primitives/popover';
import { useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import StrokeWidth from '~/assets/icons/strokepicker-icon.svg';
import StrokeOne from '~/assets/icons/strokes/1.svg';
import StrokeTwo from '~/assets/icons/strokes/2.svg';
import StrokeThree from '~/assets/icons/strokes/3.svg';
import StrokeFour from '~/assets/icons/strokes/4.svg';
import { View } from '~/components/shared';
import useSketchPadStore from '~/store/store';
import { theme } from '~/theme';

const StrokePicker = () => {
  // can use this programmatically to open/close the popover
  const popOverRef = useRef<PopoverPrimitive.PopoverTriggerRef>(null);
  const { setStrokeWidth, strokeWidth } = useSketchPadStore((store) => store);
  const strokes = [StrokeFour, StrokeThree, StrokeTwo, StrokeOne];
  const handleBrushSize = (size: number) => {
    setStrokeWidth(size);
    // popOverRef.current && popOverRef.current?.close();
  };
  return (
    <View style={styles.container}>
      <PopoverPrimitive.Root ref={popOverRef}>
        <PopoverPrimitive.Trigger>
          <View style={styles.action}>
            <StrokeWidth />
          </View>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content side="top" sideOffset={10}>
            <Animated.View
              entering={FadeInDown.duration(200)}
              exiting={FadeOutDown.duration(200)}
              style={styles.popover}>
              {strokes.map((StrokeIcon, index) => {
                const size = strokes.length - 1 - index + 1 || 1;
                const isActive = strokeWidth === size;
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleBrushSize(size)}
                    style={[styles.stroke, isActive && styles.active]}>
                    <StrokeIcon width={30} height={30} />
                  </Pressable>
                );
              })}
            </Animated.View>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  active: {
    backgroundColor: '#ddd',
  },
  action: {
    backgroundColor: theme.colors.light,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    flexDirection: 'row',
  },
  popover: {
    backgroundColor: theme.colors.light,
    width: 60,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 50,
    rowGap: 16,
  },
  stroke: {
    transform: [{ scale: 0.8 }],
    padding: 10,
    borderRadius: 100,
  },
});

export default StrokePicker;
