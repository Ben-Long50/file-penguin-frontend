import { Outlet } from 'react-router-dom';
import AuthProvider from './AuthContext';
import ThemeProvider from './ThemeContext';
import '../custom-scrollbar.css';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../queryClient';
import DragDropProvider from './DragDropContext';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DragDropProvider>
            <Outlet />
          </DragDropProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
