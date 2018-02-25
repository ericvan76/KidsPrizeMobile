import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { COLORS, ICON_SIZE } from 'src/constants';
import { TouchableItem } from './TouchableItem';

interface HeaderIconProps {
  name: string;
  onPress?(): void;
}

export const HeaderIcon: React.SFC<HeaderIconProps> = (props) => {
  return (
    <TouchableItem onPress={props.onPress}>
      <MaterialCommunityIcons name={props.name} size={ICON_SIZE} color={COLORS.white} />
    </TouchableItem>
  );
};

interface FooterIconProps {
  name: string;
  color?: string;
}

export const FooterIcon: React.SFC<FooterIconProps> = (props) => {
  return (
    <MaterialCommunityIcons name={props.name} size={ICON_SIZE} color={props.color} />
  );
};
