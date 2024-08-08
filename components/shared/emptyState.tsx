import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import EraserIcon from '~/assets/icons/empty-folder.svg';
import { theme } from '~/theme';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <EraserIcon />

      <View style={styles.textContainer}>
        <Text style={styles.noSavedSketchtext}>No Saved Sketches</Text>
        <Text style={styles.description}>
          Your collection is empty. Start saving sketches you love to see them here.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  noSavedSketchtext: {
    color: theme.colors.dark,
    fontSize: theme.fontSizes.xxl,
    fontFamily: theme.fontFamily.semiBold,
  },
  description: {
    maxWidth: 300,
    color: theme.colors.neutral[200],
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fontFamily.medium,
  },
});

export default EmptyState;
