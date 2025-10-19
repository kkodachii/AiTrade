import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Navbar } from '@/components/ui/navbar';
import { Colors } from '@/constants/theme';
import { useHistory } from '@/contexts/HistoryContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TradingSignal } from '@/services/aiService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const { history, removeFromHistory, clearHistory, isLoading } = useHistory();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const getActionColor = (action: TradingSignal['action']) => {
    switch (action) {
      case 'BUY_LONG': return '#4CAF50';
      case 'BUY_SHORT': return '#FF9800';
      case 'SELL': return '#F44336';
      case 'HOLD': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };


  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Delete Analysis',
      'Are you sure you want to delete this analysis?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeFromHistory(id)
        }
      ]
    );
  };

  const handleClearAll = () => {
    setShowClearModal(true);
  };

  const confirmClearAll = () => {
    clearHistory();
    setShowClearModal(false);
  };

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.historyItem, {
        backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
      }]}
      onPress={() => setSelectedHistoryItem(item)}
    >
      <View style={styles.historyHeader}>
        <View style={styles.historyInfo}>
          <ThemedText style={styles.historyDate}>
            {formatDate(item.timestamp)}
          </ThemedText>
          <ThemedText style={styles.historyTimeframe}>
            {item.timeframe} • {item.indicators.join(', ')}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteItem(item.id);
          }}
        >
          <ThemedText style={styles.deleteButtonText}>×</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.historyContent}>
        <Image
          source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
          style={styles.historyImage}
          resizeMode="cover"
        />
        
        <View style={styles.historyAnalysis}>
          <View style={styles.signalRow}>
            <View
              style={[
                styles.actionBadge,
                { backgroundColor: getActionColor(item.analysis.signal.action) }
              ]}
            >
              <ThemedText style={styles.actionText}>
                {item.analysis.signal.action.replace('_', ' ')}
              </ThemedText>
            </View>
            <ThemedText style={styles.confidenceText}>
              {item.analysis.signal.confidence}%
            </ThemedText>
          </View>
          
          <ThemedText style={styles.reasoningText} numberOfLines={2}>
            {item.analysis.signal.reasoning}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Navbar activeTab="history" onTabChange={(tab) => {
          console.log('History (Loading): Tab change requested:', tab);
          if (tab === 'trading') {
            console.log('History (Loading): Navigating to trading');
            router.push('/(tabs)/trading');
          } else if (tab === 'results') {
            console.log('History (Loading): Navigating to results');
            router.push('/(tabs)/results');
          }
        }} />
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Loading history...</ThemedText>
        </ThemedView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Navbar activeTab="history" onTabChange={(tab) => {
        console.log('History (Main): Tab change requested:', tab);
        if (tab === 'trading') {
          console.log('History (Main): Navigating to trading');
          router.push('/(tabs)/trading');
        } else if (tab === 'results') {
          console.log('History (Main): Navigating to results');
          router.push('/(tabs)/results');
        }
      }} />
      
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Analysis History
        </ThemedText>
        {history.length > 0 && (
          <TouchableOpacity
            style={[styles.clearAllButton, {
              backgroundColor: colorScheme === 'dark' ? '#FF4444' : '#FF6B6B'
            }]}
            onPress={handleClearAll}
          >
            <ThemedText style={styles.clearAllButtonText}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="title" style={styles.emptyTitle}>
            No History Yet
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Your analysis history will appear here after you run your first analysis.
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: insets.bottom }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear All Confirmation Modal */}
      <Modal
        visible={showClearModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
          }]}>
            <ThemedText type="title" style={styles.modalTitle}>
              Clear All History
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Are you sure you want to delete all analysis history? This action cannot be undone.
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowClearModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmClearAll}
              >
                <ThemedText style={styles.confirmButtonText}>Clear All</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detailed History Item Modal */}
      <Modal
        visible={selectedHistoryItem !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedHistoryItem(null)}
      >
        <View style={styles.detailModalOverlay}>
          <View style={[styles.detailModalContent, {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0'
          }]}>
            {selectedHistoryItem && (
              <>
                <View style={styles.detailModalHeader}>
                  <ThemedText type="title" style={styles.detailModalTitle}>
                    Analysis Details
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedHistoryItem(null)}
                  >
                    <ThemedText style={styles.closeButtonText}>×</ThemedText>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailModalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.detailInfo}>
                    <ThemedText style={styles.detailDate}>
                      {formatDate(selectedHistoryItem.timestamp)}
                    </ThemedText>
                    <ThemedText style={styles.detailTimeframe}>
                      {selectedHistoryItem.timeframe} • {selectedHistoryItem.indicators.join(', ')}
                    </ThemedText>
                  </View>

                  {selectedHistoryItem.imageBase64 && (
                    <Image
                      source={{ uri: `data:image/png;base64,${selectedHistoryItem.imageBase64}` }}
                      style={styles.detailImage}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.detailAnalysis}>
                    <View style={styles.detailSignalRow}>
                      <View
                        style={[
                          styles.detailActionBadge,
                          { backgroundColor: getActionColor(selectedHistoryItem.analysis.signal.action) }
                        ]}
                      >
                        <ThemedText style={styles.detailActionText}>
                          {selectedHistoryItem.analysis.signal.action.replace('_', ' ')}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.detailConfidenceText}>
                        {selectedHistoryItem.analysis.signal.confidence}%
                      </ThemedText>
                    </View>
                    
                    <ThemedText style={styles.detailReasoningText}>
                      {selectedHistoryItem.analysis.signal.reasoning}
                    </ThemedText>

                    {/* Additional Analysis Details */}
                    <View style={styles.detailDetailsContainer}>
                      <View style={styles.detailDetailRow}>
                        <ThemedText style={styles.detailDetailLabel}>Market Condition:</ThemedText>
                        <ThemedText style={styles.detailDetailValue}>{selectedHistoryItem.analysis.marketCondition}</ThemedText>
                      </View>
                      
                      <View style={styles.detailDetailRow}>
                        <ThemedText style={styles.detailDetailLabel}>Support/Resistance:</ThemedText>
                        <ThemedText style={styles.detailDetailValue}>{selectedHistoryItem.analysis.supportResistance}</ThemedText>
                      </View>
                      
                      <View style={styles.detailDetailRow}>
                        <ThemedText style={styles.detailDetailLabel}>Trend Analysis:</ThemedText>
                        <ThemedText style={styles.detailDetailValue}>{selectedHistoryItem.analysis.trendAnalysis}</ThemedText>
                      </View>
                      
                      <View style={styles.detailDetailRow}>
                        <ThemedText style={styles.detailDetailLabel}>Volume Analysis:</ThemedText>
                        <ThemedText style={styles.detailDetailValue}>{selectedHistoryItem.analysis.volumeAnalysis}</ThemedText>
                      </View>
                      
                      <View style={styles.detailDetailRow}>
                        <ThemedText style={styles.detailDetailLabel}>Risk Level:</ThemedText>
                        <View style={[
                          styles.detailRiskBadge,
                          { backgroundColor: getActionColor(selectedHistoryItem.analysis.signal.riskLevel === 'LOW' ? 'BUY_LONG' : 
                            selectedHistoryItem.analysis.signal.riskLevel === 'MEDIUM' ? 'BUY_SHORT' : 'SELL') }
                        ]}>
                          <ThemedText style={styles.detailRiskText}>{selectedHistoryItem.analysis.signal.riskLevel}</ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyTimeframe: {
    fontSize: 12,
    opacity: 0.7,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyContent: {
    flexDirection: 'row',
    padding: 16,
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  historyAnalysis: {
    flex: 1,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reasoningText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
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
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  confirmButton: {
    backgroundColor: '#FF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Detailed Modal Styles
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailModalContent: {
    width: '100%',
    maxHeight: '90%',
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
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailModalBody: {
    maxHeight: '80%',
  },
  detailInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  detailDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailTimeframe: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailImage: {
    width: '100%',
    height: 200,
    margin: 20,
    borderRadius: 12,
  },
  detailAnalysis: {
    padding: 20,
  },
  detailSignalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailActionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  detailActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailConfidenceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailReasoningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.9,
  },
  detailDetailsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  detailDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  detailDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    flex: 1,
    marginRight: 12,
  },
  detailDetailValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
    lineHeight: 18,
  },
  detailRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailRiskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
