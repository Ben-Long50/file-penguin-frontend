const Label = (props) => {
  return (
    <p
      className={`${props.className} group-hover/button:shadow-custom group-hover/button:text-tertiary group-hover/button:bg-secondary pointer-events-none invisible absolute -translate-y-7 text-nowrap rounded border-transparent p-1 text-sm text-transparent duration-300 group-hover/button:visible`}
    >
      {props.label}
    </p>
  );
};

export default Label;
