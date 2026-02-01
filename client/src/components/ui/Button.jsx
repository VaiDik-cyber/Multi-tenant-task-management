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
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            color: 'white',
            boxShadow: '0 4px 15px var(--primary-glow)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--glass-border)',
        },
        danger: {
            background: 'var(--danger)',
            color: 'white',
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px var(--primary-glow)' }}
            whileTap={{ scale: 0.95 }}
            style={{ ...baseStyles, ...variants[variant] }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
