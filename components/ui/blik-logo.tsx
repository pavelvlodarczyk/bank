import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface BlikLogoProps {
  size?: number;
  color?: string;
}

export function BlikLogo({ size = 24, color = '#002124' }: BlikLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 147.4 147.4">
      <Circle cx="87.9" cy="43.8" r="12.7" fill={color} />
      <Path 
        d="M73.7,62.4c-4.4,0-8.8,1.1-12.7,3.2V35.2H46.8v54.2c0,14.9,12,26.9,26.9,26.9c14.9,0,26.9-12,26.9-26.9   C100.6,74.5,88.6,62.4,73.7,62.4C73.7,62.4,73.7,62.4,73.7,62.4z M73.7,102.3c-7.2,0-13-5.8-13-13c0-7.2,5.8-13,13-13   c7.2,0,13,5.8,13,13C86.7,96.5,80.9,102.3,73.7,102.3C73.7,102.3,73.7,102.3,73.7,102.3z" 
        fill={color}
      />
    </Svg>
  );
}