import Sidebar from './Sidebar';

const Layout = ({ children, style }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ marginLeft: '260px', flex: 1, padding: '40px', ...style }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
