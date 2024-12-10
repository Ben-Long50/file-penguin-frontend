import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';

const Loading = (props) => {
  return (
    <div className={`grid w-full place-content-center`}>
      <Icon
        className={`${props.className} text-primary spin`}
        path={mdiLoading}
        size={props.size || 5}
      />
    </div>
  );
};

export default Loading;
