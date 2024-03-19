import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { dateFormat, formatDate } from '../../../../../../helpers/formatDate';
import { formatUser } from '../../../../../../helpers/formatUser';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewSingleEquipment = () => {
  const { id } = useParams();
  const [equipmentData, setEquipmentData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    console.log('Rendered');
    const getData = async (id) => {
      if (id) {
        const result = await fetch(
          `${BASE_URL}/marketing-equipment/equipment/${id}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        let { data, status } = await result.json();
        if ((result.ok || result.status === 200) & (status === 200)) {
          setEquipmentData(data);
        } else {
          toast.error('Error Fetching Equipment Details', {
            autoClose: 3000,
          });
        }
      } else {
        toast.error('Error getting Equipment Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, []);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'View Equipment',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/view/${id}`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Equipment'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
              .EQUIPMENTS.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/edit/${id}`}
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Equipment Details</h2>
              </div>
              <div className="group-body">
                <ul>
                  <li>
                    <span className="left-heading">Name</span>
                    <span className="right-data">{equipmentData?.name}</span>
                  </li>
                  <li>
                    <span className="left-heading">Short Name</span>
                    <span className="right-data">
                      {equipmentData?.short_name}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Description</span>
                    <span
                      className="right-data"
                      style={{
                        // 'text-align': 'justify',
                        wordBreak: 'break-word',
                      }}
                    >
                      {equipmentData?.description}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Type</span>
                    <span className="right-data">{equipmentData?.type}</span>
                  </li>
                  <li>
                    <span className="left-heading">Retire on</span>
                    <span className="right-data">
                      {dateFormat(equipmentData?.retire_on, 2)}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Collection Operation</span>
                    <span className="right-data">
                      {equipmentData?.collectionOperations?.map(
                        (operation, index) => (
                          <React.Fragment key={operation.id}>
                            {operation.collection_operation_name}
                            {index !==
                              equipmentData.collectionOperations.length - 1 &&
                              ', '}
                          </React.Fragment>
                        )
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              <div className="group-body">
                <ul>
                  <li>
                    <span className="left-heading">Status</span>
                    <span className="right-data">
                      {equipmentData?.is_active || equipmentData?.status ? (
                        <span className="badge active"> Active </span>
                      ) : (
                        <span className="badge inactive"> Inactive </span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Created by</span>
                    <span className="right-data">
                      {formatUser(equipmentData?.created_by)}
                      {formatDate(equipmentData?.created_at)}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading">Modified</span>
                    <span className="right-data">
                      {formatUser(
                        equipmentData?.modified_by
                          ? equipmentData?.modified_by
                          : equipmentData?.created_by
                      )}
                      {formatDate(
                        equipmentData?.modified_at
                          ? equipmentData?.modified_at
                          : equipmentData?.created_at
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleEquipment;
