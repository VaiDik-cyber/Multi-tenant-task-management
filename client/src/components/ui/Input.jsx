import { motion } from 'framer-motion';

const Input = ({ label, type = 'text', ...props }) => {
    return (
        <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: '500'
            }}>
                {label}
            </label>
            <motion.input
                whileFocus={{
                    scale: 1.01,
                    borderColor: 'var(--primary)',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                }}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                }}
                type={type}
                {...props}
            />
        </div>
    );
};

export default Input;
