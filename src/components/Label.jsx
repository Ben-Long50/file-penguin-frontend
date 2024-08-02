import Icon from '@mdi/react';

const Label = (props) => {
  return (
    <button
      type="submit"
      className={`${props.buttonClass} group/button rounded-full p-1 text-transparent transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-900`}
      onClick={props.onClick}
    >
      <p
        className={`${props.labelClass} group-hover/button:text-tertiary pointer-events-none absolute -translate-y-7 text-nowrap rounded border-transparent p-1 text-sm text-transparent duration-300 group-hover/button:bg-gray-100 group-hover/button:dark:bg-gray-900`}
      >
        {props.label}
      </p>
      <Icon
        className={`${props.iconClass} text-inherit`}
        path={props.icon}
        size={1.2}
      ></Icon>
    </button>
  );
};

export default Label;
