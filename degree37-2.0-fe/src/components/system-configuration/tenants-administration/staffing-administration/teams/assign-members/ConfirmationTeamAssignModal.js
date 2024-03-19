import React from 'react';
import styles from './index.module.scss';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfirmationTeamAssignModal = ({
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
  certificateName,
  records,
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
    setModalPopUp(false);
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
          <div className={styles.successicon}>
            <svg
              width="100"
              height="101"
              viewBox="0 0 90 91"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_4607_188639)">
                <circle cx="45.2695" cy="45" r="44" fill="#5CA044" />
                <g clipPath="url(#clip1_4607_188639)">
                  <path
                    d="M49.4775 67.9608C48.7414 67.9893 48.0128 68.0286 47.2836 68.0435C44.6046 68.0992 41.9249 68.1107 39.248 67.973C35.951 67.8034 32.6696 67.5008 29.4561 66.6908C27.929 66.3062 26.4461 65.8028 25.0839 64.9915C24.3295 64.5417 23.6518 64.0017 23.1267 63.2894C22.5881 62.5594 22.2801 61.7433 22.293 60.8309C22.3052 59.9517 22.1858 59.0643 22.392 58.1953C22.7027 56.884 23.489 55.8528 24.4068 54.9146C25.8416 53.4479 27.5268 52.3123 29.2906 51.2866C31.4933 50.0065 33.7863 48.9047 36.1898 48.0717C37.8811 47.4849 38.9244 45.9442 38.417 43.8378C38.3017 43.3596 38.1002 42.9505 37.7617 42.5692C35.5236 40.0463 34.1519 37.0756 33.3507 33.8254C32.7314 31.3113 32.5306 28.7619 32.882 26.1922C33.329 22.925 34.6254 20.1016 37.3512 18.0874C38.9923 16.8745 40.8578 16.2449 42.8808 16.0618C45.0232 15.8684 47.1018 16.114 49.0725 17.0122C52.1198 18.4009 53.9759 20.8064 54.9236 23.9643C55.5593 26.083 55.6631 28.2525 55.4772 30.4423C55.1834 33.8967 54.1631 37.119 52.3674 40.0897C51.8695 40.914 51.3241 41.709 50.6647 42.4085C50.2753 42.8216 50.0473 43.2748 49.9388 43.8222C49.7773 44.639 49.6729 45.4524 49.9042 46.2699C50.1409 47.1056 50.6369 47.687 51.4909 47.9747C54.0308 48.8308 56.4914 49.8755 58.8454 51.1651C59.1161 51.3137 59.148 51.4012 58.9309 51.6393C58.283 52.3489 57.6799 53.0979 57.1202 53.8801C56.9798 54.0768 56.8876 54.0782 56.703 53.9255C55.159 52.6488 53.4495 51.6936 51.4706 51.2635C48.7129 50.6631 45.7667 51.6746 44.2552 54.163C43.8448 54.8386 43.4066 55.5001 42.9357 56.1344C41.5518 57.9993 41.4616 61.1321 42.8401 63.1659C43.5585 64.2255 44.5083 64.9996 45.6608 65.5315C46.9376 66.121 48.1539 66.8082 49.2556 67.6874C49.3377 67.7525 49.4592 67.7905 49.4782 67.9608H49.4775Z"
                    fill="white"
                  />
                  <path
                    d="M57.5712 61.0424C61.3407 53.6905 66.0333 47.4629 71.8823 42.2094C72.6562 41.5143 73.7944 41.6039 74.4339 42.4243C74.8107 42.9077 75.2118 43.4312 75.5426 43.8658C75.9398 44.3875 75.8136 45.1341 75.2695 45.5C70.7695 49 66.8856 53.5638 63.828 59.1083C62.457 61.594 61.3343 64.1949 60.2142 66.7986C59.911 67.5034 59.5962 68.2042 59.2543 68.8914C58.5766 70.2536 57.059 70.4158 56.1147 69.2204C55.6812 68.6716 55.3129 68.0726 54.9004 67.5061C53.1067 65.0415 50.7283 63.3055 48.0073 62.001C47.7122 61.8599 47.4116 61.7256 47.1328 61.5573C45.7977 60.7534 45.9219 59.3152 46.4381 58.4849C46.915 57.7176 47.415 56.9626 47.9435 56.2299C48.5276 55.4206 49.3796 55.2144 50.3206 55.3276C51.7561 55.5006 52.927 56.2401 54.0124 57.1322C55.2952 58.1871 56.3718 59.434 57.3474 60.7724C57.4071 60.8545 57.4661 60.9373 57.5278 61.018C57.54 61.0336 57.5651 61.039 57.5712 61.0424Z"
                    fill="white"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_4607_188639">
                  <rect
                    width="89.443"
                    height="89.443"
                    fill="white"
                    transform="translate(0 0.710938)"
                  />
                </clipPath>
                <clipPath id="clip1_4607_188639">
                  <rect
                    width="54"
                    height="54.0231"
                    fill="white"
                    transform="translate(22.2695 16)"
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
              You are assigning{' '}
              <span className={styles.blueText}>{records}</span> staff to{' '}
              <span className={styles.blueText}>{certificateName} </span>
            </span>
          </div>
          <p
            className={`modal-message fw-light text-secondary mt-4 ${styles.bodytext}`}
          >
            Are you sure you want to continue?
          </p>
          <div className="d-flex justify-content-around w-100">
            <button
              type="button"
              className={`btn btn-secondary w-20 py-1 mt-2 ${styles.nobtn} ${styles.nobtnhover} ${styles.submitbutton}`}
              onClick={closeModal}
            >
              No
            </button>
            <button
              type="button"
              className={`btn btn-primary w-20 py-1 mt-2 ${styles.nobtn} ${styles.submitbutton}`}
              onClick={isArchived ? archivedFunction : confirmAction}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Yes'}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmationTeamAssignModal;
