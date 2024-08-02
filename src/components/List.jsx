import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { useEffect, useState } from 'react';

const List = (props) => {
  const [display, setDisplay] = useState(
    JSON.parse(localStorage.getItem(`${props.heading}`)) || false,
  );

  useEffect(() => {
    localStorage.setItem(`${props.heading}`, JSON.stringify(display));
  }, [display, props.heading]);

  const toggleMenu = (e) => {
    if (e.target.tagName.toLowerCase() === 'summary') {
      e.preventDefault();
      setDisplay((prevDisplay) => !prevDisplay);
    }
  };

  return (
    <details
      className="group [&_summary::-webkit-details-marker]:hidden"
      open={display}
    >
      <summary
        className="hover-primary list-primary flex items-center justify-between"
        onClick={toggleMenu}
      >
        <span className="text-base font-medium"> {props.heading} </span>
        <span className="shrink-0 transition duration-300 group-open:-rotate-180">
          <Icon
            path={mdiChevronDown}
            size={1.1}
            className={`text-secondary`}
          ></Icon>
        </span>
      </summary>
      <ul className="mt-2 flex flex-col gap-1 space-y-1 px-4">
        {props.children}
      </ul>
    </details>
  );
};

export default List;
