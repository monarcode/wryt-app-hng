import { Pressable, PressableProps, StyleSheet } from 'react-native';

import { Text } from './text';

import { theme } from '~/theme';

const Button = ({ children, ...others }: ButtonProps) => {
  return (
    <Pressable style={style.container} {...others}>
      <Text style={style.text}>{children}</Text>
    </Pressable>
  );
};
export default Button;

const style = StyleSheet.create({
  container: {
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.light,
  },
});

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
}
