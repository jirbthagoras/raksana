import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
     Dimensions,
     Image,
     Modal,
     StatusBar,
     StyleSheet,
     TouchableOpacity,
     View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface FullscreenImageModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

const FullscreenImageModal: React.FC<FullscreenImageModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.9)" barStyle="light-content" />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome5 name="times" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Fullscreen Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    marginTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
});

export default FullscreenImageModal;
