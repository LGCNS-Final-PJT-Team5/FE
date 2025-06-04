import React from 'react';

export const SafeAreaProvider = ({ children }) => children;
export const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 });
export const SafeAreaView = ({ children }) => children;
export const SafeAreaContext = {
  Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 })
};
export default { SafeAreaProvider, useSafeAreaInsets, SafeAreaView, SafeAreaContext };