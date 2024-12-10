import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { ThemeContext } from './ThemeContext';
import useFolderQuery from '../hooks/useFolderQuery/useFolderQuery';
import Loading from './Loading';

const MainLayout = () => {
  const [allId, setAllId] = useState(() => {
    const value = localStorage.getItem('allId') || '';
    return value;
  });
  const [trashId, setTrashId] = useState(() => {
    const value = localStorage.getItem('trashId') || '';
    return value;
  });
  const [activeId, setActiveId] = useState(() => {
    const value = localStorage.getItem('activeId') || '';
    return value;
  });
  const { apiUrl } = useContext(AuthContext);
  const [visibility, setVisibility] = useState(true);
  const { theme } = useContext(ThemeContext);

  const folders = useFolderQuery(apiUrl);

  useEffect(() => {
    if (folders.data) {
      const allFolder = folders.data.find(
        (folder) => folder.title === 'All files',
      );
      const trashFolder = folders.data.find(
        (folder) => folder.title === 'Trash',
      );
      setAllId(allFolder.id);
      localStorage.setItem('allId', allFolder.id);
      setTrashId(trashFolder.id);
      localStorage.setItem('trashId', trashFolder.id);
      if (!localStorage.getItem('activeId')) {
        localStorage.setItem('activeId', allFolder.id);
        setActiveId(allFolder.id);
      } else {
        setActiveId(localStorage.getItem('activeId'));
      }
    }
  }, [folders.data]);

  const handleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  if (folders.isLoading || folders.isPending) {
    return <Loading />;
  }

  return (
    <div className={`${theme} layout-cols bg-secondary grid grid-rows-1`}>
      <Sidebar
        folders={folders.data}
        activeId={activeId}
        allId={allId}
        trashId={trashId}
        setActiveId={setActiveId}
        visibility={visibility}
        setVisibility={setVisibility}
        handleVisibility={handleVisibility}
      />
      <Outlet
        context={{
          activeId,
          allId,
          trashId,
          setActiveId,
          visibility,
          folders: folders.data,
        }}
      />
    </div>
  );
};

export default MainLayout;
