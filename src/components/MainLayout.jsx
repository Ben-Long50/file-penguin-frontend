import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import Loading from './Loading';
import { ThemeContext } from './ThemeContext';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [activeId, setActiveId] = useState('');
  const { apiUrl, currentUser } = useContext(AuthContext);
  const [visibility, setVisibility] = useState(true);
  const { theme, changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const fetchFolders = async () => {
      try {
        const response = await fetch(`${apiUrl}/folders`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setFolders(data);
          if (!localStorage.getItem('activeId')) {
            localStorage.setItem('activeId', data[0].id);
            setActiveId(data[0].id);
          } else {
            setActiveId(localStorage.getItem('activeId'));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [currentUser]);

  const handleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${theme} layout-cols bg-secondary grid grid-rows-1`}>
      <Sidebar
        folders={folders}
        setFolders={setFolders}
        activeId={activeId}
        setActiveId={setActiveId}
        visibility={visibility}
        setVisibility={setVisibility}
        handleVisibility={handleVisibility}
        theme={theme}
        changeTheme={changeTheme}
      />
      <Outlet context={[activeId, setActiveId, visibility, folders]} />
    </div>
  );
};

export default MainLayout;
