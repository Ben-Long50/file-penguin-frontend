const Form = (props) => {
  return (
    <form
      action={props.action}
      method={props.method}
      onSubmit={props.onSubmit}
      className="flex flex-col gap-6"
    >
      {props.children}
    </form>
  );
};

export default Form;
