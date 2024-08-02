import { Outlet } from 'react-router-dom';
import AuthProvider from './AuthContext';
import ThemeProvider from './ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
