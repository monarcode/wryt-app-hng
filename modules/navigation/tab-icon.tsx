import CanvasActive from '~/assets/icons/navigation/canvas-active.svg';
import CanvasInactive from '~/assets/icons/navigation/canvas-inactive.svg';
import SavedActive from '~/assets/icons/navigation/saved-active.svg';
import SavedInactive from '~/assets/icons/navigation/saved-inactive.svg';
import { View } from '~/components/shared';

const TabIcon = ({ route, isFocused }: Props) => {
  const renderIcon = (route: string, isFocused: boolean) => {
    const size = 28;

    switch (route) {
      case 'index':
        return isFocused ? (
          <CanvasActive width={size} height={size} />
        ) : (
          <CanvasInactive width={size} height={size} />
        );
      case 'saved':
        return isFocused ? (
          <SavedActive width={size} height={size} />
        ) : (
          <SavedInactive width={size} height={size} />
        );
      default:
        break;
    }
  };

  return (
    <View
      style={{
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {renderIcon(route, isFocused)}
    </View>
  );
};

export default TabIcon;

interface Props {
  route: string;
  isFocused: boolean;
}
