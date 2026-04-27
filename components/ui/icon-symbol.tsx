// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 */
const MAPPING = {
  // Navigation & General
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'magnifyingglass': 'search',
  'square.grid.2x2.fill': 'apps',
  'plus': 'add',
  
  // Auth & Profile
  'person.fill': 'person',
  'person.2.fill': 'people',
  'person.3.fill': 'group',
  'envelope.fill': 'email',
  'lock.fill': 'lock',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'phone.fill': 'phone',
  'camera.fill': 'photo-camera',
  'rectangle.portrait.and.arrow.right': 'logout',
  
  // Community Modules
  'calendar': 'event',
  'calendar.badge.exclamationmark': 'event-busy',
  'briefcase.fill': 'work',
  'bell.fill': 'notifications',
  'mappin.circle.fill': 'location-on',
  'mappin.and.ellipse': 'location-on',
  'heart.fill': 'favorite',
  'book.fill': 'menu-book',
  'building.2.fill': 'business',
  'map.fill': 'map',
  'photo.on.rectangle.angled': 'photo-library',
  'exclamationmark.bubble.fill': 'report',
  'chart.bar.fill': 'assessment',
  'questionmark.circle.fill': 'help',
  'info.circle.fill': 'info',
  'clock.fill': 'schedule',
  'line.3.horizontal.decrease.circle': 'filter-list',
  'indianrupeesign': 'currency-rupee',
  'person.fill.xmark': 'person-off',
  'newspaper.fill': 'newspaper',
  'bookmark': 'bookmark',
  'number': 'numbers',
} as Record<string, ComponentProps<typeof MaterialIcons>['name']>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
