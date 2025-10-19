import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Dropdown } from '@/components/ui/dropdown';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Navbar } from '@/components/ui/navbar';
import { Colors } from '@/constants/theme';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AIService from '@/services/aiService';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';


type Timeframe = 'SCALPING' | 'INTRADAY' | 'SWING' | 'POSITION';
type Indicator = 'RSI' | 'MACD' | 'Moving Average' | 'Bollinger Bands' | 'Stochastic' | 'Volume' | 'Support/Resistance' | 'Fibonacci' | 'Ichimoku' | 'Williams %R' | 'CCI' | 'ATR' | 'ADX' | 'Parabolic SAR' | 'OBV' | 'Money Flow Index' | 'Aroon' | 'TRIX' | 'Ultimate Oscillator' | 'Rate of Change';

const INDICATORS: Indicator[] = [
  'RSI',
  'MACD', 
  'Moving Average',
  'Bollinger Bands',
  'Stochastic',
  'Volume',
  'Support/Resistance',
  'Fibonacci',
  'Ichimoku',
  'Williams %R',
  'CCI',
  'ATR',
  'ADX',
  'Parabolic SAR',
  'OBV',
  'Money Flow Index',
  'Aroon',
  'TRIX',
  'Ultimate Oscillator',
  'Rate of Change'
];

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: 'Scalping (1-5 min)', value: 'SCALPING' },
  { label: 'Intraday (1-4 hours)', value: 'INTRADAY' },
  { label: 'Swing (1-7 days)', value: 'SWING' },
  { label: 'Position (weeks-months)', value: 'POSITION' }
];

export default function TradingScreen() {
  const colorScheme = useColorScheme();
  const { setAnalysis, isLoading, setIsLoading } = useAnalysis();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('INTRADAY');
  const [selectedIndicators, setSelectedIndicators] = useState<Indicator[]>(['RSI', 'MACD']);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload chart images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16], // Portrait aspect ratio
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].base64!);
      setAnalysis(null); // Clear previous analysis
    }
  };


  const analyzeChart = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select a chart image first.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting AI analysis...');
      console.log('Selected timeframe:', selectedTimeframe);
      console.log('Selected indicators:', selectedIndicators);
      console.log('Image base64 length:', selectedImage.length);
      
      const result = await AIService.analyzeChart(
        selectedImage,
        selectedTimeframe,
        selectedIndicators
      );
      
      console.log('AI analysis result:', result);
      setAnalysis(result);
      
      // Navigate to results after successful analysis
      setTimeout(() => {
        router.push('/(tabs)/results');
      }, 1000);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Analysis Failed', 'Failed to analyze the chart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Navbar activeTab="trading" onTabChange={(tab) => {
        if (tab === 'results') {
          router.push('/(tabs)/results');
        }
      }} />
      <ScrollView style={styles.scrollContainer}>
        <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI Trading Assistant
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Upload a chart image for AI analysis
          </ThemedText>
          <View style={[styles.warningBox, { 
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFF3CD',
            borderColor: colorScheme === 'dark' ? '#333333' : '#FFEAA7'
          }]}>
            <ThemedText style={[styles.warningText, {
              color: colorScheme === 'dark' ? '#FFA500' : '#856404'
            }]}>
              ⚠️ This is NOT a trading app. It&apos;s an AI assistant for educational purposes only.
            </ThemedText>
          </View>
        </ThemedView>


        {/* Image Upload */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Chart Image
          </ThemedText>
          <TouchableOpacity style={[styles.imageUploadButton, {
            borderColor: colorScheme === 'dark' ? '#333333' : '#CCCCCC',
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : 'transparent'
          }]} onPress={pickImage}>
            {selectedImage ? (
              <Image
                source={{ uri: `data:image/png;base64,${selectedImage}` }}
                style={styles.selectedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <IconSymbol name="paperplane.fill" size={48} color={Colors[colorScheme ?? 'light'].icon} />
                <ThemedText style={styles.uploadText}>Tap to upload chart</ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Timeframe Selection */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Trading Timeframe
          </ThemedText>
          <View style={styles.timeframeContainer}>
            {TIMEFRAMES.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.value}
                style={[
                  styles.timeframeButton,
                  {
                    backgroundColor: selectedTimeframe === timeframe.value
                      ? Colors[colorScheme ?? 'light'].tint
                      : colorScheme === 'dark' ? '#1A1A1A' : 'transparent',
                    borderColor: Colors[colorScheme ?? 'light'].icon,
                  }
                ]}
                onPress={() => setSelectedTimeframe(timeframe.value)}
              >
                <ThemedText
                  style={[
                    styles.timeframeText,
                    {
                      color: selectedTimeframe === timeframe.value
                        ? '#FFFFFF'
                        : Colors[colorScheme ?? 'light'].text,
                    }
                  ]}
                >
                  {timeframe.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Indicators Selection */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Technical Indicators
          </ThemedText>
          <Dropdown
            options={INDICATORS}
            selectedValues={selectedIndicators}
            onSelectionChange={setSelectedIndicators}
            placeholder="Select indicators"
            multiple={true}
          />
        </ThemedView>


        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            {
              backgroundColor: selectedImage ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon,
            }
          ]}
          onPress={analyzeChart}
          disabled={!selectedImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.analyzeButtonText}>
              Analyze Chart
            </ThemedText>
          )}
        </TouchableOpacity>

        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  warningBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  imageUploadButton: {
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    opacity: 0.7,
  },
  timeframeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeframeText: {
    fontSize: 14,
  },
  analyzeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
