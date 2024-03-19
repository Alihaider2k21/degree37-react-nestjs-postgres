import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import style from './index.module.scss';
import FormCheckbox from '../form/FormCheckBox';
import CancelModalPopUp from '../cancelModal';
const SelectDataModal = ({
  openModal,
  setModalPopup,
  headingTitle,
  showSearchBar,
  actionButton,
  heading,
  data,
  selectedValues,
  onSelect,
  onSubmit,
  setSelectedValues,
  getData,
  savingData,
}) => {
  const [closeModal, setCloseModal] = useState(false);
  const cancelHandler = () => {
    if (selectedValues?.length > 0) {
      setCloseModal(true);
    } else {
      setSelectedValues([]);
      setModalPopup(false);
    }
  };
  const continueHandler = () => {
    setSelectedValues([]);
    setModalPopup(false);
  };
  return (
    <>
      <Modal
        className={` d-flex align-items-center justify-content-center `}
        centered
        dialogClassName={`${style.modalMain}`}
        show={openModal}
        onHide={() => setModalPopup(false)}
        backdrop="static"
        size="xl"
        // scrollable={true}
      >
        <div className={`${style.modalContentPart}`}>
          <Modal.Header
            closeButton={false}
            className={`border-0  ${style.modalPaddingHeader}`}
          >
            {headingTitle || showSearchBar ? (
              <div className="w-100 d-flex justify-content-between">
                {headingTitle ? (
                  <Modal.Title className={style.heading}>
                    {headingTitle}
                  </Modal.Title>
                ) : (
                  <></>
                )}
                {showSearchBar ? (
                  <div className={style.search}>
                    <div className={style.formItem}>
                      <input
                        type="text"
                        placeholder={'Search'}
                        onChange={(e) => {
                          if (e.target.value.trim().length > 1) {
                            getData(e.target.value);
                          } else if (e.target.value.trim().length == 0) {
                            getData();
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </Modal.Header>
          <Modal.Body
            className={`mainContent d-flex flex-column justify-content-center align-items-center border-0 ${style.modalBody}  ${style.modalPaddingBody}`}
          >
            <div className="mainContentInner w-100 p-0">
              <div className={`tableView`}>
                <div className={`addStaffData `}>
                  <div className="group group-data">
                    <div className={`group-head border-radius-remove `}>
                      <h2 className={`${style.title}`}>{heading}</h2>
                    </div>
                    <div className={` tabular-body-radius`}>
                      <table>
                        <tbody>
                          {data?.map((role) => {
                            return (
                              <tr key={role.id}>
                                <td className={`check ${style.textSize}`}>
                                  <FormCheckbox
                                    displayName={role.name}
                                    value={role.id}
                                    classes={{
                                      root: 'w-100 tableSpacing',
                                      text: 'margin-right-check',
                                    }}
                                    labelClass={'labelMargin'}
                                    onChange={onSelect}
                                    checked={selectedValues.includes(
                                      String(role.id)
                                    )}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className={`${style.modalPaddingFooter} border-0`}>
            {actionButton ? (
              <div className="w-100 d-flex justify-content-end">
                <button
                  className={`btn btn-secondary border-0  ${style.cancelBtn}`}
                  onClick={() => {
                    cancelHandler();
                  }}
                >
                  Cancel
                </button>
                <button
                  className={` ${`btn btn-primary`} ${style.btnDimensions}`}
                  onClick={onSubmit}
                  disabled={savingData}
                >
                  Submit
                </button>
              </div>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </div>
      </Modal>

      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={false}
        setModalPopUp={() => {
          setCloseModal(false);
        }}
        additionalStyles={{ background: 'rgba(0, 0, 0, 0.5)' }}
        methodsToCall
        methods={continueHandler}
      />
    </>
  );
};

export default SelectDataModal;
