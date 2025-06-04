import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

interface CustomModalProps {
  visible: boolean;
  title: string;
  content?: string[];
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isAlert?: boolean;
  contentElement?: React.ReactNode;
  onDismiss?: () => void;
  confirmDisabled?: boolean;
}

const CustomModal = ({
  visible,
  title,
  content,
  contentElement,
  onClose,
  onConfirm,
  confirmText = '확인',
  cancelText = '취소',
  isAlert = false,
  onDismiss,
  confirmDisabled,
}: CustomModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../../assets/modive_robot1.png')}
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
          {content?.map((line, idx) => (
            <Text key={idx} style={styles.content}>
              {line}
            </Text>
          ))}
          {contentElement && (
            <View style={{width: '100%', marginTop: 12}}>{contentElement}</View>
          )}
          <View style={styles.buttonGroup}>
            {!isAlert && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                isAlert && {width: '100%'},
                confirmDisabled && {backgroundColor: '#ccc'},
              ]}
              onPress={onConfirm || onClose}
              disabled={confirmDisabled}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#565656',
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B5BFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CustomModal;
