import Icon from '@mdi/react';

const ActionBtn = (props) => {
  return (
    <button
      type="submit"
      className={`${props.className} group/button hover-primary rounded-full text-transparent transition duration-300`}
      onClick={props.onClick}
    >
      {props.children}
      <Icon className="text-inherit" path={props.icon} size={1}></Icon>
    </button>
  );
};

export default ActionBtn;
