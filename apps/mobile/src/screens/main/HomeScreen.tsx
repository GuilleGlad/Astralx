import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';

export const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Astralx!</Text>
        <Text style={styles.subtitle}>
          Hello {user?.firstName || user?.email} 👋
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About Astralx</Text>
        <Text style={styles.cardText}>
          Astralx connects vehicle owners with specialized workshops, making it
          easy to find automotive services for mechanics, body work, paint,
          electrical, and more.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Getting Started</Text>
        <Text style={styles.cardText}>
          {user?.role === 'client'
            ? '• Create service requests\n• Get quotes from workshops\n• Schedule appointments\n• Rate and review services'
            : '• Browse service requests\n• Send quotes to clients\n• Manage your schedule\n• Build your reputation'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Account</Text>
        <Text style={styles.cardText}>
          Role: {user?.role === 'client' ? 'Vehicle Owner' : 'Workshop'}
          {'\n'}
          Status: {user?.status === 'active' ? 'Active ✓' : user?.status}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.inverse,
  },
  card: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
});
