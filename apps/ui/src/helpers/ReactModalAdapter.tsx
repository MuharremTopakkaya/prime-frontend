import React from 'react';
import Modal, { Props as ModalProps } from "react-modal"

/* This just wraps react-modal to allow styling the modal overlay, you shouldn't have the need to change this at all */

interface ReactModalAdapterProps extends ModalProps {
  className?: string;
}

export default ({ className, ...props }: ReactModalAdapterProps): JSX.Element => {
  const contentClassName = `${className}__content`;
  const overlayClassName = `${className}__overlay`;
  return (
    <Modal
      className={contentClassName}
      overlayClassName={overlayClassName}
      {...props}
    />
  )
}

