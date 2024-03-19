import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import '../index.scss';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import Styles from '../index.module.scss';
import SvgComponent from '../../../../../common/SvgComponent';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { toast } from 'react-toastify';
import moment from 'moment';
import AddSlotModal from './AddSlot';

export default function DonorBluePrintDonorSchedules() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id, blueprintId } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [donorSchedules, setDonorSchedules] = useState(null);
  const [shiftId, setShiftId] = useState(null);
  const [startTimeOption, setStartTimeOption] = useState(null);
  const [endTimeOption, setEndTimeOption] = useState(null);
  const [shiftSlots, setShiftSlots] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [newDonorSchedules, setNewDonorSchedule] = useState(null);
  const [indexId, setIndexId] = useState(0);
  const [donorPortalCheck, setDonorPortalCheck] = useState(false);

  const BreadcrumbsData = [
    {
      label: 'CRM',
      class: 'disable-label',
      link: `/`,
    },
    {
      label: 'Donor Centers',
      class: 'disable-label',
      link: `/crm/donor_center`,
    },
    {
      label: 'View Donors Center',
      class: 'active-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Blueprints',
      class: 'disable-label',
      link: `/crm/donor-centers/${id}/blueprints`,
    },
    {
      label: 'View Blueprints',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/view`,
    },
    {
      label: 'Donor Schedules',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`,
    },
    {
      label: 'Whole Blood',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`,
    },
  ];

  const cancelModal = () => {
    setShowConfirmation(false);
  };

  const submitModal = () => {};

  useEffect(() => {
    getDonorSchedules();
  }, [blueprintId]);

  const getDonorSchedules = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/facility/donor-center/bluePrints/donors-schedules/${blueprintId}`
      );
      const data = await result.json();
      if (data?.data) {
        const counts = {};

        // Count occurrences for each start_time
        data?.data?.shift_slots?.forEach((obj) => {
          const startTime = obj.start_time;
          counts[startTime] = (counts[startTime] || 0) + 1;
        });

        // Create a Set to keep track of processed start_times
        const processedStartTimes = new Set();

        // Combine shift_slots with the same start_time and add count property
        const combinedShiftSlots = data?.data?.shift_slots?.reduce(
          (acc, obj) => {
            const startTime = obj.start_time;
            if (!processedStartTimes.has(startTime)) {
              acc.push({
                ...obj,
                count: counts[startTime] || 0,
              });
              processedStartTimes.add(startTime);
            }
            return acc;
          },
          []
        );

        const updatedResponse = {
          ...data?.data,
          shift_slots: combinedShiftSlots,
        };
        const procedureTypesArray = updatedResponse?.shift_slots
          ?.filter((item, index, array) => {
            // Filter items based on whether their procedure_type.id is unique in the array
            return (
              array.findIndex(
                (el) => el.procedure_type.id === item.procedure_type.id
              ) === index
            );
          })
          ?.map((item) => {
            // Map the filtered items to the desired format
            return {
              procedure_type: item.procedure_type,
            };
          });

        setShiftSlots(procedureTypesArray);
        setDonorSchedules(updatedResponse);
        setShifts(updatedResponse?.shifts);
        handleShiftSlots(
          procedureTypesArray[0]?.procedure_type?.id,
          updatedResponse?.shifts
        );
        handleDonorPortal(
          procedureTypesArray[0]?.procedure_type?.id,
          updatedResponse?.shifts
        );
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  const addDonorSchedules = async (item) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/facility/donor-center/bluePrints/shifts/${item.shift_id}/projection/${item.procedure_type_id}/slots`,
        JSON.stringify({ slots: [item] })
      );
      const data = await response.json();
      if (data.status === 'success') {
        handleShiftSlots(item.procedure_type_id);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  const removeDonorSchedules = async (item) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/facility/donor-center/bluePrints/shifts/slots/${item?.id}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        handleShiftSlots(item.procedure_type_id);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  const handlePlus = (item) => {
    addDonorSchedules(item);
  };
  const handleMinus = (item) => {
    removeDonorSchedules(item);
  };

  const handleShiftSlots = async (id, firstSlots) => {
    const body = {
      procedure_type_id: +id,
      shift_ids: firstSlots
        ? firstSlots?.map((item) => {
            return +item.id;
          })
        : shifts?.map((item) => {
            return +item.id;
          }),
    };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/facility/donor-center/bluePrints/shifts/procedure-type/slots`,
        JSON.stringify(body)
      );
      const data = await response.json();

      if (data.status === 'success') {
        // to get procedure type id or shift id
        const shiftSlotsData = data?.data || [];
        const shiftableSlotId =
          shiftSlotsData?.length > 0
            ? {
                procedure_type_id: shiftSlotsData[0].procedure_type_id,
                shift_id: shiftSlotsData[0].shift_id,
              }
            : null;
        setShiftId(shiftableSlotId);

        const counts = {};

        // Count occurrences for each start_time
        data?.data?.forEach((obj) => {
          const startTime = obj.start_time;
          counts[startTime] = (counts[startTime] || 0) + 1;
        });

        // Create a Set to keep track of processed start_times
        const processedStartTimes = new Set();

        // Combine shift_slots with the same start_time and add count property
        const combinedShiftSlots = data?.data?.reduce((acc, obj) => {
          const startTime = obj.start_time;
          if (!processedStartTimes.has(startTime)) {
            acc.push({
              ...obj,
              count: counts[startTime] || 0,
            });
            processedStartTimes.add(startTime);
          }
          return acc;
        }, []);

        const updatedResponse = {
          ...data?.data,
          shift_slots: combinedShiftSlots,
        };
        // start time option
        const startTimeOptionData = updatedResponse?.shift_slots?.map(
          (item) => {
            return {
              label: moment(item.start_time).format('hh:mm A'),
              value: item.start_time,
            };
          }
        );
        setStartTimeOption(startTimeOptionData);

        // end time option
        const endTimeOptionData = updatedResponse?.shift_slots?.map((item) => {
          return {
            label: moment(item.end_time).format('hh:mm A'),
            value: item.end_time,
          };
        });
        setEndTimeOption(endTimeOptionData);
        setNewDonorSchedule(updatedResponse);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  const handleDonorPortal = async (id, firstSlots) => {
    const body = {
      procedure_type_id: +id,
      shift_ids: firstSlots
        ? firstSlots?.map((item) => {
            return +item.id;
          })
        : shifts?.map((item) => {
            return +item.id;
          }),
    };

    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/facility/donor-center/bluePrints/shifts/procedure-type/projection-staff`,
        JSON.stringify(body)
      );
      const data = await response.json();
      if (data.status === 'success') {
        setDonorPortalCheck(data?.data[0]?.is_donor_portal_enabled);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  const handleIsActiveChange = async (e) => {
    const id = shiftSlots[indexId]?.procedure_type?.id;
    const body = {
      procedure_type_id: +id,
      shift_ids: shifts?.map((item) => {
        return +item.id;
      }),
      is_donor_portal_enabled: e?.target?.checked,
    };

    try {
      const response = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/facility/donor-center/bluePrints/shifts/projection/staff`,
        JSON.stringify(body)
      );
      const data = await response.json();
      if (data.status === 'success') {
        handleDonorPortal(id);
      }
    } catch (error) {
      toast.error('Error fetching donor schedules:', error);
    }
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
      />
      <TopTabsDonorCenters
        donorCenterId={id}
        bluePrintId={blueprintId}
        editIcon={true}
      />
      <div className="mainContentInner">
        <div className="filterBar p-0 mb-3">
          <div className="flex justify-content-between tabs mb-0 position-relative">
            <div className="border-0">
              <ul>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/view`}
                    className=""
                  >
                    Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`}
                    className=""
                  >
                    Shift Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/donorSchedules`}
                    className="active"
                  >
                    Donor Schedules
                  </Link>
                </li>
              </ul>
            </div>
            <div className="right-btns-shift">
              {shiftSlots?.map((item, index) => {
                return (
                  <button
                    onClick={() => {
                      handleShiftSlots(item?.procedure_type?.id);
                      setIndexId(index);
                      handleDonorPortal(item?.procedure_type?.id);
                    }}
                    key={index}
                    className={`sche-btn 
                    ${
                      item?.procedure_type?.is_generate_online_appointments
                        ? 'green-dot'
                        : 'gray-dot'
                    }
                    ${index === indexId ? 'active-btn ' : ''}`}
                  >
                    {item.procedure_type.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-3 filterBar px-0 accountFilters">
            <div className={Styles.filterInner}>
              <div className={Styles.mainBar}>
                <div className="d-flex align-items-center">
                  <div className={Styles.barIcon}>
                    <span className="d-flex justify-content-center align-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                      >
                        <mask
                          id="mask0_15577_104611"
                          style={{ maskType: 'alpha' }} // Convert style string to an object
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="35"
                          height="35"
                        >
                          <rect width="35" height="35" fill="#D9D9D9" />
                        </mask>
                        <g mask="url(#mask0_15577_104611)">
                          <path
                            d="M18.7017 16.5946V10.8398C18.7017 10.5299 18.5969 10.2701 18.3872 10.0605C18.1775 9.85088 17.9176 9.74606 17.6076 9.74606C17.2975 9.74606 17.0378 9.85088 16.8284 10.0605C16.619 10.2701 16.5143 10.5299 16.5143 10.8398V16.9312C16.5143 17.1028 16.5461 17.2691 16.6097 17.4301C16.6732 17.591 16.7733 17.7398 16.9097 17.8763L21.9045 22.8711C22.1065 23.073 22.3603 23.1763 22.6659 23.181C22.9716 23.1856 23.2301 23.0823 23.4414 22.8711C23.6526 22.6598 23.7583 22.4037 23.7583 22.1027C23.7583 21.8016 23.6526 21.5455 23.4414 21.3342L18.7017 16.5946ZM17.6105 30.8919C15.6943 30.8919 13.8932 30.5282 12.2072 29.801C10.5212 29.0738 9.05453 28.0869 7.80734 26.8402C6.56013 25.5936 5.57275 24.1276 4.84521 22.4423C4.11768 20.757 3.75391 18.9563 3.75391 17.0402C3.75391 15.124 4.11752 13.3229 4.84474 11.6369C5.57196 9.95084 6.55889 8.48422 7.80552 7.23703C9.05218 5.98982 10.5182 5.00244 12.2035 4.2749C13.8887 3.54736 15.6894 3.18359 17.6056 3.18359C19.5217 3.18359 21.3228 3.54721 23.0089 4.27443C24.6949 5.00165 26.1615 5.98858 27.4087 7.23521C28.6559 8.48186 29.6433 9.94784 30.3709 11.6331C31.0984 13.3184 31.4622 15.1191 31.4622 17.0353C31.4622 18.9514 31.0986 20.7525 30.3713 22.4386C29.6441 24.1246 28.6572 25.5912 27.4106 26.8384C26.1639 28.0856 24.6979 29.073 23.0126 29.8005C21.3273 30.5281 19.5266 30.8919 17.6105 30.8919ZM17.608 28.7044C20.8407 28.7044 23.5933 27.5681 25.8659 25.2955C28.1384 23.023 29.2747 20.2704 29.2747 17.0377C29.2747 13.8051 28.1384 11.0525 25.8659 8.77991C23.5933 6.50734 20.8407 5.37106 17.608 5.37106C14.3754 5.37106 11.6228 6.50734 9.35022 8.77991C7.07765 11.0525 5.94137 13.8051 5.94137 17.0377C5.94137 20.2704 7.07765 23.023 9.35022 25.2955C11.6228 27.5681 14.3754 28.7044 17.608 28.7044Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                  <div>
                    <div className={Styles.barHeading}>Draw Hours</div>
                    <div className={Styles.barText}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#555555" />
                      </svg>
                      <span style={{ marginLeft: '5px' }}>
                        {moment(donorSchedules?.draw_hours?.start_time).format(
                          'hh:mm A'
                        )}
                        -
                        {moment(donorSchedules?.draw_hours?.end_time).format(
                          'hh:mm A'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <span style={{ position: 'relative', top: '7px' }}>
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="Group 1707479414">
                          <g
                            id="Rectangle 27813"
                            filter="url(#filter0_d_15577_86664)"
                          >
                            <rect
                              x="15"
                              y="7"
                              width="50"
                              height="50"
                              rx="6"
                              fill="#1384B3"
                            />
                          </g>
                          <g id="bloodtype">
                            <mask
                              id="mask0_15577_86664"
                              style={{ maskType: 'alpha' }}
                              maskUnits="userSpaceOnUse"
                              x="23"
                              y="14"
                              width="35"
                              height="35"
                            >
                              <rect
                                id="Bounding box"
                                x="23"
                                y="14"
                                width="35"
                                height="35"
                                fill="#D9D9D9"
                              />
                            </mask>
                            <g mask="url(#mask0_15577_86664)">
                              <path
                                id="bloodtype_2"
                                d="M40.4974 45.3538C37.3749 45.3538 34.7718 44.2813 32.6881 42.1362C30.6044 39.9912 29.5625 37.3213 29.5625 34.1266C29.5625 32.7118 29.8832 31.2924 30.5245 29.8682C31.1657 28.4441 31.9673 27.0774 32.9293 25.7681C33.8912 24.4588 34.9317 23.2272 36.0507 22.0734C37.1696 20.9195 38.2087 19.9157 39.1678 19.0618C39.3529 18.8861 39.5608 18.7556 39.7915 18.6706C40.0222 18.5855 40.2583 18.543 40.5 18.543C40.7416 18.543 40.9778 18.5855 41.2085 18.6706C41.4391 18.7556 41.647 18.8861 41.8321 19.0618C42.7912 19.9157 43.8303 20.9195 44.9493 22.0734C46.0682 23.2272 47.1087 24.4588 48.0706 25.7681C49.0326 27.0774 49.8342 28.4441 50.4755 29.8682C51.1168 31.2924 51.4374 32.7118 51.4374 34.1266C51.4374 37.3213 50.3947 39.9912 48.3093 42.1362C46.2238 44.2813 43.6198 45.3538 40.4974 45.3538ZM40.5 43.1663C43.0277 43.1663 45.118 42.3095 46.7708 40.596C48.4236 38.8825 49.25 36.7253 49.25 34.1246C49.25 32.3503 48.5147 30.3451 47.0442 28.109C45.5737 25.8729 43.3923 23.4302 40.5 20.7809C37.6076 23.4302 35.4262 25.8729 33.9557 28.109C32.4852 30.3451 31.75 32.3503 31.75 34.1246C31.75 36.7253 32.5764 38.8825 34.2291 40.596C35.8819 42.3095 37.9722 43.1663 40.5 43.1663ZM37.5833 39.885H43.4166C43.7265 39.885 43.9863 39.7802 44.1959 39.5705C44.4055 39.3607 44.5103 39.1009 44.5103 38.7908C44.5103 38.4808 44.4055 38.2211 44.1959 38.0117C43.9863 37.8023 43.7265 37.6976 43.4166 37.6976H37.5833C37.2734 37.6976 37.0136 37.8024 36.804 38.0122C36.5944 38.2219 36.4896 38.4818 36.4896 38.7918C36.4896 39.1018 36.5944 39.3615 36.804 39.5709C37.0136 39.7803 37.2734 39.885 37.5833 39.885ZM39.4062 32.5934V34.4163C39.4062 34.7262 39.5111 34.986 39.7208 35.1956C39.9305 35.4052 40.1904 35.51 40.5004 35.51C40.8105 35.51 41.0702 35.4052 41.2796 35.1956C41.489 34.986 41.5937 34.7262 41.5937 34.4163V32.5934H43.4166C43.7265 32.5934 43.9863 32.4885 44.1959 32.2788C44.4055 32.0691 44.5103 31.8092 44.5103 31.4992C44.5103 31.1891 44.4055 30.9294 44.1959 30.72C43.9863 30.5106 43.7265 30.4059 43.4166 30.4059H41.5937V28.583C41.5937 28.2731 41.4888 28.0133 41.2791 27.8037C41.0694 27.5941 40.8095 27.4893 40.4995 27.4893C40.1894 27.4893 39.9297 27.5941 39.7203 27.8037C39.5109 28.0133 39.4062 28.2731 39.4062 28.583V30.4059H37.5833C37.2734 30.4059 37.0136 30.5108 36.804 30.7205C36.5944 30.9302 36.4896 31.1901 36.4896 31.5001C36.4896 31.8102 36.5944 32.0699 36.804 32.2793C37.0136 32.4887 37.2734 32.5934 37.5833 32.5934H39.4062Z"
                                fill="white"
                              />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_15577_86664"
                            x="0"
                            y="0"
                            width="80"
                            height="80"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="8" />
                            <feGaussianBlur stdDeviation="7.5" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0.0196078 0 0 0 0 0.0627451 0 0 0 0 0.215686 0 0 0 0.08 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_15577_86664"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_15577_86664"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </span>
                  </div>
                  <div>
                    <div className={Styles.barHeading}>Procedures</div>
                    <div className={Styles.barText}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#555555" />
                      </svg>
                      <span style={{ marginLeft: '5px' }}>
                        {donorSchedules?.total_procedures}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <span style={{ position: 'relative', top: '7px' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                      >
                        <g filter="url(#filter0_d_15577_86710)">
                          <rect
                            x="15"
                            y="7"
                            width="50"
                            height="50"
                            rx="6"
                            fill="#1384B3"
                          />
                        </g>
                        <mask
                          id="mask0_15577_86710"
                          style={{ maskType: 'alpha' }}
                          maskUnits="userSpaceOnUse"
                          x="23"
                          y="14"
                          width="35"
                          height="35"
                        >
                          <rect
                            x="23"
                            y="14"
                            width="35"
                            height="35"
                            fill="#D9D9D9"
                          />
                        </mask>
                        <g mask="url(#mask0_15577_86710)">
                          <path
                            d="M38.97 37.0631L44.3322 31.7009C44.5491 31.484 44.8104 31.3732 45.1161 31.3686C45.4217 31.3639 45.6877 31.4747 45.9139 31.7009C46.1401 31.9271 46.2533 32.1907 46.2533 32.4917C46.2533 32.7927 46.1401 33.0564 45.9139 33.2826L39.8927 39.3038C39.6291 39.5674 39.3215 39.6992 38.97 39.6992C38.6185 39.6992 38.311 39.5674 38.0474 39.3038L35.0886 36.3451C34.8717 36.1282 34.761 35.8669 34.7563 35.5612C34.7516 35.2556 34.8624 34.9896 35.0886 34.7634C35.3148 34.5372 35.5785 34.424 35.8795 34.424C36.1805 34.424 36.4441 34.5372 36.6703 34.7634L38.97 37.0631ZM30.7417 45.3531C30.005 45.3531 29.3815 45.0979 28.8711 44.5875C28.3607 44.077 28.1055 43.4535 28.1055 42.7168V23.1977C28.1055 22.4611 28.3607 21.8375 28.8711 21.3271C29.3815 20.8167 30.005 20.5615 30.7417 20.5615H32.7609V18.5983C32.7609 18.2786 32.868 18.0117 33.0821 17.7977C33.2961 17.5836 33.563 17.4766 33.8827 17.4766C34.2024 17.4766 34.4693 17.5836 34.6834 17.7977C34.8975 18.0117 35.0045 18.2786 35.0045 18.5983V20.5615H46.0541V18.5703C46.0541 18.2599 46.1588 18 46.3682 17.7907C46.5776 17.5813 46.8375 17.4766 47.1478 17.4766C47.4582 17.4766 47.7181 17.5813 47.9275 17.7907C48.1369 18 48.2416 18.2599 48.2416 18.5703V20.5615H50.2608C50.9975 20.5615 51.621 20.8167 52.1314 21.3271C52.6419 21.8375 52.8971 22.4611 52.8971 23.1977V42.7168C52.8971 43.4535 52.6419 44.077 52.1314 44.5875C51.621 45.0979 50.9975 45.3531 50.2608 45.3531H30.7417ZM30.7417 43.1656H50.2608C50.373 43.1656 50.4759 43.1189 50.5694 43.0254C50.6629 42.9319 50.7096 42.829 50.7096 42.7168V29.031H30.2929V42.7168C30.2929 42.829 30.3397 42.9319 30.4332 43.0254C30.5267 43.1189 30.6295 43.1656 30.7417 43.1656ZM30.2929 26.8436H50.7096V23.1977C50.7096 23.0855 50.6629 22.9827 50.5694 22.8892C50.4759 22.7957 50.373 22.7489 50.2608 22.7489H30.7417C30.6295 22.7489 30.5267 22.7957 30.4332 22.8892C30.3397 22.9827 30.2929 23.0855 30.2929 23.1977V26.8436Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_15577_86710"
                            x="0"
                            y="0"
                            width="80"
                            height="80"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="8" />
                            <feGaussianBlur stdDeviation="7.5" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0.0196078 0 0 0 0 0.0627451 0 0 0 0 0.215686 0 0 0 0.08 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_15577_86710"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_15577_86710"
                              result="shape"
                            />
                          </filter>
                        </defs>
                      </svg>
                    </span>
                  </div>
                  <div>
                    <div className={Styles.barHeading}>Appointment Slots</div>
                    <div className={Styles.barText}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#555555" />
                      </svg>
                      <span style={{ marginLeft: '5px' }}>
                        {donorSchedules?.total_slots}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="form-field checkbox"
                  style={{ alignItems: 'center', display: 'flex' }}
                >
                  <span className={Styles.toggleText}>Donor Portal</span>
                  <label htmlFor="toggle" className="switch">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="toggle-input"
                      name="is_active"
                      checked={donorPortalCheck}
                      onChange={handleIsActiveChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tableView blueprintView">
          <div className="row">
            <div className="col-md-6">
              <div className="tableViewInner test">
                <div className="group">
                  <div className="group-head">
                    <div className="d-flex align-items-center justify-between w-100">
                      <h2>
                        {shiftSlots && shiftSlots[indexId]?.procedure_type.name}
                      </h2>
                      <button
                        onClick={() => setShowConfirmation(true)}
                        className="btn btn-link btn-md bg-transparent"
                      >
                        Add Slot
                      </button>
                    </div>
                  </div>
                  <div className="group-body">
                    <ul>
                      {newDonorSchedules?.shift_slots?.map((item, index) => {
                        return (
                          <li key={index}>
                            <span
                              className="left-heading"
                              style={{ alignItems: 'start' }}
                            >
                              {moment(item.start_time).format('hh:mm A')}
                            </span>
                            <span className="right-data d-block plus-minus-input text-center">
                              {item.count > 1 ? (
                                <span onClick={() => handleMinus(item)}>
                                  <SvgComponent name={'TagsMinusIcon'} />
                                </span>
                              ) : (
                                <span>
                                  <SvgComponent name={'TagsMinusIconGray'} />
                                </span>
                              )}
                              {item.count}
                              <span onClick={() => handlePlus(item)}>
                                <SvgComponent name={'TagsPlusIcon'} />
                              </span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddSlotModal
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        onCancel={cancelModal}
        onSubmits={submitModal}
        shiftId={shiftId}
        startTimeOption={startTimeOption}
        endTimeOption={endTimeOption}
        handleShiftSlots={handleShiftSlots}
        heading={'Shift Schedule'}
      />
    </div>
  );
}
