import React, {useEffect, useId, useRef} from 'react';
import {createPortal} from 'react-dom';
import Icon from './Icon.jsx';
export default function Modal({title, children, onClose, wide = false, closeable = true}) {
  const ref = useRef(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.showModal();
    ref.current?.querySelector('input:not([readonly]):not([type=hidden]), textarea, select')?.focus();
    return () => {document.body.style.overflow = previousOverflow; previous?.focus?.();};
  }, []);
  return createPortal(<dialog ref={ref} className={'modal' + (wide ? ' modal-wide' : '')} aria-labelledby={titleId}
    onCancel={event => {event.preventDefault(); if (closeable) onCloseRef.current();}}
    onClick={event => {if (closeable && event.target === event.currentTarget) {const box = ref.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onCloseRef.current();}}}>
    <div className="modal-heading"><h2 id={titleId}>{title}</h2>{closeable && <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close"/></button>}</div>
    {children}
  </dialog>, document.body);
}
