import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;
    if (disabled || loading) return [baseStyle, styles.disabled];

    switch (variant) {
      case 'secondary':
        return [baseStyle, styles.secondary];
      case 'outline':
        return [baseStyle, styles.outline];
      default:
        return [baseStyle, styles.primary];
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = styles.text;
    if (disabled || loading) return [baseStyle, styles.textDisabled];

    switch (variant) {
      case 'outline':
        return [baseStyle, styles.textOutline];
      default:
        return [baseStyle, styles.textPrimary];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline'
              ? theme.colors.primary
              : theme.colors.text.inverse
          }
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  disabled: {
    backgroundColor: theme.colors.text.disabled,
  },
  text: {
    ...theme.typography.button,
  },
  textPrimary: {
    color: theme.colors.text.inverse,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.text.hint,
  },
});
