import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Navbar } from '@/components/ui/navbar';
import { Colors } from '@/constants/theme';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TradingSignal } from '@/services/aiService';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResultsScreen() {
  const colorScheme = useColorScheme();
  const { analysis, isLoading } = useAnalysis();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getActionColor = (action: TradingSignal['action']) => {
    switch (action) {
      case 'BUY_LONG': return '#4CAF50';
      case 'BUY_SHORT': return '#FF9800';
      case 'SELL': return '#F44336';
      case 'HOLD': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getRiskColor = (risk: TradingSignal['riskLevel']) => {
    switch (risk) {
      case 'LOW': return '#4CAF50';
      case 'MEDIUM': return '#FF9800';
      case 'HIGH': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Navbar activeTab="results" onTabChange={(tab) => {
          console.log('Results (Loading): Tab change requested:', tab);
          if (tab === 'trading') {
            console.log('Results (Loading): Navigating to trading');
            router.push('/(tabs)/trading');
          } else if (tab === 'history') {
            console.log('Results (Loading): Navigating to history');
            router.push('/(tabs)/history');
          }
        }} />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Analyzing chart...</ThemedText>
        </ThemedView>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Navbar activeTab="results" onTabChange={(tab) => {
          console.log('Results (No Analysis): Tab change requested:', tab);
          if (tab === 'trading') {
            console.log('Results (No Analysis): Navigating to trading');
            router.push('/(tabs)/trading');
          } else if (tab === 'history') {
            console.log('Results (No Analysis): Navigating to history');
            router.push('/(tabs)/history');
          }
        }} />
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="title" style={styles.emptyTitle}>
            No Analysis Available
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Upload a chart and run analysis to see results here.
          </ThemedText>
        </ThemedView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Navbar activeTab="results" onTabChange={(tab) => {
        console.log('Results (With Analysis): Tab change requested:', tab);
        if (tab === 'trading') {
          console.log('Results (With Analysis): Navigating to trading');
          router.push('/(tabs)/trading');
        } else if (tab === 'history') {
          console.log('Results (With Analysis): Navigating to history');
          router.push('/(tabs)/history');
        }
      }} />
      <ScrollView style={[styles.scrollContainer, { paddingBottom: insets.bottom }]}>
        <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            AI Analysis Results
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Trading recommendation based on chart analysis
          </ThemedText>
        </ThemedView>

        {/* Trading Signal */}
        <View style={[styles.signalCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
        }]}>
          <View style={styles.signalHeader}>
            <ThemedText type="defaultSemiBold" style={styles.signalTitle}>
              Trading Signal
            </ThemedText>
            <View
              style={[
                styles.actionBadge,
                { backgroundColor: getActionColor(analysis.signal.action) }
              ]}
            >
              <ThemedText style={styles.actionText}>
                {analysis.signal.action.replace('_', ' ')}
              </ThemedText>
            </View>
          </View>

          <View style={styles.confidenceContainer}>
            <ThemedText style={styles.confidenceLabel}>Confidence:</ThemedText>
            <View style={[styles.confidenceBar, {
              backgroundColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
            }]}>
              <View
                style={[
                  styles.confidenceFill,
                  {
                    width: `${analysis.signal.confidence}%`,
                    backgroundColor: getActionColor(analysis.signal.action),
                  }
                ]}
              />
            </View>
            <ThemedText style={styles.confidenceValue}>
              {analysis.signal.confidence}%
            </ThemedText>
          </View>

          <View style={styles.riskContainer}>
            <ThemedText style={styles.riskLabel}>Risk Level:</ThemedText>
            <View
              style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(analysis.signal.riskLevel) }
              ]}
            >
              <ThemedText style={styles.riskText}>
                {analysis.signal.riskLevel}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.reasoning}>
            {analysis.signal.reasoning}
          </ThemedText>
        </View>

        {/* Market Analysis */}
        <View style={[styles.analysisCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
        }]}>
          <ThemedText type="defaultSemiBold" style={styles.analysisTitle}>
            Market Condition
          </ThemedText>
          <ThemedText style={styles.analysisText}>
            {analysis.marketCondition}
          </ThemedText>
        </View>

        <View style={[styles.analysisCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
        }]}>
          <ThemedText type="defaultSemiBold" style={styles.analysisTitle}>
            Support & Resistance
          </ThemedText>
          <ThemedText style={styles.analysisText}>
            {analysis.supportResistance}
          </ThemedText>
        </View>

        <View style={[styles.analysisCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
        }]}>
          <ThemedText type="defaultSemiBold" style={styles.analysisTitle}>
            Trend Analysis
          </ThemedText>
          <ThemedText style={styles.analysisText}>
            {analysis.trendAnalysis}
          </ThemedText>
        </View>

        <View style={[styles.analysisCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
        }]}>
          <ThemedText type="defaultSemiBold" style={styles.analysisTitle}>
            Volume Analysis
          </ThemedText>
          <ThemedText style={styles.analysisText}>
            {analysis.volumeAnalysis}
          </ThemedText>
        </View>

        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFF3CD',
          borderColor: colorScheme === 'dark' ? '#333333' : '#FFEAA7'
        }]}>
          <ThemedText style={[styles.disclaimerText, {
            color: colorScheme === 'dark' ? '#FFA500' : '#856404'
          }]}>
            ⚠️ This analysis is for educational purposes only. Always do your own research and consider your risk tolerance before making any trading decisions.
          </ThemedText>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
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
  signalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  signalTitle: {
    fontSize: 18,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  reasoning: {
    fontSize: 14,
    lineHeight: 20,
  },
  analysisCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  analysisTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimerCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
