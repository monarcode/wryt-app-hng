import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      isOnboardingCompleted: false,
      setOnboardingCompleted: (isCompleted: boolean) => set({ isOnboardingCompleted: isCompleted }),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface OnboardingStore {
  isOnboardingCompleted: boolean;
  setOnboardingCompleted: (isCompleted: boolean) => void;
}

export default useOnboardingStore;
