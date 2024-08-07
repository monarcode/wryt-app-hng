import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';

import CustomBottomNavigation from '~/modules/navigation/custom-bottom-nav';

const CustomBottomTabs = (props: BottomTabBarProps) => {
  return <CustomBottomNavigation {...props} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
      }}
      tabBar={CustomBottomTabs}
    />
  );
}
