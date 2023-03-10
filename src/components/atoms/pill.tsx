import Link from 'next/link';

interface PillProps {
  className?: string;
  href?: string;
  children: React.ReactNode;
  bg?: string;
  roundedStyle?: 'rounded-full' | 'rounded-md' | 'rounded-sm';
  textClassName?: string;
}

export const Pill = ({
  children,
  className = 'text-sm text-gray-700',
  href,
  roundedStyle = 'rounded-full',
  textClassName = 'text-white',
  ...props
}: PillProps) => {
  const renderChildren = () => {
    if (href) {
      return (
        <Link href={href}>
          <a className={textClassName}>{children}</a>
        </Link>
      );
    }
    return children;
  };

  return (
    <div className={`inline-flex items-center px-5 py-1 ${className} ${roundedStyle}`} {...props}>
      {renderChildren()}
    </div>
  );
};
