import styles from './index.module.scss';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SuccessPopUpModal = ({
  title = '',
  message,
  modalPopUp,
  setModalPopUp,
  showActionBtns = false,
  redirectPath,
  isNavigate,
  onConfirm = () => {},
  isArchived,
  archived,
  isReplace,
  loading,
  cancel = false,
  acceptBtnTitle,
  rejectBtnTitle,
  customSVGIcon,
}) => {
  const navigate = useNavigate();
  const confirmAction = () => {
    setModalPopUp(false);
    if (redirectPath) {
      if (isNavigate) {
        if (isReplace) navigate(redirectPath, { replace: true });
        else navigate(redirectPath);
      }
    } else {
      onConfirm();
    }
  };
  const archivedFunction = () => {
    const archiveButton = document.getElementById('archiveButton');
    archiveButton.disabled = true;
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
          {customSVGIcon ? (
            <div className={styles.customIcon}>{customSVGIcon}</div>
          ) : isArchived ? (
            <div className={styles.warning}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="91"
                height="91"
                viewBox="0 0 91 91"
                fill="none"
              >
                <circle cx="46" cy="45" r="44" fill="#FF1E1E" />
                <mask
                  id="mask0_10033_87339"
                  style={{ maskType: 'alpha' }}
                  maskUnits="userSpaceOnUse"
                  x="19"
                  y="18"
                  width="54"
                  height="54"
                >
                  <rect x="19" y="18" width="54" height="54" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_10033_87339)">
                  <path
                    d="M30.25 65.25C29.0125 65.25 27.9531 64.8094 27.0719 63.9281C26.1906 63.0469 25.75 61.9875 25.75 60.75V32.625C25.75 32.0625 25.8437 31.5563 26.0312 31.1063C26.2188 30.6562 26.4625 30.225 26.7625 29.8125L29.9125 25.9875C30.2125 25.575 30.5875 25.2656 31.0375 25.0594C31.4875 24.8531 31.975 24.75 32.5 24.75H59.5C60.025 24.75 60.5125 24.8531 60.9625 25.0594C61.4125 25.2656 61.7875 25.575 62.0875 25.9875L65.2375 29.8125C65.5375 30.225 65.7812 30.6562 65.9688 31.1063C66.1562 31.5563 66.25 32.0625 66.25 32.625V60.75C66.25 61.9875 65.8094 63.0469 64.9281 63.9281C64.0469 64.8094 62.9875 65.25 61.75 65.25H30.25ZM31.15 31.5H60.85L58.9375 29.25H33.0625L31.15 31.5ZM46 58.5L55 49.5L51.85 46.35L48.25 49.95V40.5H43.75V49.95L40.15 46.35L37 49.5L46 58.5Z"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
          ) : (
            !cancel && (
              <div className={styles.successicon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="91"
                  height="91"
                  viewBox="0 0 91 91"
                  fill="white"
                >
                  <g clipPath="url(#clip0_11964_64693)">
                    <path
                      d="M46.0011 1.04785C37.2888 1.04785 28.7722 3.63133 21.5283 8.4716C14.2843 13.3119 8.63832 20.1915 5.30429 28.2406C1.97026 36.2896 1.09792 45.1466 2.7976 53.6915C4.49727 62.2363 8.69262 70.0852 14.8531 76.2457C21.0136 82.4062 28.8625 86.6016 37.4074 88.3012C45.9522 90.0009 54.8092 89.1286 62.8582 85.7945C70.9073 82.4605 77.787 76.8145 82.6272 69.5706C87.4675 62.3266 90.051 53.81 90.051 45.0977C90.051 39.313 88.9116 33.585 86.6979 28.2406C84.4842 22.8962 81.2395 18.0402 77.1491 13.9498C73.0586 9.85936 68.2026 6.61467 62.8582 4.40095C57.5139 2.18724 51.7858 1.04785 46.0011 1.04785ZM66.7486 35.0103L44.7236 57.0353C44.3141 57.4481 43.8269 57.7758 43.2902 57.9995C42.7534 58.2231 42.1776 58.3383 41.5961 58.3383C41.0146 58.3383 40.4388 58.2231 39.902 57.9995C39.3652 57.7758 38.8781 57.4481 38.4686 57.0353L29.6586 48.2253C28.8291 47.3958 28.3631 46.2708 28.3631 45.0977C28.3631 43.9247 28.8291 42.7997 29.6586 41.9702C30.488 41.1407 31.6131 40.6747 32.7861 40.6747C33.9592 40.6747 35.0842 41.1407 35.9137 41.9702L41.5961 47.6967L60.4935 28.7552C61.323 27.9258 62.448 27.4598 63.621 27.4598C64.7941 27.4598 65.9191 27.9258 66.7486 28.7552C67.5781 29.5847 68.0441 30.7097 68.0441 31.8828C68.0441 33.0558 67.5781 34.1808 66.7486 35.0103Z"
                      fill="#5CA044"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_11964_64693">
                      <rect
                        width="89.443"
                        height="89.443"
                        fill="white"
                        transform="translate(0.730469 0.708008)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )
          )}
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
                {rejectBtnTitle ? rejectBtnTitle : 'No'}
              </button>
              <button
                id="archiveButton"
                type="button"
                className={`btn btn-primary w-20 py-1 mt-4 ${styles.nobtn} ${styles.submitbutton}`}
                onClick={archivedFunction}
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

export default SuccessPopUpModal;
