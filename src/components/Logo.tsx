interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | number;
    variant?: 'light' | 'dark';
    className?: string;
    style?: React.CSSProperties;
}

const sizeMap = {
    sm: 40,
    md: 60,
    lg: 100,
};

const Logo = ({ size = 'md', variant = 'light', className, style }: LogoProps) => {
    const height = typeof size === 'number' ? size : sizeMap[size];

    return (
        <img
            src="/images/multilimp-logo.svg"
            alt="Multilimp Logo"
            className={className}
            style={{
                height,
                filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
                ...style,
            }}
        />
    );
};

export default Logo;
