import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DropdownProps {
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
}

export function Dropdown({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options',
  multiple = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options.filter(option =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const toggleOption = (option: string) => {
    if (multiple) {
      if (selectedValues.includes(option)) {
        onSelectionChange(selectedValues.filter(item => item !== option));
      } else {
        onSelectionChange([...selectedValues, option]);
      }
    } else {
      onSelectionChange([option]);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            borderColor: Colors[colorScheme ?? 'light'].icon,
          }
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <ThemedText style={styles.dropdownText}>
          {getDisplayText()}
        </ThemedText>
        <ThemedText style={styles.arrow}>
          {isOpen ? '▲' : '▼'}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            style={[
              styles.dropdownList,
              {
                backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                borderColor: Colors[colorScheme ?? 'light'].icon,
              }
            ]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, {
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].icon,
                }]}
                placeholder="Search indicators..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            {selectedValues.length > 0 && (
              <TouchableOpacity
                style={[styles.optionItem, styles.clearButton]}
                onPress={() => onSelectionChange([])}
                activeOpacity={0.7}
              >
                <ThemedText style={[styles.optionText, styles.clearText]}>
                  Clear All
                </ThemedText>
              </TouchableOpacity>
            )}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: selectedValues.includes(item)
                        ? Colors[colorScheme ?? 'light'].tint
                        : 'transparent',
                    }
                  ]}
                  onPress={() => toggleOption(item)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      {
                        color: selectedValues.includes(item)
                          ? '#FFFFFF'
                          : Colors[colorScheme ?? 'light'].text,
                      }
                    ]}
                  >
                    {item}
                  </ThemedText>
                  {selectedValues.includes(item) && (
                    <ThemedText style={styles.checkmark}>✓</ThemedText>
                  )}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownList: {
    maxHeight: 400,
    width: '100%',
    maxWidth: 350,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 56,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 0, 0, 0.2)',
  },
  clearText: {
    color: '#FF4444',
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
});
