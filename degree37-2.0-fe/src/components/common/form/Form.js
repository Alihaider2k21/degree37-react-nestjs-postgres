import React from 'react';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../confirmModal';
import SuccessPopUpModal from '../successModal';
import TopBar from '../topbar/index';

export default function Form({
  children,
  className = '',
  showConfirmationDialog,
  setShowConfirmationDialog,
  showSuccessDialog,
  setShowSuccessDialog,
  onConfirmNavigate,
  handleSubmit,
  isStateDirty,
  isDisabled,
  successModalMessage,
  BreadcrumbsData,
  editScreen,
  eventName,
  BreadCrumbsTitle,
  modalPopUp,
  setModalPopUp,
  handleArchive,
  archiveStatus,
  setArchiveStatus,
}) {
  const navigate = useNavigate();

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(onConfirmNavigate);
    }
  };

  const handleCancelClick = () => {
    if (isStateDirty) {
      setShowConfirmationDialog(true);
    } else {
      navigate(onConfirmNavigate);
    }
  };

  const saveChanges = async (e) => {
    await handleSubmit(e, 'saveClose');
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e, 'saveAndClose');
  };

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={BreadCrumbsTitle}
        />
        <div className="mainContentInner">
          <form className={`${styles.createEditForm} ${className}`}>
            {children}
          </form>
        </div>

        <ConfirmModal
          showConfirmation={showConfirmationDialog}
          onCancel={() => handleConfirmationResult(false)}
          onConfirm={() => handleConfirmationResult(true)}
          heading={'Confirmation'}
          description={'Unsaved changes will be lost. Do you want to continue?'}
        />
        <SuccessPopUpModal
          title="Success!"
          message={successModalMessage}
          modalPopUp={showSuccessDialog}
          isNavigate={eventName !== 'saveClose' ? true : false}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={-1}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Operation Status is archived.'}
          modalPopUp={archiveStatus}
          isNavigate={true}
          setModalPopUp={setArchiveStatus}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/operations-admin/booking-drives/operation-status'
          }
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure want to Archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleArchive}
        />

        {editScreen ? (
          <div className="form-footer">
            <div
              onClick={() => {
                setModalPopUp(true);
              }}
              className="archived"
            >
              <span>Archive</span>
            </div>
            <button
              className="btn btn-secondary border-0"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={saveAndClose}
              disabled={!isDisabled}
            >
              Save & Close
            </button>

            <button
              type="button"
              className={` ${
                !isDisabled ? `btn btn-secondary` : `btn btn-primary`
              }`}
              onClick={saveChanges}
              disabled={!isDisabled}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="form-footer">
            <button
              className="btn btn-secondary border-0"
              onClick={handleCancelClick}
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isDisabled}
              onClick={handleSubmit}
              className={` ${
                !isDisabled ? `btn btn-secondary` : `btn btn-primary`
              }`}
            >
              Create
            </button>
          </div>
        )}
      </div>
    </>
  );
}
