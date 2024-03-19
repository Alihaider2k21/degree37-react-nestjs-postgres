import React, { useState } from 'react';
import CancelModalPopUp from './index';

// Wrapper component for CancelModalPopUp
const CancelModalPopUpWrapper = ({
  message,
  redirectPath,
  isNavigate,
  title,
}) => {
  const [closeModal, setCloseModal] = useState(false);
  return (
    <>
      <button className="btn btn-secondary" onClick={() => setCloseModal(true)}>
        Cancel
      </button>
      <CancelModalPopUp
        title={title}
        message={message}
        modalPopUp={closeModal}
        setModalPopUp={setCloseModal}
        redirectPath={redirectPath}
        isNavigate={isNavigate}
      />
    </>
  );
};

export default {
  title: 'Components/cancelModalPopup',
  component: CancelModalPopUpWrapper, // Use the wrapper component in your story
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const CancelmodalpopUp = (args) => <CancelModalPopUpWrapper {...args} />;

// Default args for the story
CancelmodalpopUp.args = {
  title: 'Confirmation',
  message: 'Unsaved changes will be lost, do you wish to proceed?',
  redirectPath: '/',
  isNavigate: false,
};
