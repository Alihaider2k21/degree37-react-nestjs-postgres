import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import MarketingEquipmentNavigation from '../Navigation';
import styles from './approvals.module.scss';
import SuccessPopUpModal from '../../../../../common/successModal/index';
import CancelPopUpModal from '../../../../../common/cancelModal/index';

import { fetchData } from '../../../../../../helpers/Api';
import ToolTip from '../../../../../common/tooltip/index';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';

const EditApprovals = () => {
  const [checkboxValues, setCheckboxValues] = useState({
    email: false,
    marketing_materials: false,
    promotional_items: false,
    sms_texting: false,
    tele_recruitment: false,
  });
  const [changed, setChanged] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);

  const [open, setOpen] = useState(false);
  const [approval, setApproval] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataa();
  }, []);

  const handleCheckboxChange = (event) => {
    const checkboxId = event.target.id;
    const isChecked = event.target.checked;

    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkboxId]: isChecked,
    }));
    setChanged(true);
  };
  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchData(
        '/marketing-equipment/approvals',
        approval ? 'PUT' : 'POST',
        checkboxValues
      );
      console.log(response, 'res');
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDataa = async () => {
    try {
      let data = await fetchData('/marketing-equipment/approvals', 'GET');
      data = data.data;
      if (data) {
        setApproval(true);
        setCheckboxValues(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (changed) {
      setCancel(true);
    } else navigate(-1);
  };
  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Edit Approvals',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals/edit',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Approvals'}
      />
      <div className="filterBar">
        <MarketingEquipmentNavigation />
      </div>

      <div className="mainContentInner">
        <form className={styles.bookingRule}>
          <div style={{ width: 660 }} className="formGroup">
            <div style={{ display: 'flex' }}>
              <h5 className="pe-2">{approval ? 'Edit' : 'Set'} Approvals </h5>

              <ToolTip text="Indicate which items require manager approval. If checked, the order status will show 'Pending' until approved. If not checked, the order status will move directly to 'Approved'." />
            </div>
            <div className={`${styles.group} w-100`}>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  id="promotional_items"
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.promotional_items}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Promotional Items
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  id="sms_texting"
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                  checked={checkboxValues?.sms_texting}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  SMS Texting
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  id="tele_recruitment"
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                  checked={checkboxValues?.tele_recruitment}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Telerecruitment
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  id="marketing_materials"
                  onChange={handleCheckboxChange}
                  className="form-check-input"
                  checked={checkboxValues?.marketing_materials}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Marketing Materials
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  id="email"
                  className="form-check-input"
                  onChange={handleCheckboxChange}
                  checked={checkboxValues?.email}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Email
                </label>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button
              className="btn btn-secondary border-0"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={(e) => {
                setOpen(true);

                handleChange(e);
              }}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
        <CancelPopUpModal
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={cancel}
          isNavigate={true}
          setModalPopUp={setCancel}
          redirectPath={-1}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Approvals updated."
          modalPopUp={open}
          isNavigate={true}
          setModalPopUp={setOpen}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals'
          }
        />
      </div>
    </div>
  );
};

export default EditApprovals;
