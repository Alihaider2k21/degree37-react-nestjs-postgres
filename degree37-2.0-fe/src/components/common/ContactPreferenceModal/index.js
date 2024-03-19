import React from 'react';
import Mystyles from './index.module.scss';
import DatePicker from 'react-datepicker';

const ContactPreferenceModal = ({
  openModal,
  handleModalButtons,
  newContactPreference,
  setNewContactPreference,
}) => {
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewContactPreference((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date) => {
    setNewContactPreference((prevState) => ({
      ...prevState,
      next_call_date: new Date(date),
    }));
  };

  return (
    <section
      className={`${Mystyles.CreateMessageModal} popup full-section ${
        openModal ? 'active' : ''
      }`}
    >
      <div className={`${Mystyles.MessageModalInner} popup-inner`}>
        <div className={`${Mystyles.MessageModalContent} content`}>
          <form>
            <div className="formGroup">
              <h3 className="w-100">Contact Preferences</h3>
              <div className="form-field">
                <div className={`field`}>
                  <DatePicker
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={120}
                    dateFormat="MM/dd/yyyy"
                    name="next_call_date"
                    className="custom-datepicker effectiveDate"
                    placeholderText="Next Call Date"
                    minDate={new Date()}
                    selected={newContactPreference.next_call_date}
                    onChange={(date) => handleDateChange(date)}
                  />
                  <label className={`text-secondary`}></label>
                </div>
              </div>
              <div className="form-field checkbox w-100">
                <label htmlFor="toggle-1" className="switch">
                  <input
                    type="checkbox"
                    id="toggle-1"
                    className="toggle-input"
                    name="is_optout_email"
                    checked={newContactPreference.is_optout_email}
                    onChange={handleInputChange}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-text">Opt Out Email</span>
              </div>
              <div className="form-field checkbox w-100">
                <label htmlFor="toggle-2" className="switch">
                  <input
                    type="checkbox"
                    id="toggle-2"
                    className="toggle-input"
                    name="is_optout_sms"
                    checked={newContactPreference.is_optout_sms}
                    onChange={handleInputChange}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-text">Opt Out SMS</span>
              </div>
              <div className="form-field checkbox w-100">
                <label htmlFor="toggle-3" className="switch">
                  <input
                    type="checkbox"
                    id="toggle-3"
                    className="toggle-input"
                    name="is_optout_push"
                    checked={newContactPreference.is_optout_push}
                    onChange={handleInputChange}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-text">Opt Out Push</span>
              </div>
              <div className="form-field checkbox w-100">
                <label htmlFor="toggle-4" className="switch">
                  <input
                    type="checkbox"
                    id="toggle-4"
                    className="toggle-input"
                    name="is_optout_call"
                    checked={newContactPreference.is_optout_call}
                    onChange={handleInputChange}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-text">Opt Out Call</span>
              </div>
            </div>
            <div className="buttons">
              <button
                className="btn btn-link"
                onClick={() => handleModalButtons(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleModalButtons(newContactPreference)}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPreferenceModal;
