import { motion } from 'framer-motion';
import clsx from 'clsx';


const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: 'var(--font-display)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
    };

    const variants = {
        primary: {
            background: 'var(--primary)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)', // Colored shadow
            border: '1px solid var(--primary)', // Ensure crisp edges
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
        },
        danger: {
            background: 'var(--danger)',
            color: 'white',
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01, filter: 'brightness(1.05)' }}
            whileTap={{ scale: 0.98 }}
            style={{ ...baseStyles, ...variants[variant] }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
