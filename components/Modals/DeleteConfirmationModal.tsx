import { Colors, Fonts } from '@/constants';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  userName?: string;
  description?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Hapus Memory",
  message,
  userName,
  description,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      supportedOrientations={['portrait']}
      presentationStyle="overFullScreen"
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome5 
              name="exclamation-triangle" 
              size={40} 
              color={Colors.error} 
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* User Info */}
          {userName && (
            <View style={styles.userInfoContainer}>
              <View style={styles.userAvatar}>
                <FontAwesome5 name="user" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          )}
          
          {/* Description Preview */}
          {description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Memory:</Text>
              <Text style={styles.description} numberOfLines={2}>
                "{description.length > 80 ? description.substring(0, 80) + '...' : description}"
              </Text>
            </View>
          )}
          
          {/* Warning Message */}
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.warningContainer}>
            <FontAwesome5 name="info-circle" size={14} color={Colors.error} />
            <Text style={styles.warningText}>Tindakan ini tidak dapat dibatalkan!</Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton, isLoading && styles.deleteButtonDisabled]} 
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.onError} />
                  <Text style={styles.deleteButtonText}>Menghapus...</Text>
                </View>
              ) : (
                <>
                  <FontAwesome5 name="trash" size={14} color={Colors.onError} />
                  <Text style={styles.deleteButtonText}>Hapus</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: width - 40,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.display.bold,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryContainer + '30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  descriptionContainer: {
    width: '100%',
    backgroundColor: Colors.surfaceVariant + '40',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionLabel: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  description: {
    fontFamily: Fonts.text.regular,
    fontSize: 14,
    color: Colors.onSurface,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  message: {
    fontFamily: Fonts.text.regular,
    fontSize: 16,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer + '40',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
    gap: 6,
  },
  warningText: {
    fontFamily: Fonts.text.bold,
    fontSize: 12,
    color: Colors.error,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1,
    borderColor: Colors.outline + '40',
  },
  cancelButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    gap: 8,
  },
  deleteButtonDisabled: {
    backgroundColor: Colors.error + '70',
  },
  deleteButtonText: {
    fontFamily: Fonts.text.bold,
    fontSize: 14,
    color: Colors.onError,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
