import React, { useEffect, useState } from 'react';
import { urlRegex } from '../../../helpers/Validation';

const AddConfigurations = (props) => {
  const { addTenant, setAddTenant, viewEdit } = props;
  const handleInputBlur = (e, config_name = null, state_name = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    if (config_name) {
      if (name === 'end_point_url') {
        if (!urlRegex.test(value) && value.trim() !== '') {
          errorMessage = 'Provide Correct End Point';
        } else {
          errorMessage = '';
        }
      }
      setError(config_name, {
        ...errors[config_name],
        [name]: errorMessage,
      });
    }
    // sendDataToParentHandler()
  };

  const [errors, setErrors] = useState({
    bbcs_client_evironment: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    google_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    daily_story_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    quick_pass_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
  });

  const handleFormInput = (e, key, config_name = null) => {
    const { value } = e.target;

    if (config_name) {
      if (config_name === 'bbcs_client_evironment') {
        setAddTenant((prevData) => ({
          ...prevData,
          bbcs_client_evironment: {
            ...prevData.bbcs_client_evironment,
            [key]: value,
          },
        }));
      } else if (config_name === 'google_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          google_api: {
            ...prevData.google_api,
            [key]: value,
          },
        }));
      } else if (config_name === 'daily_story_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          daily_story_api: {
            ...prevData.daily_story_api,
            [key]: value,
          },
        }));
      } else if (config_name === 'quick_pass_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          quick_pass_api: {
            ...prevData.quick_pass_api,
            [key]: value,
          },
        }));
      }
    } else {
      if (key === 'allow_email' || key === 'is_active') {
        setAddTenant((prevData) => ({
          ...prevData,
          [key]: e.target.checked,
        }));
      } else {
        setAddTenant((prevData) => ({
          ...prevData,
          [key]: value,
        }));
      }
    }

    // sendDataToParentHandler()
  };

  useEffect(() => {
    setAddTenant(addTenant);
  }, [addTenant]);

  return (
    <div className="formGroup">
      <h5>Add Configuration</h5>
      {viewEdit ? (
        <div className="form-field">
          <div className="field">
            <input
              type="text"
              className="form-control"
              placeholder=" "
              value={addTenant?.tenant_name}
              disabled
              name="tenant_name"
              onChange={(e) => {
                handleFormInput(e, 'tenant_name');
              }}
            />
            <label>Tenant</label>
          </div>
        </div>
      ) : (
        ''
      )}

      <h6>BBCS Client Environment</h6>
      {/* {console.log('tennatState:', addTenant )} */}
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.bbcs_client_evironment?.end_point_url}
            name="end_point_url"
            onBlur={(e) => {
              handleInputBlur(e, 'bbcs_client_evironment');
            }}
            onChange={(e) => {
              handleFormInput(e, 'end_point_url', 'bbcs_client_evironment');
            }}
          />
          <label>End Point URL</label>
        </div>
        {errors?.bbcs_client_evironment?.end_point_url && (
          <div className="error">
            <p>{errors?.bbcs_client_evironment?.end_point_url}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.bbcs_client_evironment?.secret_value}
            name="secret_value"
            onBlur={(e) => {
              handleInputBlur(e, 'bbcs_client_evironment');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_value', 'bbcs_client_evironment');
            }}
          />
          <label>Secret Value</label>
        </div>
        {errors?.bbcs_client_evironment?.secret_value && (
          <div className="error">
            <p>{errors?.bbcs_client_evironment?.secret_value}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="text"
            className="form-control"
            placeholder=" "
            value={addTenant?.bbcs_client_evironment?.secret_key}
            name="secret_key"
            onBlur={(e) => {
              handleInputBlur(e, 'bbcs_client_evironment');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_key', 'bbcs_client_evironment');
            }}
          />
          <label>Secret Key</label>
        </div>
        {errors?.bbcs_client_evironment?.secret_key && (
          <div className="error">
            <p>{errors?.bbcs_client_evironment?.secret_key}</p>
          </div>
        )}
      </div>
      <h6>Google API</h6>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="text"
            className="form-control"
            placeholder=" "
            value={addTenant?.google_api?.end_point_url}
            name="end_point_url"
            onBlur={(e) => {
              handleInputBlur(e, 'google_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'end_point_url', 'google_api');
            }}
          />
          <label>End Point URL</label>
        </div>
        {errors?.google_api?.end_point_url && (
          <div className="error">
            <p>{errors?.google_api?.end_point_url}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.google_api?.secret_value}
            name="secret_value"
            onBlur={(e) => {
              handleInputBlur(e, 'google_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_value', 'google_api');
            }}
          />
          <label>Secret Value</label>
        </div>
        {errors?.google_api?.secret_value && (
          <div className="error">
            <p>{errors?.google_api?.secret_value}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.google_api?.secret_key}
            name="secret_key"
            onBlur={(e) => {
              handleInputBlur(e, 'google_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_key', 'google_api');
            }}
          />
          <label>Secret Key</label>
        </div>
        {errors?.google_api?.secret_key && (
          <div className="error">
            <p>{errors?.google_api?.secret_key}</p>
          </div>
        )}
      </div>
      <h6>Daily Story API</h6>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.daily_story_api?.end_point_url}
            name="end_point_url"
            onBlur={(e) => {
              handleInputBlur(e, 'daily_story_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'end_point_url', 'daily_story_api');
            }}
          />
          <label>End Point URL</label>
        </div>
        {errors?.daily_story_api?.end_point_url && (
          <div className="error">
            <p>{errors?.daily_story_api?.end_point_url}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.daily_story_api?.secret_value}
            name="secret_value"
            onBlur={(e) => {
              handleInputBlur(e, 'daily_story_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_value', 'daily_story_api');
            }}
          />
          <label>Secret Value</label>
        </div>
        {errors?.daily_story_api?.secret_value && (
          <div className="error">
            <p>{errors?.daily_story_api?.secret_value}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.daily_story_api?.secret_key}
            name="secret_key"
            onBlur={(e) => {
              handleInputBlur(e, 'daily_story_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_key', 'daily_story_api');
            }}
          />
          <label>Secret Key</label>
        </div>
        {errors?.daily_story_api?.secret_key && (
          <div className="error">
            <p>{errors?.daily_story_api?.secret_key}</p>
          </div>
        )}
      </div>
      <h6>Quick-pass API</h6>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="text"
            className="form-control"
            placeholder=" "
            value={addTenant?.quick_pass_api?.end_point_url}
            name="end_point_url"
            onBlur={(e) => {
              handleInputBlur(e, 'quick_pass_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'end_point_url', 'quick_pass_api');
            }}
          />
          <label>Supplies</label>
        </div>
        {errors?.quick_pass_api?.end_point_url && (
          <div className="error">
            <p>{errors?.quick_pass_api?.end_point_url}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="text"
            className="form-control"
            placeholder=" "
            value={addTenant?.quick_pass_api?.secret_value}
            name="secret_value"
            onBlur={(e) => {
              handleInputBlur(e, 'quick_pass_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_value', 'quick_pass_api');
            }}
          />
          <label>Vendor id</label>
        </div>
        {errors?.quick_pass_api?.secret_value && (
          <div className="error">
            <p>{errors?.quick_pass_api?.secret_value}</p>
          </div>
        )}
      </div>
      <div className="form-field">
        <div className="field">
          <input
            required
            type="email"
            className="form-control"
            placeholder=" "
            value={addTenant?.quick_pass_api?.secret_key}
            name="secret_key"
            onBlur={(e) => {
              handleInputBlur(e, 'quick_pass_api');
            }}
            onChange={(e) => {
              handleFormInput(e, 'secret_key', 'quick_pass_api');
            }}
          />
          <label>Client id</label>
        </div>
        {errors?.quick_pass_api?.secret_key && (
          <div className="error">
            <p>{errors?.quick_pass_api?.secret_key}</p>
          </div>
        )}
      </div>
      <div className="form-field checkbox w-100 m-0">
        <span className="toggle-text">Allow Emails</span>
        <label htmlFor="toggle1" className="switch">
          <input
            type="checkbox"
            id="toggle1"
            className="toggle-input"
            checked={addTenant?.allow_email}
            name="allow_email"
            onChange={(e) => {
              handleFormInput(e, 'allow_email');
            }}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <p className="text-secondary">
        This will enable/disable routing the emails for each action performed on
        the Portal.
      </p>
    </div>
  );
};

export default AddConfigurations;
