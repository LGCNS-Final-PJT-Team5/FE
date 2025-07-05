import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import React, {Dispatch, SetStateAction} from 'react';
import {StyleSheet, View} from 'react-native';

type DropdownProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  items: ItemType<string>[];
  setItems: Dispatch<SetStateAction<ItemType<string>[]>>;
  value: string;
  setValues: Dispatch<SetStateAction<string>>;
};

export const RegisterDropdown = ( { open, setOpen, items, setItems, value, setValues} : DropdownProps ) => {
  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValues}
        setItems={setItems}
        placeholder="선택"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <View style={styles.charCount}/>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 20,
    borderColor: '#D9D9D9',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 24,
    fontSize: 24,
    color: '#000',
  },
  dropdownContainer: {
    borderColor: '#D9D9D9',
    marginTop: 20,
    width: 320,
    height: 200,
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#C7C7CD',
    marginTop: 10,
  },
});
