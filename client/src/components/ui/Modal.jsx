import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px' // Ensure gap from screen edges on mobile
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative', // Relative to flex container
                            zIndex: 2, // Above backdrop
                            width: '100%',
                            maxWidth: '500px',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: 'calc(100vh - 40px)', // Max height with padding
                            overflow: 'hidden' // Clip children
                        }}
                    >
                        <div style={{
                            padding: '32px',
                            overflowY: 'auto', // Scroll content internally
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '100%'
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
                                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{title}</h2>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
