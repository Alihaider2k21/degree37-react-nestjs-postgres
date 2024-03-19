import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import MarketingEquipmentNavigation from '../Navigation';
import styles from './approvals.module.scss';
import { fetchData } from '../../../../../../helpers/Api';
import ToolTip from '../../../../../common/tooltip/index';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const Approvals = () => {
  const [checkboxValues, setCheckboxValues] = useState({
    email: false,
    marketing_materials: false,
    promotional_items: false,
    sms_texting: false,
    tele_recruitment: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataa();
  }, []);

  const handleAddClick = () => {
    navigate(
      '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals/edit'
    );
  };

  const fetchDataa = async () => {
    try {
      let data = await fetchData('/marketing-equipment/approvals', 'GET');
      data = data.data;
      if (data) {
        setCheckboxValues(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'Set Approvals',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals',
    },
  ];

  return (
    <div className="mainContent">
      <style>{`.form-check-input:disabled~.form-check-label, .form-check-input[disabled]~.form-check-label {
    cursor: default;
    opacity: 1 !important;
}
`}</style>
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Approvals'}
      />
      <div className="filterBar">
        <MarketingEquipmentNavigation />
      </div>

      <div className="mainContentInner">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.APPROVALS
            .WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Set Approvals
            </button>
          </div>
        )}
        <form className={styles.bookingRule}>
          <div style={{ width: 660 }} className="formGroup">
            <div style={{ display: 'flex' }}>
              <h5 className="pe-2"> Set Approvals </h5>

              <ToolTip text="Indicate which items require manager approval. If checked, the order status will show 'Pending' until approved. If not checked, the order status will move directly to 'Approved'." />
            </div>
            <div className={`${styles.group} w-100`}>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.promotional_items}
                  disabled={true}
                  required
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Promotional Items
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.sms_texting}
                  disabled={true}
                  required
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  SMS Texting
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.tele_recruitment}
                  disabled={true}
                  required
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Telerecruitment
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.marketing_materials}
                  disabled={true}
                  required
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Marketing Materials
                </label>
              </div>
              <div className={`form-field checkbox br ${styles.mb6}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="procedure_name"
                  checked={checkboxValues?.email}
                  disabled={true}
                  required
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Email
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Approvals;
