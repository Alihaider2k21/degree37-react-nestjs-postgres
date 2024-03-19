import React, { useEffect, useState } from 'react';
import TopTabsNCP from '../topTabsNCP';
import { Link, useParams } from 'react-router-dom';
import {
  CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import ViewForm from '../../../common/ViewForm';
import SvgComponent from '../../../common/SvgComponent';
import Styles from './index.module.scss';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes.js';
import moment from 'moment';

const NonCollectionProfilesShiftDetailsBlueprints = () => {
  const { nonCollectionProfileId, id } = useParams();
  const [selectedShift, setSelectedShift] = useState(1);
  const [shiftDetails, setShiftDetails] = useState([]);
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
      label: 'Shift Details',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.SHIFT_DETAILS.replace(
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
      const { data } =
        await API.nonCollectionProfiles.getViewShiftDetailsBlueprint(id, token);
      if (data) {
        const modified = data?.data?.map((item) => {
          return {
            devices: item?.shiftDevices?.map(
              (el, index) =>
                `${el?.device?.name}${
                  index === item?.shiftDevices?.length - 1 ? '' : ', '
                }`
            ),

            vehicles: item?.shiftVehicles?.map(
              (el, index) =>
                `${el?.vehicle?.name}${
                  index === item?.shiftVehicles?.length - 1 ? '' : ', '
                }`
            ),
            staff: item?.shiftRoles?.map(
              (el, index) =>
                `${el?.role?.name}${
                  index === item?.shiftRoles?.length - 1 ? '' : ', '
                }`
            ),

            start_time: `${moment(item?.start_time, 'hh:mm A')
              .utc(item?.start_time)
              .local()
              .format('hh:mm A')}`,
            end_time: `${moment(item?.end_time, 'hh:mm A')
              .utc(item?.end_time)
              .local()
              .format('hh:mm A')}`,
            staff_break: {
              start_time: item?.break_start_time
                ? `${moment(item?.break_start_time, 'hh:mm A')
                    .utc(item?.break_start_time)
                    .local()
                    .format('hh:mm A')}`
                : '',
              end_time: item?.break_end_time
                ? `${moment(item?.break_end_time, 'hh:mm A')
                    .utc(item?.break_end_time)
                    .local()
                    .format('hh:mm A')}`
                : '',
            },
            status: item?.is_active,
          };
        });
        setShiftDetails(modified);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const config = [
    {
      section: 'Shift Details',
      fields: [
        { label: 'Start Time', field: 'start_time' },
        { label: 'End Time', field: 'end_time' },
      ],
    },
    {
      section: 'Resources',
      fields: [
        {
          label: 'Staff',
          field: 'staff',
        },
        {
          label: 'Vehicles',
          field: 'vehicles',
        },
        {
          label: 'devices',
          field: 'devices',
        },
      ],
    },
    {
      section: 'Staff Break',
      fields: [
        { label: 'Start Time', field: 'staff_break.start_time' },
        { label: 'End Time', field: 'staff_break.end_time' },
      ],
    },
  ];
  useEffect(() => {
    setSelectedShift(1);
  }, []);
  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Blueprints'}
      data={shiftDetails[selectedShift - 1]}
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
                  <p className="mb-0" style={{ padding: '0 20px' }}>
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
                  <p className="mb-0 activeNotes" style={{ padding: '0 20px' }}>
                    Shift Details
                  </p>
                </Link>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <h5
                  className="text m-0 p-0 me-1"
                  style={{ fontWeight: '400', fontSize: 20 }}
                >
                  Shift
                </h5>
                {shiftDetails?.map((entry, index) => (
                  <button
                    key={index}
                    style={{ marginLeft: '0.5rem' }}
                    className={
                      index === selectedShift - 1
                        ? Styles.pageCardactive
                        : Styles.pageCard
                    }
                    onClick={() => {
                      if (index === selectedShift - 1) return;
                      setSelectedShift(index + 1);
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default NonCollectionProfilesShiftDetailsBlueprints;
