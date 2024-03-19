import React from 'react';

function FormFooter({
  enableArchive,
  onClickArchive,
  enableCancel,
  onClickCancel,
  enableCreate,
  onCreateType = 'button',
  onClickCreate,
  enableSaveAndClose,
  saveAndCloseType = 'button',
  onClickSaveAndClose,
  onClickCaptureSaveAndClose,
  enableSaveChanges,
  saveChangesType = 'button',
  onClickSaveChanges,
  disabled = false,
}) {
  return (
    <div className="mainContentInner">
      <div className="global-form-footer">
        {enableArchive ? (
          <div
            onClick={onClickArchive}
            className="archived"
            disabled={disabled}
          >
            <span>Archive</span>
          </div>
        ) : null}
        {enableCancel ? (
          <button
            className="btn btn-secondary border-0 btn-md mr-0"
            type="button"
            onClick={onClickCancel}
          >
            Cancel
          </button>
        ) : null}
        {enableCreate ? (
          <button
            type={onCreateType}
            disabled={disabled}
            className={'btn btn-primary btn-md'}
            onClick={onClickCreate}
          >
            Create
          </button>
        ) : null}
        {enableSaveAndClose ? (
          <button
            name="Save & Close"
            className="btn btn-secondary btn-md"
            type={saveAndCloseType}
            onClick={onClickSaveAndClose}
            onClickCapture={() => {
              if (onClickCaptureSaveAndClose) {
                onClickCaptureSaveAndClose();
              }
            }}
            disabled={disabled}
          >
            Save & Close
          </button>
        ) : null}
        {enableSaveChanges ? (
          <button
            type={saveChangesType}
            className={'btn btn-primary btn-md'}
            onClick={(e) => {
              onClickSaveChanges(e);
            }}
            disabled={disabled}
          >
            Save Changes
          </button>
        ) : null}
      </div>
    </div>
  );
}
export default FormFooter;
