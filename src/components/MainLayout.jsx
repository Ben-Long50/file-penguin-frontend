import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import Loading from './Loading';
import { ThemeContext } from './ThemeContext';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState('');
  const { apiUrl, currentUser } = useContext(AuthContext);
  const [visibility, setVisibility] = useState(true);
  const { theme, changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/users/${currentUser._id}/chats`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setChats(data);
          if (!localStorage.getItem('activeId')) {
            localStorage.setItem('activeId', data[0]._id);
            setActiveId(data[0]._id);
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
    fetchChats();
  }, [currentUser._id]);

  const handleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${theme} layout-cols bg-secondary grid grid-rows-1`}>
      <Sidebar
        chats={chats}
        setChats={setChats}
        activeId={activeId}
        setActiveId={setActiveId}
        visibility={visibility}
        setVisibility={setVisibility}
        handleVisibility={handleVisibility}
        theme={theme}
        changeTheme={changeTheme}
      />
      <Outlet context={[activeId, setActiveId, visibility, chats]} />
    </div>
  );
};

export default MainLayout;
