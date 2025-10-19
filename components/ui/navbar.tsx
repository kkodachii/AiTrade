import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface NavbarProps {
  activeTab: 'trading' | 'results';
  onTabChange: (tab: 'trading' | 'results') => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.navbar, {
      backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
      borderBottomColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
    }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: activeTab === 'trading' 
              ? Colors[colorScheme ?? 'light'].tint 
              : 'transparent',
            borderBottomColor: activeTab === 'trading' 
              ? Colors[colorScheme ?? 'light'].tint 
              : 'transparent'
          }
        ]}
        onPress={() => onTabChange('trading')}
      >
        <ThemedText style={[
          styles.tabText,
          {
            color: activeTab === 'trading' 
              ? '#FFFFFF' 
              : Colors[colorScheme ?? 'light'].text
          }
        ]}>
          Analyze
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: activeTab === 'results' 
              ? Colors[colorScheme ?? 'light'].tint 
              : 'transparent',
            borderBottomColor: activeTab === 'results' 
              ? Colors[colorScheme ?? 'light'].tint 
              : 'transparent'
          }
        ]}
        onPress={() => onTabChange('results')}
      >
        <ThemedText style={[
          styles.tabText,
          {
            color: activeTab === 'results' 
              ? '#FFFFFF' 
              : Colors[colorScheme ?? 'light'].text
          }
        ]}>
          Results
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
