import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface AddCarModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (carNumber: string) => void;
}

const AddCarModal = ({visible, onClose, onSubmit}: AddCarModalProps) => {
  const [carNumber, setCarNumber] = useState('');

  const isValid = carNumber.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(carNumber.trim());
    setCarNumber('');
    onClose();
  };

  useEffect(() => {
    if (!visible) setCarNumber(''); // 모달 닫힐 때 입력 초기화
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>차량 번호 등록</Text>
          <TextInput
            style={styles.input}
            value={carNumber}
            onChangeText={setCarNumber}
            placeholder="차량 번호를 입력하세요"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isValid}
              style={[styles.confirm, !isValid && styles.confirmDisabled]}>
              <Text style={styles.buttonText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCarModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#999',
  },
  confirm: {
    flex: 1,
    backgroundColor: '#3B5BFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
