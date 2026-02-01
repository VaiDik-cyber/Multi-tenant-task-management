import { motion } from 'framer-motion';

const Card = ({ children, delay = 0, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{
                background: 'var(--bg-card)',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
