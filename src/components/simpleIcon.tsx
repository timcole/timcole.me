import { type SVGAttributes } from 'react';
import { type SimpleIcon as SI } from 'simple-icons';

type Props = {
  icon: SI;
  color?: string;
  size?: string | number;
  title?: string;
  ref?: React.Ref<SVGSVGElement>;
};

const SimpleIcon = ({
  icon,
  color = 'currentColor',
  size = 24,
  title = icon?.title,
  ref,
  ...others
}: SVGAttributes<SVGSVGElement> & Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 24 24"
    ref={ref}
    {...others}
  >
    {title && <title>{title}</title>}
    <path d={icon?.path} />
  </svg>
);

export default SimpleIcon;
