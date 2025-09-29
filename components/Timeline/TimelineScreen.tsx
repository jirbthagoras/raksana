import Timeline from './Timeline';
import { Colors } from '@/constants';
import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

interface TimelineScreenProps {
  activityData?: { data: any };
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  profileHeader?: React.ReactNode;
  tabNavigation?: React.ReactNode;
}

export default function TimelineScreen({ 
  activityData, 
  isLoading = false, 
  onRefresh,
  isRefreshing = false,
  profileHeader,
  tabNavigation
}: TimelineScreenProps) {
  const [isMapInteracting, setIsMapInteracting] = useState(false);

  const handleMapInteractionChange = (interacting: boolean) => {
    console.log('TimelineScreen: Map interaction changed to:', interacting);
    setIsMapInteracting(interacting);
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={styles.container}
      scrollEnabled={!isMapInteracting}
      nestedScrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={true}
      contentContainerStyle={styles.contentContainer}
      scrollEventThrottle={16}
      bounces={!isMapInteracting}
      alwaysBounceVertical={!isMapInteracting}
      directionalLockEnabled={true}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Profile Header */}
      {profileHeader}
      
      {/* Tab Navigation */}
      {tabNavigation}
      
      {/* Timeline Component */}
      <Timeline 
        activityData={activityData}
        isLoading={isLoading}
        onMapInteractionChange={handleMapInteractionChange}
      />
      
      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});
