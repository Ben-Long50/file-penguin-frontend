import Icon from '@mdi/react';

const ActionBtn = (props) => {
  return (
    <button
      type="submit"
      className={`${props.className} text-primary group/button flex shrink-0 items-center gap-4 p-2 transition lg:duration-300`}
      onClick={props.onClick}
      onMouseLeave={props.onMouseLeave}
    >
      <Icon
        className="shrink-0 text-inherit"
        path={props.icon}
        size={1.2}
      ></Icon>
      {props.children}
    </button>
  );
};

export default ActionBtn;
