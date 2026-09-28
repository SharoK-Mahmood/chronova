import Svg, { Circle, Path, Rect } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

const strokeProps = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeIcon({ size = 22, color = "#111111" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 10.5L12 3l9 7.5" stroke={color} {...strokeProps} />
      <Path d="M5 9.5V20h14V9.5" stroke={color} {...strokeProps} />
    </Svg>
  );
}

export function CategoriesIcon({ size = 22, color = "#111111" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} {...strokeProps} />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} {...strokeProps} />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} {...strokeProps} />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} {...strokeProps} />
    </Svg>
  );
}

export function WishlistIcon({ size = 22, color = "#111111" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 20.5l-1.45-1.32C5.4 14.36 2 11.28 2 7.5A4.5 4.5 0 0 1 6.5 3c1.74 0 3.41.81 4.5 2.09A6.32 6.32 0 0 1 15.5 3 4.5 4.5 0 0 1 20 7.5c0 3.78-3.4 6.86-8.55 11.68L12 20.5z"
        stroke={color}
        {...strokeProps}
      />
    </Svg>
  );
}

export function CartIcon({ size = 22, color = "#111111" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 6h15l-1.5 9h-12L6 6z" stroke={color} {...strokeProps} />
      <Path d="M6 6L5 3H2" stroke={color} {...strokeProps} />
      <Circle cx="9" cy="20" r="1" fill={color} stroke="none" />
      <Circle cx="18" cy="20" r="1" fill={color} stroke="none" />
    </Svg>
  );
}

export function AccountIcon({ size = 22, color = "#111111" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="8" r="4" stroke={color} {...strokeProps} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} {...strokeProps} />
    </Svg>
  );
}

export function MenuIcon({ size = 24, color = "#6B6B6B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7h16M4 12h16M4 17h16" stroke={color} {...strokeProps} />
    </Svg>
  );
}

export function SearchIcon({ size = 18, color = "#6B6B6B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="11" cy="11" r="7" stroke={color} {...strokeProps} />
      <Path d="M20 20l-3-3" stroke={color} {...strokeProps} />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = "#6B6B6B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} {...strokeProps} />
    </Svg>
  );
}
