import React from 'react';

/**
 * Badge component for small highlights.
 * Usage: <Badge>New</Badge> or <Badge color="blue">Info</Badge>
 */
function Badge({ children, color = 'accent' }) {
    const styles = {
        accent: { backgroundColor: 'var(--color-accent-500)', color: '#fff' },
        blue: { backgroundColor: 'var(--color-brand-600)', color: '#fff' },
        gray: { backgroundColor: 'var(--color-slate-500)', color: '#fff' },
    };
    const style = styles[color] || styles.accent;
    return (
        <span
            style={style}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm select-none"
        >
            {children}
        </span>
    );
}

export default Badge;
