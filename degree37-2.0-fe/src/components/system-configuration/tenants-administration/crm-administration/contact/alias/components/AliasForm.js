import React from 'react';

const AliasForm = ({ isEdit, value, handleChange, error }) => {
  return (
    <div className="mainContentInner">
      <form>
        <div className="formGroup w-50">
          <h5>{isEdit ? 'Set Alias Name' : 'Alias Name'}</h5>
          <div className="form-field w-100">
            <div className="field">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder=""
                value={value}
                required
                disabled={!isEdit}
                onChange={(e) => handleChange(e)}
              />
              {value ? null : <label>{'Alias Name'}</label>}
            </div>
            {error !== undefined && error !== null && (
              <div className="error">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AliasForm;
