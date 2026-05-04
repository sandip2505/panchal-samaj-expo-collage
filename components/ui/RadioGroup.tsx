import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { IconSymbol } from './icon-symbol';

type Option = {
  label: string;
  value: string;
};

interface RadioGroupProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  colors: any;
}

export function RadioGroup({ label, options, value, onChange, colors }: RadioGroupProps) {
  return (
    <View style={s.container}>
      {label && <Text style={[s.label, { color: colors.text }]}>{label}</Text>}
      <View style={s.row}>
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                s.option,
                { borderColor: isSelected ? COLORS.primary : colors.border },
                isSelected && { backgroundColor: COLORS.primary + '10' }
              ]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
            >
              <View style={[
                s.radio,
                { borderColor: isSelected ? COLORS.primary : COLORS.gray }
              ]}>
                {isSelected && <View style={s.radioInner} />}
              </View>
              <Text style={[
                s.optLabel,
                { color: isSelected ? COLORS.primary : colors.text }
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
