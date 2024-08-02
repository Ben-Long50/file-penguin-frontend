const InputField = (props) => {
  return (
    <div className="group flex flex-col items-start gap-2">
      <label className="text-secondary text-base" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        className="text-tertiary w-full border-b bg-transparent text-2xl outline-none ring-orange-300 focus:rounded focus:border-transparent focus:ring-2"
        type={props.type}
        name={props.name}
        id={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
};

export default InputField;
