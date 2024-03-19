import React, { useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './addAdminRole.module.scss';

const AddAdminRoles = () => {
  const navigate = useNavigate();

  const [checkboxState, setCheckboxState] = useState({
    dashboard_read: false,
    dashboard_write: false,
    dashboard_archive: false,
    tenants_onboarding_read: false,
    tenants_onboarding_write: false,
    tenants_onboarding_archive: false,
    tm_read: false,
    tm_write: false,
    tm_archive: false,
    liat_read: false,
    liat_write: false,
    liat_archive: false,
    pl_read: false,
    pl_write: false,
    pl_archive: false,
    ua_read: false,
    ua_write: false,
    ua_archive: false,
    ra_read: false,
    ra_write: false,
    ra_archive: false,
    laem_read: false,
    laem_write: false,
    laem_archive: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleCheckboxClick = (checkboxName) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName],
    }));
  };

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'Roles Administration',
      class: 'active-label',
      link: '/',
    },
    {
      label: 'Create New Role',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/roles/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Create New Role'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Create New Role</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="role_name"
                  placeholder=" "
                  required
                />

                <label>Role Name</label>
              </div>
            </div>
            <div className="form-field w-100">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder="Role Details (Optional)"
                  name="role_details"
                />
              </div>
            </div>
            <h5>Permissions Legend</h5>
            <h6>Read</h6>
            <p>View listing, searching, details and etc.</p>
            <h6>Write</h6>
            <p>Add, Update operation.</p>
            <h6>Archive</h6>
            <p>Archive item/object.</p>
          </div>

          <div className={`${styles.permissions} formGroup`}>
            <h5>Permissions</h5>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Dashboard</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="dashboard_read" className="switch">
                      <input
                        type="checkbox"
                        id="dashboard_read"
                        className="toggle-input"
                        name="dashboard_read"
                        checked={checkboxState.dashboard_read}
                        onChange={() => handleCheckboxClick('dashboard_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="dashboard_write" className="switch">
                      <input
                        type="checkbox"
                        id="dashboard_write"
                        className="toggle-input"
                        name="dashboard_write"
                        checked={checkboxState.dashboard_write}
                        onChange={() => handleCheckboxClick('dashboard_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="dashboard_archive" className="switch">
                      <input
                        type="checkbox"
                        id="dashboard_archive"
                        className="toggle-input"
                        name="dashboard_archive"
                        checked={checkboxState.dashboard_archive}
                        onChange={() =>
                          handleCheckboxClick('dashboard_archive')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Tenants Onboarding</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="tenants_onboarding_read" className="switch">
                      <input
                        type="checkbox"
                        id="tenants_onboarding_read"
                        className="toggle-input"
                        name="tenants_onboarding_read"
                        checked={checkboxState.tenants_onboarding_read}
                        onChange={() =>
                          handleCheckboxClick('tenants_onboarding_read')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label
                      htmlFor="tenants_onboarding_write"
                      className="switch"
                    >
                      <input
                        type="checkbox"
                        id="tenants_onboarding_write"
                        className="toggle-input"
                        name="tenants_onboarding_write"
                        checked={checkboxState.tenants_onboarding_write}
                        onChange={() =>
                          handleCheckboxClick('tenants_onboarding_write')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label
                      htmlFor="tenants_onboarding_archive"
                      className="switch"
                    >
                      <input
                        type="checkbox"
                        id="tenants_onboarding_archive"
                        className="toggle-input"
                        name="tenants_onboarding_archive"
                        checked={checkboxState.tenants_onboarding_archive}
                        onChange={() =>
                          handleCheckboxClick('tenants_onboarding_archive')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Tenant Management</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="tm_read" className="switch">
                      <input
                        type="checkbox"
                        id="tm_read"
                        className="toggle-input"
                        name="tm_read"
                        checked={checkboxState.tm_read}
                        onChange={() => handleCheckboxClick('tm_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="tm_write" className="switch">
                      <input
                        type="checkbox"
                        id="tm_write"
                        className="toggle-input"
                        name="tm_write"
                        checked={checkboxState.tm_write}
                        onChange={() => handleCheckboxClick('tm_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="tm_archive" className="switch">
                      <input
                        type="checkbox"
                        id="tm_archive"
                        className="toggle-input"
                        name="tm_archive"
                        checked={checkboxState.tm_archive}
                        onChange={() => handleCheckboxClick('tm_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Log in as tenant</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="liat_read" className="switch">
                      <input
                        type="checkbox"
                        id="liat_read"
                        className="toggle-input"
                        name="liat_read"
                        checked={checkboxState.liat_read}
                        onChange={() => handleCheckboxClick('liat_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="liat_write" className="switch">
                      <input
                        type="checkbox"
                        id="liat_write"
                        className="toggle-input"
                        name="liat_write"
                        checked={checkboxState.liat_write}
                        onChange={() => handleCheckboxClick('liat_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="liat_archive" className="switch">
                      <input
                        type="checkbox"
                        id="liat_archive"
                        className="toggle-input"
                        name="liat_archive"
                        checked={checkboxState.liat_archive}
                        onChange={() => handleCheckboxClick('liat_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Product Licensing</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="pl_read" className="switch">
                      <input
                        type="checkbox"
                        id="pl_read"
                        className="toggle-input"
                        name="pl_read"
                        checked={checkboxState.pl_read}
                        onChange={() => handleCheckboxClick('pl_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="pl_write" className="switch">
                      <input
                        type="checkbox"
                        id="pl_write"
                        className="toggle-input"
                        name="pl_write"
                        checked={checkboxState.pl_write}
                        onChange={() => handleCheckboxClick('pl_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="pl_archive" className="switch">
                      <input
                        type="checkbox"
                        id="pl_archive"
                        className="toggle-input"
                        name="pl_archive"
                        checked={checkboxState.pl_archive}
                        onChange={() => handleCheckboxClick('pl_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">User Administration</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="ua_read" className="switch">
                      <input
                        type="checkbox"
                        id="ua_read"
                        className="toggle-input"
                        name="ua_read"
                        checked={checkboxState.ua_read}
                        onChange={() => handleCheckboxClick('ua_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="ua_write" className="switch">
                      <input
                        type="checkbox"
                        id="ua_write"
                        className="toggle-input"
                        name="ua_write"
                        checked={checkboxState.ua_write}
                        onChange={() => handleCheckboxClick('ua_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="ua_archive" className="switch">
                      <input
                        type="checkbox"
                        id="ua_archive"
                        className="toggle-input"
                        name="ua_archive"
                        checked={checkboxState.ua_archive}
                        onChange={() => handleCheckboxClick('ua_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Roles Administration</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="ra_read" className="switch">
                      <input
                        type="checkbox"
                        id="ra_read"
                        className="toggle-input"
                        name="ra_read"
                        checked={checkboxState.ra_read}
                        onChange={() => handleCheckboxClick('ra_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="ra_write" className="switch">
                      <input
                        type="checkbox"
                        id="ra_write"
                        className="toggle-input"
                        name="ra_write"
                        checked={checkboxState.ra_write}
                        onChange={() => handleCheckboxClick('ra_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="ra_archive" className="switch">
                      <input
                        type="checkbox"
                        id="ra_archive"
                        className="toggle-input"
                        name="ra_archive"
                        checked={checkboxState.ra_archive}
                        onChange={() => handleCheckboxClick('ra_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-100">
              <div className={styles.group}>
                <div className="form-field checkbox">
                  <span className="toggle-text">Log and Event Management</span>
                </div>
                <div className={styles.toggleRow}>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Read</span>
                    <label htmlFor="laem_read" className="switch">
                      <input
                        type="checkbox"
                        id="laem_read"
                        className="toggle-input"
                        name="laem_read"
                        checked={checkboxState.laem_read}
                        onChange={() => handleCheckboxClick('laem_read')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Write</span>
                    <label htmlFor="laem_write" className="switch">
                      <input
                        type="checkbox"
                        id="laem_write"
                        className="toggle-input"
                        name="laem_write"
                        checked={checkboxState.laem_write}
                        onChange={() => handleCheckboxClick('laem_write')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox">
                    <span className="toggle-text">Archive</span>
                    <label htmlFor="laem_archive" className="switch">
                      <input
                        type="checkbox"
                        id="laem_archive"
                        className="toggle-input"
                        name="laem_archive"
                        checked={checkboxState.laem_archive}
                        onChange={() => handleCheckboxClick('laem_archive')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate('/system-configuration/platform-admin/tenant-management')
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminRoles;
