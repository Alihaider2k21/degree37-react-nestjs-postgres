import React, { useEffect, useState } from 'react';
import TopTabsNCP from '../topTabsNCP';
import { Link, useParams } from 'react-router-dom';
import {
  CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import ViewForm from '../../../common/ViewForm';
import SvgComponent from '../../../common/SvgComponent';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes.js';

const NonCollectionProfilesViewBlueprints = () => {
  const { nonCollectionProfileId, id } = useParams();
  const [singleNcBluePrint, setSingleNcBluePrint] = useState({});
  const BreadcrumbsData = [
    { label: 'CRM', class: 'disable-label', link: '/crm/accounts' },
    {
      label: 'Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.LIST,
    },
    {
      label: 'View Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.VIEW.replace(
        ':id',
        nonCollectionProfileId
      ),
    },
    {
      label: 'Blueprints',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.LIST.replace(
        ':id',
        nonCollectionProfileId
      ),
    },
    {
      label: 'View Blueprints',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.VIEW.replace(
        ':nonCollectionProfileId',
        nonCollectionProfileId
      ).replace(':id', id),
    },
  ];

  useEffect(() => {
    getData();
  }, [id, nonCollectionProfileId]);

  const getData = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getViewAboutBlueprint(
        id,
        token
      );
      if (data) {
        const modified = {
          ...data?.data,
          blueprint_name: data?.data?.blueprint_name,
          location: data?.data?.location_id?.name,
          default_blueprint: data?.data?.id_default ? 'Yes' : 'No',
          additional_information: data?.data?.additional_info,
          event_hours: `${data?.data?.start_time} - ${data?.data?.end_time}`,
          status: data?.data?.is_active,
        };

        setSingleNcBluePrint(modified);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const config = [
    {
      section: 'Drive Details',
      fields: [
        { label: 'Blueprint Name', field: 'blueprint_name' },
        { label: 'Location', field: 'location' },
        { label: 'Additional Information', field: 'additional_information' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Default Blueprint',
          field: 'default_blueprint',
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
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Blueprints'}
      data={singleNcBluePrint}
      config={config}
      customTopBar={
        <>
          <TopTabsNCP
            NCPID={nonCollectionProfileId}
            buttonRight={
              <div className="buttons">
                <Link
                  to={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.EDIT.replace(
                    ':nonCollectionProfileId',
                    nonCollectionProfileId
                  ).replace(':id', id)}
                  className="d-flex justify-content-center align-items-center"
                >
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
            }
            activePath={id}
          />
          <div className="mainContentInner pb-1">
            <div className={`NotesBar border-separator pb-0`}>
              <div className="d-flex align-items-center h-100">
                <Link
                  className="text-white h-100"
                  to={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.VIEW.replace(
                    ':nonCollectionProfileId',
                    nonCollectionProfileId
                  ).replace(':id', id)}
                >
                  <p className="mb-0 activeNotes" style={{ padding: '0 20px' }}>
                    About
                  </p>
                </Link>

                <Link
                  className="text-white h-100 ms-2"
                  to={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.SHIFT_DETAILS.replace(
                    ':nonCollectionProfileId',
                    nonCollectionProfileId
                  ).replace(':id', id)}
                >
                  <p className="mb-0" style={{ padding: '0 20px' }}>
                    Shift Details
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default NonCollectionProfilesViewBlueprints;
