const Button = (props) => {
  return (
    <button
      className={`${props.className} accent-primary rounded p-2 text-gray-900`}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
