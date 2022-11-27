import React from 'react';
import classnames from 'classnames';

function Icon(props) {
  const {
    className, type, width, height, fill, radius, style = {}, ...others
  } = props;
  return (
    <svg
      className={classnames('icon-svg', className)}
      style={{
        ...style,
        width,
        height: height || width,
        minWidth: width,
        fill,
        borderRadius: radius,
      }}
      {...others}
    >
      <use xlinkHref={`#${type}`} />
    </svg>
  );
}

export default Icon;
