import { type ImageStyle } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';

import { CachedImage } from '@/components/ui/cached-image';
import { Radii, Spacing } from '@/constants/theme';

export type ThumbStripProps = {
  images: string[];
  size?: number;
  edgePadding?: number;
};

const rotations = ['-6deg', '4deg', '-3deg', '5deg', '-5deg'];
const translateY = [6, -2, 4, -1, 5];

export function ThumbStrip({
  images,
  size = 92,
  edgePadding = Spacing.three,
}: ThumbStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.list,
        {
          paddingHorizontal: edgePadding,
          paddingVertical: 12,
        },
      ]}
    >
      {images.map((uri, index) => {
        const cardStyle: ImageStyle = {
          width: size,
          height: size,
          marginLeft: index === 0 ? 0 : -12,
          zIndex: images.length - index,
          transform: [
            { rotate: rotations[index % rotations.length] },
            { translateY: translateY[index % translateY.length] },
          ],
        };

        return (
          <CachedImage
            key={uri}
            uri={uri}
            radius={Radii.lg}
            recyclingKey={uri}
            decorative
            style={[styles.image, cardStyle]}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: 'center',
  },

  image: {
    borderWidth: 2,
    borderColor: '#fff',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },
});