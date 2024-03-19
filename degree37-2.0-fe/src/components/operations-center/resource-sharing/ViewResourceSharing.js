import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API } from '../../../api/api-routes.js';
import moment from 'moment';
import { formatUser } from '../../../helpers/formatUser.js';
import { formatDate } from '../../../helpers/formatDate.js';
import { Modal } from 'react-bootstrap';
import styles from './index.module.scss';
import SelectDropdown from '../../common/selectDropdown/index.js';
import SuccessPopUpModal from '../../common/successModal/index.js';
import CancelModalPopUp from '../../common/cancelModal/index.js';

const ViewResourceSharing = () => {
  const [viewData, setViewData] = useState(null);
  const accessToken = localStorage.getItem('token');
  const params = useParams();
  const [fullfillModal, setFulfillModal] = useState(false);
  const [fullfillOption, SetFullfillOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [fullfilldata, setFullfillData] = useState(null);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: '/operations-center',
    },
    {
      label: 'Resource Sharing',
      class: 'active-label',
      link: '/operations-center/resource-sharing',
    },
    {
      label: 'Resource Sharing View',
      class: 'active-label',
      link: `/operations-center/resource-sharing/${params?.id}/view`,
    },
  ];

  const SHARE_TYPE_ENUM = [
    {
      value: 1,
      label: 'Devices',
    },
    {
      value: 2,
      label: 'Staff',
    },
    {
      value: 3,
      label: 'Vehicles',
    },
  ];

  useEffect(() => {
    getDataById();
    getFullfillRequest();
  }, []);

  const getDataById = async () => {
    try {
      const { data } = await API.operationCenter.resourceSharing.getById(
        accessToken,
        params?.id
      );
      if (data?.status === 'success') {
        setViewData(data?.data);
        const modifiedData = data?.data?.shareTypeData?.map((item) => {
          return {
            label: item?.name,
            value: +item?.id,
          };
        });
        SetFullfillOption(modifiedData);
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const submit = async () => {
    const isArrayEmpty = selectedOption?.every(
      (item) => item === null || item === undefined
    );
    if (isArrayEmpty || selectedOption.length == 0) {
      setFulfillModal(false);
      setSelectedOption([]);
    } else {
      const testing = selectedOption.filter(
        (item) =>
          typeof item === 'object' && item !== null && item !== undefined
      );
      const fullfilment_datap = testing?.map((item) => {
        return {
          resource_share_id: params?.id,
          share_type_id: item?.value,
        };
      });
      const modified = {
        fullfilment_data: fullfilment_datap,
      };
      try {
        const { data } =
          await API.operationCenter.resourceSharing.postFullfillRequest(
            accessToken,
            params?.id,
            modified
          );
        if (data?.status === 'success') {
          setFulfillModal(false);
          setModalPopUp(true);
          setSelectedOption([]);
          getFullfillRequest();
        }
        if (data?.status === 'error') {
          toast.error(`${data?.response}`, { autoClose: 3000 });
        }
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    }
  };
  const archivedHandle = async (archivedId) => {
    const body = {
      resource_share_id: params?.id,
      share_type_id: archivedId,
    };
    try {
      const { data } =
        await API.operationCenter.resourceSharing.archivedFullfillRequest(
          accessToken,
          params?.id,
          body
        );
      if (data?.status === 'success') {
        getFullfillRequest();
      }
      if (data?.status === 'error') {
        toast.error(`${data?.response}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };
  const handleClose = () => {
    setFulfillModal(false);
    setSelectedOption([]);
  };

  const getFullfillRequest = async () => {
    try {
      const { data } =
        await API.operationCenter.resourceSharing.getFullfillRequest(
          accessToken,
          params?.id
        );
      if (data) {
        setFullfillData(data?.data);
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Resource Sharing'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner" style={{ paddingTop: '15px' }}>
        <div className="buttons" style={{ paddingBottom: '15px' }}>
          <Link
            to={`/operations-center/resource-sharing/${params?.id}/edit`}
            className="d-flex justify-content-end align-items-center mr-2"
          >
            <span className="icon" style={{ marginRight: '5px' }}>
              {/* <SvgComponent name="EditIcon" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <g clipPath="url(#clip0_48466_101475)">
                  <path
                    d="M19 20.5703H5C4.73478 20.5703 4.48043 20.6757 4.29289 20.8632C4.10536 21.0507 4 21.3051 4 21.5703C4 21.8355 4.10536 22.0899 4.29289 22.2774C4.48043 22.465 4.73478 22.5703 5 22.5703H19C19.2652 22.5703 19.5196 22.465 19.7071 22.2774C19.8946 22.0899 20 21.8355 20 21.5703C20 21.3051 19.8946 21.0507 19.7071 20.8632C19.5196 20.6757 19.2652 20.5703 19 20.5703Z"
                    fill="#387DE5"
                  />
                  <path
                    d="M5.0003 18.5711H5.0903L9.2603 18.1911C9.71709 18.1456 10.1443 17.9444 10.4703 17.6211L19.4703 8.62115C19.8196 8.25211 20.0084 7.75965 19.9953 7.25168C19.9822 6.74371 19.7682 6.26165 19.4003 5.91115L16.6603 3.17115C16.3027 2.83524 15.8341 2.64251 15.3436 2.6296C14.8532 2.61669 14.3751 2.78452 14.0003 3.10115L5.0003 12.1011C4.67706 12.4271 4.4758 12.8544 4.4303 13.3111L4.0003 17.4811C3.98683 17.6276 4.00583 17.7753 4.05596 17.9135C4.10608 18.0518 4.1861 18.1773 4.2903 18.2811C4.38374 18.3738 4.49455 18.4472 4.61639 18.4969C4.73823 18.5467 4.86869 18.5719 5.0003 18.5711ZM15.2703 4.57115L18.0003 7.30115L16.0003 9.25115L13.3203 6.57115L15.2703 4.57115ZM6.3703 13.4811L12.0003 7.89115L14.7003 10.5911L9.1003 16.1911L6.1003 16.4711L6.3703 13.4811Z"
                    fill="#387DE5"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_48466_101475">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0 0.570312)"
                    />
                  </clipPath>
                </defs>
              </svg>
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
              Edit Share
            </p>
          </Link>
        </div>
        <div className="tableView blueprintView">
          <div className="row">
            <div className="col-md-6">
              <div className="tableViewInner test">
                <div className="group">
                  <div className="group-head">
                    <h2>Shift Details</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Start Date
                        </span>
                        <span className="right-data">
                          {moment(viewData?.start_date)?.format('MM-DD-YYYY')}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          End Date
                        </span>
                        <span className="right-data">
                          {moment(viewData?.end_date)?.format('MM-DD-YYYY')}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Share Type
                        </span>
                        <span className="right-data">
                          {
                            SHARE_TYPE_ENUM?.filter(
                              (option) => option?.value === viewData?.share_type
                            )[0]?.label
                          }
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Quantity
                        </span>
                        <span className="right-data">{viewData?.quantity}</span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Description
                        </span>
                        <span className="right-data">
                          {viewData?.description}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          From Collection Operation
                        </span>
                        <span className="right-data">
                          {viewData?.from_collection_operation_id?.name}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          To Collection Operation
                        </span>
                        <span className="right-data">
                          {viewData?.to_collection_operation_id?.name}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Operation Name
                        </span>
                        <span className="right-data">
                          {viewData?.to_collection_operation_id?.name}
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
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Status
                        </span>
                        <span className="right-data">
                          {viewData?.is_active ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">Inactive</span>
                          )}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Created
                        </span>
                        <span className="right-data">
                          {formatUser(
                            viewData?.created_by ?? viewData?.created_by
                          )}{' '}
                          {formatDate(
                            viewData?.created_at ?? viewData?.created_at
                          )}
                        </span>
                      </li>
                      <li>
                        <span
                          className="left-heading"
                          style={{ alignItems: 'start' }}
                        >
                          Modified
                        </span>
                        <span className="right-data">
                          {formatUser(
                            viewData?.modified_by
                              ? viewData?.modified_by
                              : viewData?.created_by
                          )}{' '}
                          {formatDate(
                            viewData?.modified_at
                              ? viewData?.modified_at
                              : viewData?.created_at
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tableViewInner test">
                <div className="group">
                  <div className="group-head">
                    <div className="d-flex align-items-center justify-between w-100">
                      <h2>Resource Sharing Fulfillment</h2>
                      <button
                        onClick={() => {
                          setFulfillModal(true);
                        }}
                        className="btn btn-link btn-md bg-transparent p-0"
                      >
                        Fulfill Request
                      </button>
                    </div>
                  </div>
                  <div className="group-body">
                    <ul>
                      <li className="shift-span">
                        <span className="left-shift">
                          {
                            SHARE_TYPE_ENUM?.filter(
                              (option) => option?.value === viewData?.share_type
                            )[0]?.label
                          }
                        </span>
                        <span className="right-shift w-50">
                          Collection Operation
                        </span>
                      </li>
                      {fullfilldata === null ? (
                        <li>
                          <span className="right-data d-flex justify-content-center align-items-center">
                            No Data Found
                          </span>
                        </li>
                      ) : (
                        <>
                          {fullfilldata?.map((item, index) => {
                            return (
                              <li key={index}>
                                <span
                                  className="left-heading"
                                  style={{ alignItems: 'start' }}
                                >
                                  {item?.name}
                                </span>
                                <span className="right-data d-flex justify-between align-items-center">
                                  <span>
                                    {item?.collection_operation?.name}
                                  </span>
                                  <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => archivedHandle(item?.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13"
                                      height="13"
                                      viewBox="0 0 13 13"
                                      fill="none"
                                    >
                                      <path
                                        d="M7.96698 6.64098L12.4461 2.17223C12.6423 1.97608 12.7525 1.71005 12.7525 1.43265C12.7525 1.15525 12.6423 0.889214 12.4461 0.693064C12.25 0.496915 11.984 0.386719 11.7066 0.386719C11.4292 0.386719 11.1631 0.496915 10.967 0.693064L6.49823 5.17223L2.02948 0.693064C1.83333 0.496915 1.56729 0.386719 1.28989 0.386719C1.0125 0.386719 0.74646 0.496915 0.550311 0.693064C0.354161 0.889214 0.243965 1.15525 0.243965 1.43265C0.243965 1.71005 0.354161 1.97608 0.550311 2.17223L5.02948 6.64098L0.550311 11.1097C0.452677 11.2066 0.375183 11.3218 0.322299 11.4487C0.269415 11.5756 0.242188 11.7118 0.242188 11.8493C0.242188 11.9868 0.269415 12.123 0.322299 12.2499C0.375183 12.3769 0.452677 12.4921 0.550311 12.5889C0.647147 12.6865 0.762357 12.764 0.889293 12.8169C1.01623 12.8698 1.15238 12.897 1.28989 12.897C1.42741 12.897 1.56356 12.8698 1.6905 12.8169C1.81743 12.764 1.93264 12.6865 2.02948 12.5889L6.49823 8.10973L10.967 12.5889C11.0638 12.6865 11.179 12.764 11.306 12.8169C11.4329 12.8698 11.569 12.897 11.7066 12.897C11.8441 12.897 11.9802 12.8698 12.1072 12.8169C12.2341 12.764 12.3493 12.6865 12.4461 12.5889C12.5438 12.4921 12.6213 12.3769 12.6742 12.2499C12.727 12.123 12.7543 11.9868 12.7543 11.8493C12.7543 11.7118 12.727 11.5756 12.6742 11.4487C12.6213 11.3218 12.5438 11.2066 12.4461 11.1097L7.96698 6.64098Z"
                                        fill="#A3A3A3"
                                      />
                                    </svg>
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Fulfill Request Created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        methodsToCall={true}
        methods={handleClose}
      />
      <Modal
        show={fullfillModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div className="formGroup" style={{ padding: '14px' }}>
            <h4 style={{ fontWeight: '500', fontSize: '32px' }}>
              Fulfill Request
            </h4>
            <div className="table-listing-main mt-4">
              <div className="table-responsive">
                <table
                  className="table table-striped"
                  style={{ boxShadow: 'none', border: '1px solid #b5b5b5' }}
                >
                  <thead>
                    <tr>
                      <th width="30%">Share Type</th>
                      <th width="70%" className="text-start">
                        {
                          SHARE_TYPE_ENUM?.filter(
                            (option) => option?.value === viewData?.share_type
                          )[0]?.label
                        }{' '}
                        Available
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewData?.shareTypeData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {
                              SHARE_TYPE_ENUM?.filter(
                                (option) =>
                                  option?.value === viewData?.share_type
                              )[0]?.label
                            }
                          </td>
                          <td
                            className="text-start"
                            style={{ padding: '12px 20px' }}
                          >
                            <div
                              className="formGroup"
                              style={{ width: '356px' }}
                            >
                              <SelectDropdown
                                placeholder={'Share Type'}
                                name={`share_type${index}`}
                                required
                                removeDivider
                                selectedValue={
                                  selectedOption[index]
                                    ? selectedOption[index]
                                    : null
                                }
                                onChange={(option) => {
                                  const updatedSelectedOption = [
                                    ...selectedOption,
                                  ];
                                  updatedSelectedOption[index] = option;
                                  setSelectedOption(updatedSelectedOption);
                                }}
                                options={
                                  selectedOption
                                    ? fullfillOption
                                        ?.filter(
                                          (item) =>
                                            item &&
                                            item !== undefined &&
                                            item.label !== undefined &&
                                            item.value !== undefined &&
                                            item !== null &&
                                            item.label !== null &&
                                            item.value !== null &&
                                            !selectedOption?.some(
                                              (selectedItem) =>
                                                selectedItem !== undefined &&
                                                selectedItem !== null &&
                                                selectedItem.label ===
                                                  item.label &&
                                                selectedItem.value ===
                                                  item.value
                                            )
                                        )
                                        ?.map((item) => item)
                                    : fullfillOption
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center w-100">
              <p
                onClick={() => {
                  setCloseModal(true);
                }}
                className={styles.btncancel}
              >
                Cancel
              </p>
              <p className={styles.btnAddContact} onClick={submit}>
                Save
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewResourceSharing;
