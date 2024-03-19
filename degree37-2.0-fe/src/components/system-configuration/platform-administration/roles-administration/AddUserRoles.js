import React, { useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './AddUserRoles.module.scss';

const AddUserRoles = () => {
  const navigate = useNavigate();

  const [checkboxState, setCheckboxState] = useState({
    system_configuration: false,
    organizational_administration: false,
    hierarchy: false,
    organizational_levels: false,
    business_units: false,
    goals: false,
    monthly_goals: false,
    daily_goals_allocation: false,
    daily_goals_calender: false,
    performance_rules: false,
    product_procedures: false,
    product: false,
    procedures: false,
    procedures_types: false,
    resources: false,
    geo_administration: false,
    call_center_administration: false,
    crm_administration: false,
    operation_administration: false,
    staffin_administration: false,
    users_administration: false,
    crm: false,
    flow: false,
    call_center_management: false,
    operations_center: false,
    staffing_management: false,
    reports: false,
    donor_portal: false,
    chairperson_portal: false,
  });
  const [errors, setErrors] = useState({ role_name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleCheckboxClick = (checkboxName) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName],
    }));
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'role_name') {
      if (value.length > 50) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          role_name: 'Maximum 50 characters are allowed',
        }));
      } else {
        setErrors({});
      }
    }
  };

  const BreadcrumbsData = [
    { label: 'System Configurations', class: 'disable-label', link: '/' },
    {
      label: 'User Administration',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/roles',
    },
    {
      label: 'Create User Role',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/roles/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Create User Role'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.addUserRoles}>
          <div className="formGroup">
            <h5>Create User Roles</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="role_name"
                  placeholder=" "
                  required
                  onChange={inputHandler}
                />

                <label>Role Name</label>
                {errors.role_name && (
                  <div className="error">
                    <p>{errors.role_name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="form-field w-100">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Role Details (Optional)"
                  name="role_details"
                />
              </div>
            </div>
            <div className="form-field checkbox">
              <span className="toggle-text">Active/Inactive</span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className={`${styles.permissions} formGroup`}>
            <h5>Permissions</h5>
            <div className={`${styles.group} w-100`}>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">System Configuration</span>
                <label htmlFor="system_configuration" className="switch">
                  <input
                    type="checkbox"
                    id="system_configuration"
                    className="toggle-input"
                    name="system_configuration"
                    checked={checkboxState.system_configuration}
                    onChange={() => handleCheckboxClick('system_configuration')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div
                className={`${
                  checkboxState.system_configuration ? styles.show : styles.hide
                } ${styles.innerChild} w-100`}
              >
                <div className={styles.group}>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">
                      Organizational Administration
                    </span>
                    <label
                      htmlFor="organizational_administration"
                      className="switch"
                    >
                      <input
                        type="checkbox"
                        id="organizational_administration"
                        className="toggle-input"
                        name="organizational_administration"
                        checked={checkboxState.organizational_administration}
                        onChange={() =>
                          handleCheckboxClick('organizational_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div
                    className={`${
                      checkboxState.organizational_administration
                        ? styles.show
                        : styles.hide
                    } ${styles.innerChild} w-100`}
                  >
                    <div className={styles.group}>
                      <div className="form-field checkbox w-100">
                        <span className="toggle-text">Hierarchy</span>
                        <label htmlFor="hierarchy" className="switch">
                          <input
                            type="checkbox"
                            id="hierarchy"
                            className="toggle-input"
                            name="hierarchy"
                            checked={checkboxState.hierarchy}
                            onChange={() => handleCheckboxClick('hierarchy')}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div
                        className={`${
                          checkboxState.hierarchy ? styles.show : styles.hide
                        } ${styles.innerChild} w-100`}
                      >
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">
                              Organizational Levels
                            </span>
                            <label
                              htmlFor="organizational_levels"
                              className="switch"
                            >
                              <input
                                type="checkbox"
                                id="organizational_levels"
                                className="toggle-input"
                                name="organizational_levels"
                                checked={checkboxState.organizational_levels}
                                onChange={() =>
                                  handleCheckboxClick('organizational_levels')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={styles.checkBoxRow}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.organizational_levels
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.organizational_levels
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.organizational_levels
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">Business Units</span>
                            <label htmlFor="business_units" className="switch">
                              <input
                                type="checkbox"
                                id="business_units"
                                className="toggle-input"
                                name="business_units"
                                checked={checkboxState.business_units}
                                onChange={() =>
                                  handleCheckboxClick('business_units')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.business_units ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.business_units ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.business_units ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-field checkbox w-100">
                        <span className="toggle-text">Goals</span>
                        <label htmlFor="goals" className="switch">
                          <input
                            type="checkbox"
                            id="goals"
                            className="toggle-input"
                            name="goals"
                            checked={checkboxState.goals}
                            onChange={() => handleCheckboxClick('goals')}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div
                        className={`${
                          checkboxState.goals ? styles.show : styles.hide
                        } ${styles.innerChild} w-100`}
                      >
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">Monthly Goals</span>
                            <label htmlFor="monthly_goals" className="switch">
                              <input
                                type="checkbox"
                                id="monthly_goals"
                                className="toggle-input"
                                name="monthly_goals"
                                checked={checkboxState.monthly_goals}
                                onChange={() =>
                                  handleCheckboxClick('monthly_goals')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={styles.checkBoxRow}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.monthly_goals ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.monthly_goals ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.monthly_goals ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">
                              Daily Goals Allocation
                            </span>
                            <label
                              htmlFor="daily_goals_allocation"
                              className="switch"
                            >
                              <input
                                type="checkbox"
                                id="daily_goals_allocation"
                                className="toggle-input"
                                name="daily_goals_allocation"
                                checked={checkboxState.daily_goals_allocation}
                                onChange={() =>
                                  handleCheckboxClick('daily_goals_allocation')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_allocation
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_allocation
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_allocation
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">
                              Daily Goals Calender
                            </span>
                            <label
                              htmlFor="daily_goals_calender"
                              className="switch"
                            >
                              <input
                                type="checkbox"
                                id="daily_goals_calender"
                                className="toggle-input"
                                name="daily_goals_calender"
                                checked={checkboxState.daily_goals_calender}
                                onChange={() =>
                                  handleCheckboxClick('daily_goals_calender')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_calender
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_calender
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.daily_goals_calender
                                    ? false
                                    : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">
                              Performance Rules
                            </span>
                            <label
                              htmlFor="performance_rules"
                              className="switch"
                            >
                              <input
                                type="checkbox"
                                id="performance_rules"
                                className="toggle-input"
                                name="performance_rules"
                                checked={checkboxState.performance_rules}
                                onChange={() =>
                                  handleCheckboxClick('performance_rules')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.performance_rules ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.performance_rules ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.performance_rules ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-field checkbox w-100">
                        <span className="toggle-text">
                          Product & Procedures
                        </span>
                        <label htmlFor="product_procedures" className="switch">
                          <input
                            type="checkbox"
                            id="product_procedures"
                            className="toggle-input"
                            name="product_procedures"
                            checked={checkboxState.product_procedures}
                            onChange={() =>
                              handleCheckboxClick('product_procedures')
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      <div
                        className={`${
                          checkboxState.product_procedures
                            ? styles.show
                            : styles.hide
                        } ${styles.innerChild} w-100`}
                      >
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">Product</span>
                            <label htmlFor="product" className="switch">
                              <input
                                type="checkbox"
                                id="product"
                                className="toggle-input"
                                name="product"
                                checked={checkboxState.product}
                                onChange={() => handleCheckboxClick('product')}
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={styles.checkBoxRow}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={checkboxState.product ? false : true}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={checkboxState.product ? false : true}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={checkboxState.product ? false : true}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">Procedures</span>
                            <label htmlFor="procedures" className="switch">
                              <input
                                type="checkbox"
                                id="procedures"
                                className="toggle-input"
                                name="procedures"
                                checked={checkboxState.procedures}
                                onChange={() =>
                                  handleCheckboxClick('procedures')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${styles.group} ${styles.withCheckbox}`}
                        >
                          <div className="form-field checkbox">
                            <span className="toggle-text">
                              Procedures Types
                            </span>
                            <label
                              htmlFor="procedures_types"
                              className="switch"
                            >
                              <input
                                type="checkbox"
                                id="procedures_types"
                                className="toggle-input"
                                name="procedures_types"
                                checked={checkboxState.procedures_types}
                                onChange={() =>
                                  handleCheckboxClick('procedures_types')
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                          <div className={`${styles.checkBoxRow}`}>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures_types ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Read
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures_types ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Write
                              </label>
                            </div>
                            <div className="form-field checkbox">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={
                                  checkboxState.procedures_types ? false : true
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Archive
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-field checkbox w-100">
                        <span className="toggle-text">Resources</span>
                        <label htmlFor="resources" className="switch">
                          <input
                            type="checkbox"
                            id="resources"
                            className="toggle-input"
                            name="resources"
                            checked={checkboxState.resources}
                            onChange={() => handleCheckboxClick('resources')}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">Geo Administraion</span>
                    <label htmlFor="geo_administration" className="switch">
                      <input
                        type="checkbox"
                        id="geo_administration"
                        className="toggle-input"
                        name="geo_administration"
                        checked={checkboxState.geo_administration}
                        onChange={() =>
                          handleCheckboxClick('geo_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">
                      Call Center Administration
                    </span>
                    <label
                      htmlFor="call_center_administration"
                      className="switch"
                    >
                      <input
                        type="checkbox"
                        id="call_center_administration"
                        className="toggle-input"
                        name="call_center_administration"
                        checked={checkboxState.call_center_administration}
                        onChange={() =>
                          handleCheckboxClick('call_center_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">CRM Administration</span>
                    <label htmlFor="crm_administration" className="switch">
                      <input
                        type="checkbox"
                        id="crm_administration"
                        className="toggle-input"
                        name="crm_administration"
                        checked={checkboxState.crm_administration}
                        onChange={() =>
                          handleCheckboxClick('crm_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">
                      Operation Administration
                    </span>
                    <label
                      htmlFor="operation_administration"
                      className="switch"
                    >
                      <input
                        type="checkbox"
                        id="operation_administration"
                        className="toggle-input"
                        name="operation_administration"
                        checked={checkboxState.operation_administration}
                        onChange={() =>
                          handleCheckboxClick('operation_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">Staffing Administration</span>
                    <label htmlFor="staffin_administration" className="switch">
                      <input
                        type="checkbox"
                        id="staffin_administration"
                        className="toggle-input"
                        name="staffin_administration"
                        checked={checkboxState.staffin_administration}
                        onChange={() =>
                          handleCheckboxClick('staffin_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="form-field checkbox w-100">
                    <span className="toggle-text">Users Administration</span>
                    <label htmlFor="users_administration" className="switch">
                      <input
                        type="checkbox"
                        id="users_administration"
                        className="toggle-input"
                        name="users_administration"
                        checked={checkboxState.users_administration}
                        onChange={() =>
                          handleCheckboxClick('users_administration')
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">CRM</span>
                <label htmlFor="crm" className="switch">
                  <input
                    type="checkbox"
                    id="crm"
                    className="toggle-input"
                    name="crm"
                    checked={checkboxState.crm}
                    onChange={() => handleCheckboxClick('crm')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Flow</span>
                <label htmlFor="flow" className="switch">
                  <input
                    type="checkbox"
                    id="flow"
                    className="toggle-input"
                    name="flow"
                    checked={checkboxState.flow}
                    onChange={() => handleCheckboxClick('flow')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Call Center Management</span>
                <label htmlFor="call_center_management" className="switch">
                  <input
                    type="checkbox"
                    id="call_center_management"
                    className="toggle-input"
                    name="call_center_management"
                    checked={checkboxState.call_center_management}
                    onChange={() =>
                      handleCheckboxClick('call_center_management')
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Operations Center</span>
                <label htmlFor="operations_center" className="switch">
                  <input
                    type="checkbox"
                    id="operations_center"
                    className="toggle-input"
                    name="operations_center"
                    checked={checkboxState.operations_center}
                    onChange={() => handleCheckboxClick('operations_center')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Staffing Management</span>
                <label htmlFor="staffing_management" className="switch">
                  <input
                    type="checkbox"
                    id="staffing_management"
                    className="toggle-input"
                    name="staffing_management"
                    checked={checkboxState.staffing_management}
                    onChange={() => handleCheckboxClick('staffing_management')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Reports</span>
                <label htmlFor="reports" className="switch">
                  <input
                    type="checkbox"
                    id="reports"
                    className="toggle-input"
                    name="reports"
                    checked={checkboxState.reports}
                    onChange={() => handleCheckboxClick('reports')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Donor Portal</span>
                <label htmlFor="donor_portal" className="switch">
                  <input
                    type="checkbox"
                    id="donor_portal"
                    className="toggle-input"
                    name="donor_portal"
                    checked={checkboxState.donor_portal}
                    onChange={() => handleCheckboxClick('donor_portal')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="form-field checkbox w-100">
                <span className="toggle-text">Chairperson Portal</span>
                <label htmlFor="chairperson_portal" className="switch">
                  <input
                    type="checkbox"
                    id="chairperson_portal"
                    className="toggle-input"
                    name="chairperson_portal"
                    checked={checkboxState.chairperson_portal}
                    onChange={() => handleCheckboxClick('chairperson_portal')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </form>
        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/system-configuration/tenant-admin/roles')}
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

export default AddUserRoles;
