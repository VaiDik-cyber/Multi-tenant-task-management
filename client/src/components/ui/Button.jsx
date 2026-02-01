import { motion } from 'framer-motion';
import clsx from 'clsx';


const Button = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = {
        padding: '10px 20px', // More compact
        borderRadius: '8px', // Tighter radius
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '500', // Slightly lighter weight
        fontFamily: 'var(--font-display)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother transition
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    };

    const variants = {
        primary: {
            background: 'var(--primary)',
            color: 'white',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Subtle shadow
            border: '1px solid transparent',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid transparent', // Changed to transparent for cleaner look
        },
        danger: {
            background: '#fee2e2', // Light red background
            color: '#ef4444', // Red text
            border: '1px solid #fecaca',
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
