import React from 'react';
import { Modal } from 'react-bootstrap';
import style from './AddCertificateModal.module.scss';
import styles from '../../../system-configuration/tenants-administration/operations-administration/booking-drives/booking-rule/booking-rule.module.scss';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import SelectDropdown from '../../../common/selectDropdown';
import { addMonths, addDays } from 'date-fns';
import CancelModalPopUp from '../../../common/cancelModal';
const AddCertificateModal = ({
  openModal,
  setModalPopup,
  headingTitle,
  showSearchBar,
  actionButton,
  heading,
  data,
  onSubmit,
  getData,
  selectedCertificate,
  setSelectedCertificate,
  setCertificateError,
  certificateError,
  staffCertificate,
  savingData,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const cancelHandler = () => {
    if (selectedCertificate) {
      setCloseModal(true);
    } else {
      modalCloseHandler();
    }
  };
  const continueHandler = () => {
    modalCloseHandler();
  };
  const options = data?.map((certif) => {
    return {
      label: certif.name,
      value: certif.id,
      data: certif,
    };
  });
  const modalCloseHandler = () => {
    setCertificateError('');
    setSelectedCertificate(null);
    setStartDate(new Date());
    setEndDate(null);
    setModalPopup(false);
  };

  return (
    <>
      <Modal
        className={`d-flex align-items-center justify-content-center`}
        centered
        dialogClassName={`${style.modalMain}`}
        show={openModal}
        onHide={modalCloseHandler}
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
            <div className="mainContentInner w-100  p-0">
              <div className={`tableView`}>
                <div
                  className={`addStaffData `}
                  style={{
                    overflowY: 'unset',
                    zIndex: '3000',
                    height: '100%',
                  }}
                >
                  <div className="group group-data border-0">
                    {heading && (
                      <div className={`group-head border-radius-remove `}>
                        <h2 className={`${style.title}`}>{heading}</h2>
                      </div>
                    )}
                    <div
                      className={`w-100 tabular-body-radius border-0`}
                      style={{ overflow: 'unset', height: '100%' }}
                    >
                      <form
                        className={`${style.certificateModalForm} m-0 border-0 ${styles.bookingRule}`}
                      >
                        <div className="formGroup w-100 border-0 m-0 p-0">
                          <div
                            className="form-field w-100 mb-0 d-flex justify-content-start"
                            style={{ gap: '20px' }}
                          >
                            <div className="field" style={{ flex: '1' }}>
                              <SelectDropdown
                                name="certificate_id"
                                placeholder={'Certificate*'}
                                //   selectedValue={filters.certificate_id}
                                onChange={(e) => {
                                  if (e) {
                                    setSelectedCertificate({ ...e.data });
                                    if (e.data.expires) {
                                      const date = addMonths(
                                        startDate,
                                        e.data.expiration_interval
                                      );
                                      setEndDate(date);
                                      setCertificateError('');
                                    } else {
                                      setEndDate(null);
                                    }
                                  } else {
                                    setEndDate(null);
                                    setCertificateError(
                                      'Certificate is required.'
                                    );
                                  }
                                }}
                                options={options}
                                removeDivider
                                showLabel={selectedCertificate}
                              />
                              {certificateError && (
                                <div className="error">
                                  <p>{certificateError}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className={`form-field w-100 d-flex justify-content-start `}
                            style={{ gap: '20px' }}
                          >
                            <div
                              className="field position-relative w-50"
                              // style={{ flex: '1' }}
                            >
                              <label
                                style={{
                                  fontSize: '12px',
                                  top: '24%',
                                  color: '#555555',
                                  zIndex: 1,
                                }}
                              >
                                Start Date*
                              </label>
                              <DatePicker
                                dateFormat="MM/dd/yyyy"
                                className={`${style.customDatepicker}  custom-datepicker `}
                                //   disabled={bookingRuleFormData.readOnly}
                                selected={startDate}
                                minDate={new Date()}
                                onChange={(date) => {
                                  setStartDate(date);
                                  if (
                                    selectedCertificate?.expiration_interval
                                  ) {
                                    const newDate = addDays(
                                      addMonths(
                                        startDate,
                                        selectedCertificate.expiration_interval
                                      ),
                                      1
                                    );
                                    setEndDate(newDate);
                                    setCertificateError('');
                                  }
                                }}
                              />
                            </div>
                            {endDate && (
                              <div
                                className="field position-relative"
                                style={{ flex: '1' }}
                              >
                                <label
                                  style={{
                                    fontSize: '12px',
                                    top: '24%',
                                    color: '#555555',
                                    zIndex: 1,
                                  }}
                                >
                                  End Date
                                </label>
                                <DatePicker
                                  dateFormat="MM/dd/yyyy"
                                  className={`${style.customDatepicker}  custom-datepicker `}
                                  selected={endDate}
                                  disabled={selectedCertificate?.expires}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
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
                  onClick={() => onSubmit(new Date(startDate).toISOString())}
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

export default AddCertificateModal;
