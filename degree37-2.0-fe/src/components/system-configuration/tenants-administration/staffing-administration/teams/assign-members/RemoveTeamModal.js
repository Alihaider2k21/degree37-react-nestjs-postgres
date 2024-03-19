import styles from './index.module.scss';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RemoveTeamModal = ({
  title = '',
  message,
  modalPopUp,
  setModalPopUp,
  showActionBtns = false,
  redirectPath,
  isNavigate,
  confirmation,
  isArchived,
  archived,
  isReplace,
  loading,
  crossIcon,
  cancel = false,
  acceptBtnTitle,
}) => {
  const navigate = useNavigate();
  const confirmAction = () => {
    setModalPopUp(false);
    if (redirectPath) {
      if (isNavigate) {
        if (isReplace) navigate(redirectPath, { replace: true });
        else navigate(redirectPath);
      }
    }
  };
  const archivedFunction = () => {
    archived();
  };
  const closeModal = () => {
    setModalPopUp(false);
  };
  return (
    <>
      <Modal
        className={`d-flex align-items-center  justify-content-center ${styles.mainmodelbody}`}
        show={modalPopUp}
        onHide={() => setModalPopUp(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body
          className={`d-flex flex-column justify-content-center align-items-center p-20  ${styles.modalbody}`}
        >
          <div className={styles.warning}>
            <svg
              width="100"
              height="100"
              viewBox="0 0 88 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="44" cy="44" r="44" fill="#FF1E1E" />
              <g clipPath="url(#clip0_5138_192862)">
                <g clipPath="url(#clip1_5138_192862)">
                  <path
                    d="M61.3896 55.9803L61.7471 55.6307L61.3896 55.2811L48.4889 42.6671L61.3896 30.053L61.7471 29.7035L61.3896 29.3539L58.979 26.9969L58.6215 26.6473L58.264 26.9969L45.3633 39.6109L32.4625 26.9969L32.105 26.6473L31.7475 26.9969L29.3369 29.3539L28.9794 29.7035L29.3369 30.053L42.2377 42.6671L29.3369 55.2811L28.9794 55.6307L29.3369 55.9803L31.7475 58.3373L32.105 58.6868L32.4625 58.3373L45.3633 45.7232L58.264 58.3373L58.6215 58.6868L58.979 58.3373L61.3896 55.9803Z"
                    fill="white"
                    stroke="white"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_5138_192862">
                  <rect
                    width="60"
                    height="64"
                    fill="white"
                    transform="translate(14 12)"
                  />
                </clipPath>
                <clipPath id="clip1_5138_192862">
                  <rect
                    width="40.4571"
                    height="40.4571"
                    fill="white"
                    transform="matrix(0.715007 0.699118 -0.715007 0.699118 45.3633 14.3828)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="text-center">
            {title ? (
              <p className={`modal-title text-center ${styles.heading}`}>
                {title}
              </p>
            ) : (
              ''
            )}
            <span
              className={`modal-message fw-light text-secondary  ${styles.bodytext}`}
            >
              {message}
            </span>
          </div>
          {isArchived ? (
            <div className="d-flex justify-content-around w-100">
              <button
                type="button"
                className={`btn btn-secondary w-20 py-1 mt-4 ${styles.nobtn} ${styles.nobtnhover} ${styles.submitbutton}`}
                onClick={closeModal}
              >
                No
              </button>
              <button
                type="button"
                className={`btn btn-primary w-20 py-1 mt-4 ${styles.nobtn} ${styles.submitbutton}`}
                onClick={isArchived ? archivedFunction : confirmAction}
                disabled={loading}
              >
                {loading
                  ? 'Processing...'
                  : acceptBtnTitle
                  ? acceptBtnTitle
                  : 'Yes'}
              </button>
            </div>
          ) : (
            ''
          )}

          {showActionBtns ? (
            <button
              type="button"
              className={`btn btn-primary py-1 mt-4 ${styles.oksubmitbtn}`}
              onClick={confirmAction}
            >
              Ok
            </button>
          ) : (
            ''
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RemoveTeamModal;
