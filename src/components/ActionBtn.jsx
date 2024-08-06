import Icon from '@mdi/react';

const ActionBtn = (props) => {
  return (
    <button
      type="submit"
      className={`${props.className} group/button rounded-full transition lg:text-transparent lg:duration-300`}
      onClick={props.onClick}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
      <Icon className="text-inherit" path={props.icon} size={1}></Icon>
    </button>
  );
};

export default ActionBtn;
