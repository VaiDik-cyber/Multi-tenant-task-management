import { motion } from 'framer-motion';

const Card = ({ children, delay = 0, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{
                background: 'var(--bg-card)',
                backdropFilter: 'var(--backdrop-blur)',
                border: 'var(--glass-border)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
