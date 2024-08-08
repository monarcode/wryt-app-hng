import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
interface RecentColorProps {
  color: string;
  //   active: boolean;
  //   onPress: () => void;
}
export default function RecentColor({ color }: RecentColorProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.colorStyle,
        {
          backgroundColor: color,
        },
      ]}
    />
  );
}
const styles = StyleSheet.create({
  colorStyle: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
