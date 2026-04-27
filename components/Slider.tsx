import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
import Config from '../constants/Config';

const { width } = Dimensions.get('window');

interface SliderProps {
  data: any[];
}

export default function Slider({ data }: SliderProps) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <PagerView style={styles.pagerView} initialPage={0}>
        {data.map((item, index) => (
          <View key={index} style={styles.page}>
            <Image
              source={{ uri: Config.getImageUri(item.image) || '' }}
              style={styles.image}
              resizeMode="cover"
            />
            {item.title && (
              <View style={styles.captionContainer}>
                <Text style={styles.captionText}>{item.title}</Text>
              </View>
            )}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 40,
    height: 200,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(226, 136, 103, 0.9)', // Using primary color with alpha
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
