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
import { theme } from '~/theme';

const StrokePicker = () => {
  // can use this programmatically to open/close the popover
  const popOverRef = useRef<PopoverPrimitive.PopoverTriggerRef>(null);

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
              <Pressable style={styles.stroke}>
                <StrokeFour />
              </Pressable>

              <Pressable style={styles.stroke}>
                <StrokeThree />
              </Pressable>

              <Pressable style={styles.stroke}>
                <StrokeTwo />
              </Pressable>

              <Pressable style={styles.stroke}>
                <StrokeOne />
              </Pressable>
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
  action: {
    backgroundColor: theme.colors.light,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
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
  },
});

export default StrokePicker;
