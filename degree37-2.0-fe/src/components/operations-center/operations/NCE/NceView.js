import React, { useEffect, useState } from 'react';
// import TopTabsNCP from '../topTabsNCP';
import { Link, useNavigate, useParams } from 'react-router-dom';
import // CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
// CRM_NON_COLLECTION_PROFILES_PATH,
'../../../../routes/path';
// import ViewForm from '../../../common/ViewForm';
import SvgComponent from '../../../common/SvgComponent';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes.js';
import TopTabsNce from './TopTabsNce';
import ViewForm from './ViewForm';
import { formatUser } from '../../../../helpers/formatUser';
import { formatDate } from '../../../../helpers/formatDate';
import moment from 'moment';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/OcPermissionsEnum.js';

const NceView = () => {
  const { id } = useParams();
  const [singleNcBluePrint, setSingleNcBluePrint] = useState({});
  const navigate = useNavigate();
  const BreadcrumbsData = [
    {
      label: 'Operation Center',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: '#',
    },
    {
      label: 'Non-Collection Event',
      class: 'active-label',
      link: '/operations-center/operations/non-collection-events',
      // link: CRM_NON_COLLECTION_PROFILES_PATH.VIEW.replace(
      //   ':id',
      //   nonCollectionProfileId
      // ),
    },
    {
      label: 'View Non-Collection Event',
      class: 'active-label',
      link: '#',
    },
    {
      label: 'About',
      class: 'active-label',
      link: '#',
    },
  ];

  const getCustomFields = async () => {
    let customFields = [];
    try {
      const response = await API.ocNonCollectionEvents.getCustomFieldData(id);
      customFields = response?.data?.data;
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
    return customFields;
  };
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    const token = localStorage.getItem('token');

    try {
      let customFields = await getCustomFields();
      const { data } = await API.ocNonCollectionEvents.getSingleData(token, id);
      if (data?.status_code === 200) {
        let body = {
          custom_fields: customFields?.map((item) => ({
            label: item.field_id.field_name,
            field: item.field_data,
          })),
          nceEvent_Name: data?.data?.event_name
            ? data?.data?.event_name
            : 'N/A',
          location_id: data?.data?.location_id?.name
            ? data?.data?.location_id?.name
            : 'N/A',
          owner: data?.data?.owner_id
            ? formatUser(data?.data?.owner_id, 1)
            : 'N/A',
          event_hours: data?.data?.min_start_time
            ? `${moment(data?.data?.min_start_time, 'hh:mm A')
                .utc(data?.data?.min_start_time)
                .local()
                .format('hh:mm A')} - ${moment(
                data?.data?.max_end_time,
                'hh:mm A'
              )
                .utc(data?.data?.max_end_time)
                .local()
                .format('hh:mm A')}`
            : 'N/A',
          Non_Collection_Profile: data?.data?.non_collection_profile_id
            ?.profile_name
            ? data?.data?.non_collection_profile_id?.profile_name
            : 'N/A',
          collection_operation: data?.data?.collection_operation_id?.name
            ? data?.data?.collection_operation_id?.name
            : 'N/A',
          status: data?.data?.status_id?.name
            ? data?.data?.status_id?.name
            : 'N/A',
          className: data?.data?.status_id?.chip_color,
          created_by: data?.data?.created_by
            ? `${formatUser(data?.data?.created_by)} ${formatDate(
                data?.data?.created_at
              )}`
            : 'N/A',
          modified_by: data?.data?.modified_by
            ? `${formatUser(data?.data?.modified_by)} ${formatDate(
                data?.data?.modified_at
              )}`
            : `${formatUser(data?.data?.created_by)} ${formatDate(
                data?.data?.created_at
              )}`,
        };
        setSingleNcBluePrint(body);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const config = [
    {
      section: 'NCE Details',
      fields: [
        { label: 'Event Name', field: 'nceEvent_Name' },
        { label: 'Location', field: 'location_id' },
        { label: 'Event Hours', field: 'event_hours' },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        { label: 'Owner', field: 'owner' },
        { label: 'Non Collection Profile', field: 'Non_Collection_Profile' },
        { label: 'Collection Operation', field: 'collection_operation' },
      ],
    },
    {
      section: 'Custom Fields',
      fields: [
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
        { label: 'Lorem Epsem', field: 'Lorem Epsem' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Confirmed' : 'Not Confirmed'),
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

  return (
    <div className="">
      <ViewForm
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'About'}
        data={singleNcBluePrint}
        config={config}
        customTopBar={
          <>
            <TopTabsNce
              NCEID={id}
              buttonRight={
                <div
                  className="buttons position-absolute"
                  style={{ right: 20, bottom: 4 }}
                >
                  <div className="button-icon">
                    {CheckPermission([
                      Permissions.OPERATIONS_CENTER.OPERATIONS
                        .NON_COLLECTION_EVENTS.WRITE,
                    ]) && (
                      <div className="buttons" style={{ marginRight: '20px' }}>
                        <Link
                          to={`/operations-center/operations/non-collection-events/${id}/edit`}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <span className="icon" style={{ marginRight: '3px' }}>
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
                            Edit NCE
                          </p>
                        </Link>
                      </div>
                    )}
                    <button
                      className="btn btn-primary my-3 "
                      onClick={() => navigate('#')}
                    >
                      Schedule Event
                    </button>
                  </div>
                </div>
              }
              activePath={id}
            />
          </>
        }
      />
    </div>
  );
};

export default NceView;
