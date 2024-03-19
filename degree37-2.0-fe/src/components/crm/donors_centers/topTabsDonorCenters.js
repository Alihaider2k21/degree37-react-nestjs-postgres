import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { toast } from 'react-toastify';
import '../../../styles/Global/Global.scss';
import '../../../styles/Global/Variable.scss';
import styles from './index.module.scss';
import {
  CRM_DONORS_CENTERS,
  DONOR_CENTERS_SESSION_HISTORY_PATH,
  DONOR_CENTERS_TASKS_PATH,
} from '../../../routes/path';
import bloodType from '../../../assets/images/bloodType.svg';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import SvgComponent from '../../common/SvgComponent';

const TopTabsDonorCenters = ({
  donorCenterId,
  bluePrintId,
  typeFilter,
  kindFilter,
  hideSession,
  hideSessionHistoryOptions = true,
  onTypeFilter = null,
  onKindFilter = null,
  editIcon = false,
}) => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchDonorCenter = async () => {
      try {
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/system-configuration/facilities/${donorCenterId}`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
      }
    };

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    fetchDonorCenter();
  }, [donorCenterId]);

  const handleTypeFilter = () => {
    const option = typeFilter === 'Percentage' ? 'Numbers' : 'Percentage';
    onTypeFilter && onTypeFilter(option);
  };

  const handleKindFilter = () => {
    const option = kindFilter === 'Procedures' ? 'Products' : 'Procedures';
    onKindFilter && onKindFilter(option);
  };

  return (
    <div className="imageMainContent">
      <div className="d-flex align-items-center gap-3 pb-4 ">
        <img src={bloodType} className="bg-white heroIconImg" alt="ClockIcon" />
        <div className="d-flex flex-column">
          <h4 className="">{data[0]?.name || ''}</h4>
          <span>
            {data[0]?.address?.city || ''}, {data[0]?.address?.state || ''}
          </span>
        </div>
      </div>
      <div className="filterBar p-0 mb-3">
        <div className="flex justify-content-between tabs mb-0 position-relative">
          <div className="border-0">
            <ul>
              <li>
                <Link
                  to={CRM_DONORS_CENTERS.VIEW.replace(':id', donorCenterId)}
                  className={
                    currentLocation ===
                    CRM_DONORS_CENTERS.VIEW.replace(':id', donorCenterId)
                      ? 'active'
                      : ''
                  }
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={CRM_DONORS_CENTERS.BLUEPRINT.replace(
                    ':id',
                    donorCenterId
                  )}
                  className={
                    currentLocation ===
                    CRM_DONORS_CENTERS.BLUEPRINT.replace(':id', donorCenterId)
                      ? 'active'
                      : currentLocation ===
                        CRM_DONORS_CENTERS.BLUEPRINT_VIEW.replace(
                          ':id',
                          donorCenterId
                        ).replace(':blueprintId', bluePrintId)
                      ? 'active'
                      : currentLocation ===
                        CRM_DONORS_CENTERS.BLUEPRINT_VIEW_DETAILS.replace(
                          ':id',
                          donorCenterId
                        ).replace(':blueprintId', bluePrintId)
                      ? 'active'
                      : currentLocation ===
                        CRM_DONORS_CENTERS.BLUEPRINT_VIEW_SCHEDULE.replace(
                          ':id',
                          donorCenterId
                        ).replace(':blueprintId', bluePrintId)
                      ? 'active'
                      : ''
                  }
                >
                  Blueprints
                </Link>
              </li>
              <li>
                <Link
                  to={DONOR_CENTERS_TASKS_PATH.LIST.replace(
                    ':donor_center_id',
                    donorCenterId
                  )}
                  className={
                    currentLocation ===
                    DONOR_CENTERS_TASKS_PATH.LIST.replace(
                      ':donor_center_id',
                      donorCenterId
                    )
                      ? 'active'
                      : ''
                  }
                >
                  Tasks
                </Link>
              </li>
              <li>
                <Link
                  to={`/crm/donor-center/${donorCenterId}/view/documents/notes`}
                  className={
                    currentLocation?.includes(
                      `/crm/donor-center/${donorCenterId}/view/documents/notes`
                    ) ||
                    currentLocation?.includes(
                      `/crm/donor-center/${donorCenterId}/view/documents/attachments`
                    )
                      ? 'active'
                      : ''
                  }
                >
                  Documents
                </Link>
              </li>
              <li>
                <Link
                  to={DONOR_CENTERS_SESSION_HISTORY_PATH.LIST.replace(
                    ':donor_center_id',
                    donorCenterId
                  )}
                  className={
                    currentLocation?.includes(
                      DONOR_CENTERS_SESSION_HISTORY_PATH.LIST.replace(
                        ':donor_center_id',
                        donorCenterId
                      )
                    )
                      ? 'active'
                      : ''
                  }
                >
                  Session History
                </Link>
              </li>
            </ul>
          </div>
          {editIcon ? (
            <div className="buttons">
              <Link className="d-flex justify-content-center align-items-center">
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <p
                  className="text p-0 m-0"
                  style={{
                    fontSize: '14px',
                    color: '#387de5',
                    fontWeight: 400,
                    transition: 'inherit',
                  }}
                >
                  Edit Blueprint
                </p>
              </Link>
            </div>
          ) : (
            !hideSession && (
              <div className="buttons" style={{ marginTop: '-2%' }}>
                <button className="btn btn-primary">Schedule Session</button>
              </div>
            )
          )}

          {!hideSessionHistoryOptions && (
            <div className={`d-flex gap-1 ${styles.sessionHistoryOptions}`}>
              <button onClick={handleTypeFilter}>View as {typeFilter}</button>
              <button onClick={handleKindFilter}>View as {kindFilter}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopTabsDonorCenters;
