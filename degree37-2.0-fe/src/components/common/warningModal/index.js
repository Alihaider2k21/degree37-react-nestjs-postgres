import styles from './index.module.scss';
import React from 'react';
import { Modal } from 'react-bootstrap';

const WarningModalPopUp = ({
  title = '',
  message,
  modalPopUp,
  setModalPopUp,
  redirectPath,
  isNavigate,
  methodsToCall,
  methods,
  additionalStyles = {},
  confirmAction = () => {},
  cancelText = 'Cancel',
  confirmText = 'Ok',
}) => {
  const closeModal = () => {
    setModalPopUp(false);
  };
  return (
    <>
      <Modal
        className={`d-flex align-items-center  justify-content-center `}
        show={modalPopUp}
        onHide={() => setModalPopUp(false)}
        backdrop="static"
        keyboard={false}
        style={{ ...additionalStyles }}
      >
        <Modal.Body
          className={`d-flex flex-column justify-content-center align-items-center p-20  ${styles.modalbody}`}
          style={{ width: '310px' }}
        >
          <div className={styles.warning}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="58"
              height="57"
              viewBox="0 0 58 57"
              fill="none"
            >
              <g clipPath="url(#clip0_5138_192906)">
                <path
                  d="M45.3896 41.9803L45.7471 41.6307L45.3896 41.2811L32.4889 28.6671L45.3896 16.053L45.7471 15.7035L45.3896 15.3539L42.979 12.9969L42.6215 12.6473L42.264 12.9969L29.3633 25.6109L16.4625 12.9969L16.105 12.6473L15.7475 12.9969L13.3369 15.3539L12.9794 15.7035L13.3369 16.053L26.2377 28.6671L13.3369 41.2811L12.9794 41.6307L13.3369 41.9803L15.7475 44.3373L16.105 44.6868L16.4625 44.3373L29.3633 31.7232L42.264 44.3373L42.6215 44.6868L42.979 44.3373L45.3896 41.9803Z"
                  fill="white"
                  stroke="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_5138_192906">
                  <rect
                    width="40.4571"
                    height="40.4571"
                    fill="white"
                    transform="matrix(0.715007 0.699118 -0.715007 0.699118 29.3633 0.382812)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className={`${styles.text_width}`}>
            {title ? (
              <p className={`modal-title text-center ${styles.heading}`}>
                {title}
              </p>
            ) : (
              ''
            )}
            <span className={styles.bodytext}>{message}</span>
          </div>
          <div className="d-flex justify-content-around w-100">
            <button
              type="button"
              className={`btn btn-secondary py-1 mt-4 ${styles.nobtn} ${styles.nobtnhover} ${styles.submitbutton}`}
              onClick={closeModal}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn btn-primary py-1 mt-4 ${styles.nobtn} ${styles.submitbutton}`}
              onClick={confirmAction}
            >
              {confirmText}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WarningModalPopUp;
