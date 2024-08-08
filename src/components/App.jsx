import { Outlet } from 'react-router-dom';
import AuthProvider from './AuthContext';
import ThemeProvider from './ThemeContext';
import '../custom-scrollbar.css';

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
