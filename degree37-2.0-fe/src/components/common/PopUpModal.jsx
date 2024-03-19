import style from '../../styles/Home.module.scss';
import React from 'react';
import vector from '../../assets/Icons.png';
import cross from '../../assets/error1.png';
import { Modal } from 'react-bootstrap';

const PopUpModal = ({
  title = '',
  message,
  modalPopUp,
  setModalPopUp,
  state = 'error',
  showActionBtns = false,
  confirmAction = () => {},
}) => {
  return (
    <>
      <Modal
        className={`d-flex align-items-center  justify-content-center `}
        show={modalPopUp}
        onHide={() => setModalPopUp(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          closeButton
          className={`modal-header ${style.modalHeader}`}
        ></Modal.Header>
        <Modal.Body
          className={`d-flex flex-column justify-content-center align-items-center p-20 ${style.createAdModelStyle}`}
        >
          {state === 'error' ? (
            <img src={cross} width={90} height={90} alt="" />
          ) : (
            <img src={vector} alt="" />
          )}
          <div>
            {title ? <p className="modal-title text-center">{title}</p> : ''}
            <span className="modal-message">{message}</span>
          </div>
          {showActionBtns ? (
            <div className="d-flex">
              <button
                className="btn btn-secondary me-3"
                onClick={() => setModalPopUp(false)}
              >
                No
              </button>

              <button
                type="button"
                className={` ${`btn btn-primary`}`}
                onClick={confirmAction}
              >
                Yes
              </button>
            </div>
          ) : (
            ''
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PopUpModal;
