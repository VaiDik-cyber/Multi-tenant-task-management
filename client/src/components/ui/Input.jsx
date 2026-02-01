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
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 0 2px var(--primary-light)'
                }}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)',
                    border: 'var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                }}
                type={type}
                {...props}
            />
        </div>
    );
};

export default Input;
