import type { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from '@/components/arc/button/button.module.css';

/**
 * A real link that looks like Arc's Button (Arc's Button only renders
 * <button>). Uses Arc's own button styles; `accent` gives the green primary.
 */
interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export function LinkButton({ variant = 'secondary', size = 'md', icon, className, children, ...props }: LinkButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], variant === 'primary' ? 'button-accent' : '', 'link-button', className]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={classes} {...props}>
      {icon}
      {children}
    </a>
  );
}
