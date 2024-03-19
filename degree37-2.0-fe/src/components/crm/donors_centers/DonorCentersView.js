import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../common/topbar/index';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import SvgComponent from '../../common/SvgComponent';
import styles from './index.module.scss';
import { formatDate } from '../../../helpers/formatDate';
import { formatUser } from '../../../helpers/formatUser';
import TopTabsDonorCenters from './topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from './DonorCentersBreadCrumbsData';
import { removeCountyWord } from '../../../helpers/utils';

const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  return keys.reduce((result, key) => result[key] || 'N/A', obj);
};

function DonorCentersView({ id }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'About',
      class: 'disable-label',
      link: '#',
    },
  ];

  const config = [
    {
      section: 'About',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Alternate Name', field: 'alternate_name' },
        { label: 'Physical Address', field: 'physical_address' },
        { label: 'County', field: 'county' },
        { label: 'Phone', field: 'phone' },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        { label: 'BECS Code', field: 'code' },
        { label: 'Staging Facility', field: 'staging_site' },
        { label: 'Collection Operation', field: 'collection_operation.name' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
        },
        {
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];

  const fetchDonorCenter = async (filters) => {
    try {
      setIsLoading(true);
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/facilities/${id}`
      );
      const data = await response.json();
      const donorCenterData = {
        ...data[0],
        modified_by: data.modified_by,
        modified_at: data.modified_at,
        county: removeCountyWord(data[0]?.address.county),
        country: data[0]?.address.city ? data[0]?.address.country : 'N/A',
        physical_address: `${data[0]?.address?.address1 || ''} ${
          data[0]?.address?.address2 || ''
        }, ${data[0]?.address?.city || ''}, ${data[0]?.address?.state || ''} ${
          data[0]?.address?.zip_code || ''
        }`.trim(),
      };
      setData(donorCenterData);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorCenter();
  }, []);
  console.log({ data });
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'About'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <TopTabsDonorCenters donorCenterId={id} />
      <div className="mainContentInner">
        <div className="d-flex flex-direction-row justify-content-between mb-4">
          <div>
            <div
              className={`optionsIcon ${styles.neutral}`}
              aria-expanded="false"
              style={{ color: '#555555' }}
            >
              <SvgComponent name={'Info'} /> Donor Centers are created in System
              Configurations.
            </div>
          </div>
        </div>
        <div className="tableView">
          <div className="tableViewInner">
            {config.map((section) => (
              <div className="group" key={section.section}>
                <div className="group-head">
                  <h2>{section.section}</h2>
                </div>
                <div className="group-body">
                  <ul>
                    {isLoading ? (
                      <li>
                        <span className="right-data d-flex justify-content-center align-items-center">
                          Data Loading
                        </span>
                      </li>
                    ) : (
                      section.fields.map((item) => {
                        return (
                          <li key={item.field}>
                            <span className="left-heading">{item.label}</span>
                            <span
                              className={`right-data ${item.className || ''}`}
                            >
                              {item.field === 'status' ||
                              item.field === 'is_active' ? (
                                data[item.field] ? (
                                  <span className="badge active">Active</span>
                                ) : (
                                  <span className="badge inactive">
                                    Inactive
                                  </span>
                                )
                              ) : item.field === 'staging_site' ? (
                                data?.[item.field] ? (
                                  <span>Yes</span>
                                ) : (
                                  <span>No</span>
                                )
                              ) : item.field === 'created_by' ? (
                                <span>
                                  {formatUser(
                                    data?.created_by ?? data?.created_by
                                  )}{' '}
                                  {formatDate(
                                    data?.created_at ?? data?.created_at
                                  )}
                                </span>
                              ) : item.field === 'updated_by' ? (
                                <span>
                                  {formatUser(
                                    data?.updated_by
                                      ? data?.updated_by
                                      : data?.created_by
                                  )}{' '}
                                  {formatDate(
                                    data?.updated_at ?? data?.updated_at
                                  )}
                                  {formatDate(
                                    data?.modified_at ?? data?.modified_at
                                  )}
                                  {!data?.updated_at && !data?.modified_at && (
                                    <>
                                      {formatDate(
                                        data?.created_at ?? data?.created_at
                                      )}
                                    </>
                                  )}
                                </span>
                              ) : item.field === 'modified_by' ? (
                                <span>
                                  {data?.modified_by
                                    ? formatUser(data?.modified_by, '1')
                                    : formatUser(data?.created_by, '1')}
                                  {data?.modified_at
                                    ? formatDate(data?.modified_at)
                                    : formatDate(data?.created_at)}
                                </span>
                              ) : (
                                getNestedValue(data, item.field)
                              )}
                            </span>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorCentersView;
