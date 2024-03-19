import React from 'react';
import { Modal } from 'react-bootstrap';
import Styles from './index.module.scss';

const PreviewModal = ({ modalPopUp, setModalPopUp, imgPath }) => {
  return (
    <>
      <Modal
        size={imgPath?.index === 2 ? 'sm' : 'lg'}
        show={modalPopUp}
        onHide={() => setModalPopUp(false)}
        className={Styles.previewmodal}
        aria-labelledby={
          imgPath?.index === 2
            ? 'example-modal-sizes-title-sm'
            : 'example-modal-sizes-title-lg'
        }
      >
        <Modal.Body className="p-0 bg-transparent">
          <div className="w-100">
            <img className="w-100" alt="" src={imgPath?.path} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PreviewModal;
