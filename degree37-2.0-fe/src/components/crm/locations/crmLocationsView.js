import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import './index.scss';
import { useParams, Link } from 'react-router-dom';
import viewimage from '../../../assets/images/LocationNotes.png';
import { formatDate } from '../../../helpers/formatDate';
import { formatUser } from '../../../helpers/formatUser';
import { fetchData, makeAuthorizedApiRequest } from '../../../helpers/Api';
import SvgComponent from '../../common/SvgComponent';
import AccountViewNavigationTabs from './navigationTabs';
import ConfirmationIcon from '../../../assets/images/confirmation-image.png';
import ConfirmModal from '../../common/confirmModal';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import QualificationModals from './view/about/QualificationModals';
import CheckPermission from '../../../helpers/CheckPermissions';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import { LocationsBreadCrumbsData } from './LocationsBreadCrumbsData';
import SuccessPopUpModal from '../../common/successModal/index.js';

const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  return keys.reduce((result, key) => result[key] || 'N/A', obj);
};

const ViewCrmLocations = () => {
  const [locations, setLocations] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [addQualificationModal, setAddQualificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [siteContactId, setSiteContactId] = useState(null);
  const [
    location_quali_expiration_period,
    set_location_quali_expiration_period,
  ] = useState(null); // commit krne se phle ise null krden
  const [delQualificationID, setDelQualificationID] = useState(null);
  const [tenantUser, setTenantUsers] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const [qualification_status_filter, setQualification_status_filter] =
    useState(true);
  const [previewData, setPreviewData] = useState(null);
  const [qualification, setQualification] = useState([]);
  // const [location_id] = useState(null);
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const handleConfirmationResult = (confirmed) => {
    if (!confirmed) {
      setShowConfirmationDialog(false);
    } else {
      deleteQualification(delQualificationID);
    }
  };
  const [viewAddress, setViewAddress] = useState('');

  useEffect(() => {
    fetchTenantUsers();
  }, []);
  useEffect(() => {
    getQualification();
  }, [qualification_status_filter]);

  const fetchTenantUsers = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/tenant-users?fetchAll=true`
      );
      const data = await response.json();
      setTenantUsers([
        ...(data?.data.map((item) => {
          return {
            value: item.id,
            label: item?.first_name + ' ' + item?.last_name,
          };
        }) || []),
      ]);
    } catch (error) {
      console.error('Error Recruiters Data:', error);
    }
  };
  const deleteQualification = async (delId) => {
    const url = `${BASE_URL}/locations/${id}/qualification/${encodeURIComponent(
      delId
    )}`;

    const result = await makeAuthorizedApiRequest('DELETE', url);
    setSuccessModal('Qualification archived');
    if (result.status === 410) {
      setShowConfirmationDialog(false);
      getQualification();
      setDelQualificationID(null);
    } else {
      console.error('Error Deleting Qualification');
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchData(`/crm/locations/${id}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setSiteContactId(edit?.site_contact_id?.id);
          let update = {
            name: edit?.name,
            physical_address: `${edit?.address?.address1} ${edit?.address?.address2}, ${edit?.address?.city}, ${edit?.address?.state}, ${edit?.address?.zip_code}`,
            county: edit?.address?.county,
            cross_street: edit?.cross_street,
            floor: edit?.floor,
            room: edit?.room,
            room_phone: edit?.room_phone,
            site_contact_id: `${
              edit?.site_contact_id?.first_name +
              ' ' +
              edit?.site_contact_id?.last_name
            }`,
            becs_code: edit?.becs_code,
            site_type: edit?.site_type,
            room_size_id: edit?.room_size_id?.name,
            elevator: edit?.elevator,
            inside_stairs: edit?.inside_stairs,
            outside_stairs: edit?.outside_stairs,
            electrical_note: edit?.electrical_note,
            special_instructions: edit?.special_instructions,
            qualification_status: edit?.qualification_status,
            qualification_status_name:
              edit?.created_by.first_name + ' ' + edit?.created_by.last_name,
            is_active: edit?.is_active,
            created_at: edit?.created_at,
            created_by: edit?.created_by,
            updated_at: edit?.modified_at,
            updated_by: edit?.modified_by,
          };

          edit.optionSpecLocation.forEach((optionSpec) => {
            switch (optionSpec.specs_key) {
              case 'automation_ok':
                update.automation_ok = optionSpec.specs_value ? 'Yes' : 'No';
                break;
              case 'wireless_ok':
                update.wireless_ok = optionSpec.specs_value ? 'Yes' : 'No';
                break;
              case 'ac_available':
                update.ac_available = optionSpec.specs_value ? 'Yes' : 'No';
                break;
              case 'heat_available':
                update.heat_available = optionSpec.specs_value ? 'Yes' : 'No';
                break;
              case 'rest_room_available':
                update.rest_room_available = optionSpec.specs_value
                  ? 'Yes'
                  : 'No';
                break;
              case 'staff_break_area':
                update.staff_break_area = optionSpec.specs_value ? 'Yes' : 'No';
                break;
              case 'cafeteria_available':
                update.cafeteria_available = optionSpec.specs_value
                  ? 'Yes'
                  : 'No';
                break;
              // Add more cases for other fields as needed
            }
          });
          setLocations(update);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
    fetchData(`/booking-drive/booking-rule/%7Bid%7D`).then((res) => {
      if (res.data?.location_quali_expires) {
        console.log(res.data?.location_quali_expiration_period);
        set_location_quali_expiration_period(
          res.data?.location_quali_expiration_period
        );
      }
    });
  }, [id]);
  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'active-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'About',
      class: 'active-label',
      link: `/crm/locations/${id}/view`,
    },
  ];

  const config = [
    {
      section: 'Location Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Physical Address', field: 'physical_address' },
        { label: 'County', field: 'county' },
        { label: 'Cross Street', field: 'cross_street' },
        { label: 'Floor', field: 'floor' },
        { label: 'Room', field: 'room' },
        { label: 'Room Phone', field: 'room_phone' },
        {
          label: 'Site Contact',
          field: 'site_contact_id',
          href: `/crm/contacts/volunteers/${siteContactId}/view`,
          openInNewTab: true,
        },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        {
          label: 'BECS Code',
          field: 'becs_code',
        },
        {
          label: 'Site Type',
          field: 'site_type',
        },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'is_active',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Created by',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'updated_by',
        },
      ],
    },
  ];
  const param = useParams();

  const getQualification = async () => {
    // Create a new URLSearchParams object
    const urlParams = new URLSearchParams();
    urlParams.append('page', 1);
    urlParams.append('limit', 10000);

    if (param.id) {
      urlParams.append('location_id', param.id);
    }
    if (qualification_status_filter !== undefined) {
      urlParams.append('qualification_status', qualification_status_filter);
    }
    const url = `${BASE_URL}/locations/${id}/qualification?${urlParams.toString()}`;

    const result = await makeAuthorizedApiRequest('GET', url);
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      if (data?.length == 0) {
        setQualification([]);
      } else {
        setQualification(data);
      }
    } else {
      toast.error('Error Fetching Qualification', { autoClose: 3000 });
    }
  };

  const config2 = [
    {
      section: 'Account History',
      fields: [{ label: '', field: 'account_history' }],
    },
    {
      section: 'Qualification',
      fields: [{ label: '', field: 'qualification_status' }],
    },

    {
      section: 'Location Specifications',
      fields: [
        {
          label: 'Room Size',
          field: 'room_size_id',
        },
        {
          label: 'Elevator',
          field: 'elevator',
        },
        {
          label: 'Inside Stairs',
          field: 'inside_stairs',
        },
        {
          label: 'Outside Stairs',
          field: 'outside_stairs',
        },
        {
          label: 'Electrical Notes',
          field: 'electrical_note',
        },
        {
          label: 'Special Instructions',
          field: 'special_instructions',
        },
        {
          label: 'Automation',
          field: 'automation_ok',
        },
        {
          label: 'Wireless',
          field: 'wireless_ok',
        },
        {
          label: 'Ac Available',
          field: 'ac_available',
        },
        {
          label: 'Heat Available',
          field: 'heat_available',
        },
        {
          label: 'Restroom Available',
          field: 'rest_room_available',
        },
        {
          label: 'Staff Break Area',
          field: 'staff_break_area',
        },
        {
          label: 'Cafeteria Available',
          field: 'cafeteria_available',
        },
      ],
    },
  ];

  let data = locations;

  const editLink = `/crm/locations/${id}/edit`;

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'About'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 pb-4 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={viewimage}
              className="bg-white heroIconImg"
              alt="CancelIcon"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="">{locations?.name}</h4>
            <span>{viewAddress ? viewAddress : ''}</span>
          </div>
        </div>
        <AccountViewNavigationTabs
          editLink={
            CheckPermission([CrmPermissions.CRM.LOCATIONS.WRITE])
              ? editLink
              : ''
          }
        />
      </div>
      <div className="mainContentInner">
        <div className="tableView row">
          <div className="col-6">
            <div className="tableViewInner test">
              {config.map((section) => (
                <div className="group " key={section.section}>
                  <div className="group-head">
                    <h2>{section.section}</h2>
                  </div>
                  <div className="group-body">
                    <ul>
                      {isLoading ? (
                        <li>
                          <span className={`right-data`}>
                            <p className="text-center w-100">Data Loading</p>
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
                                  data?.className ? (
                                    <span className={data?.className}>
                                      {data?.status}
                                    </span>
                                  ) : data.is_active || data[item.field] ? (
                                    <span className="badge active">Active</span>
                                  ) : (
                                    <span className="badge inactive">
                                      Inactive
                                    </span>
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
                                    )}
                                    {/* {formatDate(
                                      data?.updated_at ?? data?.modified_at
                                    )} */}
                                    {data?.updated_at || data?.modified_at ? (
                                      formatDate(
                                        data?.updated_at || data.modified_at
                                      )
                                    ) : (
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
                                ) : item?.href ? (
                                  <Link
                                    to={item.href}
                                    target={
                                      item?.openInNewTab ? '_blank' : '_self'
                                    }
                                  >
                                    {getNestedValue(data, item.field)}
                                  </Link>
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
          <div className="col-6">
            <div className="tableViewInner  test">
              {config2.map((section) => (
                <div className="group " key={section.section}>
                  <div className="group-head">
                    <div className="d-flex align-items-center justify-between w-100">
                      <h2>{section.section}</h2>
                      {section.section === 'Qualification' && (
                        <button
                          onClick={() => setAddQualificationModal(true)}
                          className="btn btn-link btn-md bg-transparent"
                        >
                          Add Qualification
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="group-body">
                    {!isLoading && section.section === 'Qualification' ? (
                      <>
                        <div className="top_tab_qualification">
                          <p
                            onClick={() => {
                              setQualification_status_filter(true);
                            }}
                            className={`mb-0 ${
                              qualification_status_filter && 'active'
                            }`}
                          >
                            Current
                          </p>
                          <p
                            onClick={() => {
                              setQualification_status_filter(false);
                            }}
                            className={`mb-0 ${
                              !qualification_status_filter && 'active'
                            }`}
                          >
                            Expired
                          </p>
                        </div>
                        <div
                          className="qualification_heading"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          <p className="left-side-head">Qualification</p>
                          <p>Name</p>
                          <p>Assigned</p>
                          <p>Expires</p>
                          <p></p>
                        </div>
                      </>
                    ) : !isLoading && section.section === 'Account History' ? (
                      <>
                        <div className="top_tab_qualification">
                          <p className="mb-0 active">Active</p>
                          <p className="mb-0">Inactive</p>
                        </div>
                        <div className="qualification_heading">
                          <p className="left-side-head">Name</p>
                          <p>Industry Category</p>
                          <p>Last Drive</p>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                    <ul style={{ maxHeight: '1000px', overflowY: 'auto' }}>
                      {isLoading ? (
                        <li>
                          <span className={`right-data`}>
                            <p className="text-center w-100">Data Loading</p>
                          </span>
                        </li>
                      ) : (
                        section.fields.map((item) => {
                          return item.field === 'qualification_status' ? (
                            <div key={item.field}>
                              {qualification.map((item, index) => {
                                return (
                                  <div
                                    className={
                                      +qualification?.length - 1 === +index
                                        ? 'qualification_bottom d-flex last_element'
                                        : 'qualification_bottom d-flex'
                                    }
                                    style={{ whiteSpace: 'nowrap' }}
                                    key={index}
                                  >
                                    <p className="left-side-color">
                                      {item?.qualification_status ? (
                                        <span
                                          style={{
                                            color: '#5CA044',
                                            fontSize: '22px',
                                            marginRight: '5px',
                                          }}
                                        >
                                          &#x2022;
                                        </span>
                                      ) : !item?.qualification_status ? (
                                        <span
                                          style={{
                                            color: '#FF0000',
                                            fontSize: '22px',
                                            marginRight: '5px',
                                          }}
                                        >
                                          &#x2022;
                                        </span>
                                      ) : null}

                                      {item?.qualification_status
                                        ? 'Qualified'
                                        : 'Expired'}
                                    </p>
                                    <p>
                                      {
                                        tenantUser?.find(
                                          (x) =>
                                            x.value ===
                                            item?.qualified_by?.toString()
                                        )?.label
                                      }
                                    </p>
                                    <p>
                                      {moment(item?.qualification_date).format(
                                        'MM-DD-YYYY'
                                      )}
                                    </p>
                                    <p>
                                      {item?.qualification_expires
                                        ? moment(
                                            item?.qualification_expires
                                          ).format('MM-DD-YYYY')
                                        : '-'}
                                    </p>
                                    <p>
                                      <span
                                        onClick={() => {
                                          setShowConfirmationDialog(true);
                                          setDelQualificationID(
                                            Number(item?.id)
                                          );
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <SvgComponent name={'ViewArchieIcon'} />
                                      </span>
                                      <span
                                        onClick={() => {
                                          setPreviewData(item);
                                          setShowPreview(true);
                                        }}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        className="ms-4"
                                      >
                                        <SvgComponent name={'ViewViewIcon'} />
                                      </span>
                                    </p>
                                  </div>
                                );
                              })}
                              {qualification.length === 0 && (
                                <div>
                                  <div className="qualification_bottom d-flex  ">
                                    <p
                                      className=""
                                      style={{
                                        width: '100%',
                                        textAlign: 'center',
                                      }}
                                    >
                                      <i style={{ margin: '0 auto' }}>
                                        Not Qualified for status
                                      </i>
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <li key={item.field}>
                              <span className="left-heading">{item.label}</span>
                              <span
                                className={`right-data ${item.className || ''}`}
                              >
                                {item.field === 'status' ||
                                item.field === 'is_active' ? (
                                  data?.className ? (
                                    <span className={data?.className}>
                                      {data?.status}
                                    </span>
                                  ) : data.is_active || data[item.field] ? (
                                    <span className="badge active">Active</span>
                                  ) : (
                                    <span className="badge inactive">
                                      Inactive
                                    </span>
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
                                    {!data?.updated_at &&
                                      !data?.modified_at && (
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

      {/* Modals and Popups of Qualifications */}
      <QualificationModals
        showAddModal={addQualificationModal}
        setAddQualificationModal={setAddQualificationModal}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        location_quali_expiration_period={location_quali_expiration_period}
        set_location_quali_expiration_period={
          set_location_quali_expiration_period
        }
        previewData={previewData}
        setPreviewData={setPreviewData}
        getQualification={getQualification}
      />
      <SuccessPopUpModal
        message={successModal}
        modalPopUp={successModal}
        showActionBtns
        setModalPopUp={setSuccessModal}
        title="Success!"
      />
      <ConfirmModal
        showConfirmation={showConfirmationDialog}
        onCancel={() => handleConfirmationResult(false)}
        onConfirm={() => handleConfirmationResult(true)}
        icon={ConfirmationIcon}
        heading={'Confirmation'}
        description={
          'This will delete this Qualification and cannot be undone.Are you sure you want to delete?'
        }
      />
    </div>
  );
};

export default ViewCrmLocations;
