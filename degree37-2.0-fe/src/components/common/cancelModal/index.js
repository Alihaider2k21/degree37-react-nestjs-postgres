import styles from './index.module.scss';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CancelModalPopUp = ({
  title = '',
  message,
  modalPopUp,
  setModalPopUp,
  redirectPath,
  isNavigate,
  methodsToCall,
  methods,
  additionalStyles = {},
  isInfo = false,
}) => {
  const navigate = useNavigate();
  const confirmAction = () => {
    if (methodsToCall) {
      methods();
    }
    setModalPopUp(false);
    if (redirectPath) {
      if (isNavigate) {
        navigate(redirectPath);
      }
    }
  };
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
          <div className={isInfo ? styles.primary : styles.warning}>
            {isInfo ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
              >
                <g clipPath="url(#clip0_11685_216823)">
                  <path
                    d="M23 0C10.2879 0 0 10.2867 0 23C0 35.7119 10.2867 46 23 46C35.7121 46 46 35.7132 46 23C46 10.2881 35.7132 0 23 0ZM25.3619 32.13C25.3619 32.8567 24.3023 33.5831 23.0005 33.5831C21.6381 33.5831 20.6694 32.8567 20.6694 32.13V20.5952C20.6694 19.7476 21.6381 19.1722 23.0005 19.1722C24.3023 19.1722 25.3619 19.7476 25.3619 20.5952V32.13ZM23.0005 16.3871C21.6079 16.3871 20.5181 15.3578 20.5181 14.2073C20.5181 13.0568 21.608 12.0577 23.0005 12.0577C24.3629 12.0577 25.4529 13.0568 25.4529 14.2073C25.4529 15.3578 24.3628 16.3871 23.0005 16.3871Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_11685_216823">
                    <rect width="46" height="46" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
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
            )}
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
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-primary py-1 mt-4 ${styles.nobtn} ${styles.submitbutton}`}
              onClick={confirmAction}
            >
              Ok
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CancelModalPopUp;
