import React, { useState } from 'react';
import { formatUser } from '../../../../../helpers/formatUser';
import { formatDate } from '../../../../../helpers/formatDate';
import TableList from '../../../../common/tableListing';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import './about.scss';
import SuccessPopUpModal from '../../../../common/successModal';
import moment from 'moment';

const TableHeaders = [
  {
    name: 'date',
    label: 'Date',
    width: '17%',
    sortable: false,
  },
  {
    name: 'account',
    label: 'Account',
    width: '25%',
    sortable: false,
  },
  {
    name: 'location',
    label: 'Location',
    width: '19%',
    type: 'noWrap',
    sortable: false,
  },
  {
    name: 'timeDuration',
    label: 'Start time - End Time',
    width: '17%',
    type: 'noWrap',
    sortable: false,
  },
  {
    name: 'vehicle',
    label: 'Vehicle',
    width: '15%',
    sortable: false,
  },
  {
    name: '',
    label: 'Staff Setup',
    width: '20%',
    sortable: false,
  },
];

function DriveInsightsSection({ driveData, getDriveData, modifiedData }) {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [searchText, setSearchText] = useState('');
  const [addDriveLinkModal, setAddDriveLinkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState([]);
  const [selectedDrive2, setSelectedDrive2] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (selectedDrive.length > 0) {
      setSelectedDrive2([selectedDrive[selectedDrive.length - 1]]);
    } else {
      setSelectedDrive2([]);
    }
  }, [selectedDrive]);

  useEffect(() => {
    if (searchText.length > 1 || searchText.length === 0) {
      fetchAll();
    }
  }, [searchText]);

  useEffect(() => {
    getFillRateAndFilled();
  }, []);

  const getFillRateAndFilled = async () => {
    const response = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/drives/shifts/donors-schedules/${id}`
    );
    const data = await response?.json();
    setFilled(data?.data);
  };

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives?keyword=${searchText}&fetch_all=true&is_linked=false&is_linkable=true`
      );
      const data = await response.json();
      const records = data?.data?.map((item) => {
        return {
          date: item?.drive?.date || '',
          account: item?.account?.name || '',
          location: item?.crm_locations?.name || '',
          id: item?.drive?.id?.toString() || '',
          vehicle:
            item?.drive?.shifts?.[0]?.vehicles?.[0]?.vehicle_id?.name || '',
          timeDuration:
            item?.drive?.shifts?.[0]?.start_time &&
            item?.drive?.shifts?.[0]?.end_time
              ? `${moment(item?.drive?.shifts?.[0]?.start_time).format(
                  'h:mm a'
                )} - ${moment(item?.drive?.shifts?.[0]?.end_time).format(
                  'h:mm a'
                )}`
              : '',
        };
      });
      setRows(records);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (driveData !== null) {
      setSelectedDrive(
        driveData?.drive?.linked_drive?.prospective_drive_id
          ? [driveData?.drive?.linked_drive?.prospective_drive_id?.toString()]
          : []
      );
    }
  }, [driveData]);

  const submitLinkDrive = async () => {
    setButtonDisabled(true);
    if (selectedDrive2.length === 0) {
      setButtonDisabled(false);
      return toast.error('Atleast one item should be selected.');
    }

    const body =
      +driveData?.drive?.linked_drive?.prospective_drive_id ===
      +selectedDrive2?.[0]
        ? { deleteLinkedDrive: [], linkDrive: [] }
        : {
            deleteLinkedDrive: driveData?.drive?.linked_drive
              ?.prospective_drive_id
              ? [driveData?.drive?.linked_drive?.prospective_drive_id]
              : [],
            linkDrive: selectedDrive2.map((item) => {
              return {
                drive_id: item,
              };
            }),
          };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/drives/${id}/link_drive`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        setAddDriveLinkModal(false);
        setShowModel(true);
      } else if (data?.status_code === 400) {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;
        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }

    setButtonDisabled(false);
  };
  return (
    <>
      <table className="viewTables w-100 mt-4">
        <thead>
          <tr>
            <th colSpan="2">Insights</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tableTD col1">Status</td>
            <td className="tableTD col2">
              {driveData?.drive?.operation_status_id ? (
                <span className="badge active">
                  {driveData?.drive?.operation_status_id?.name}
                </span>
              ) : (
                <span className="badge inactive">Inactive</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Linked With</td>
            <td className="tableTD col2">
              <span
                style={{ color: '#005375', cursor: 'pointer' }}
                onClick={() => setAddDriveLinkModal(true)}
              >
                Link Drive
              </span>
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Multi-day Drive</td>
            <td className="tableTD col2">
              {driveData?.drive?.is_multi_day_drive ? 'Yes' : 'No'}
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Slots (Filled/Capacity)</td>
            <td className="tableTD col2">
              {filled?.filled_slots}/{driveData?.slots}
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Fill Rate</td>
            <td className="tableTD col2">
              {`${((filled?.filled_slots / filled?.total_slots) * 100).toFixed(
                2
              )}%`}
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Created</td>
            <td className="tableTD col2">
              {formatUser(driveData?.drive?.created_by)}{' '}
              {formatDate(driveData?.drive?.created_at)}
            </td>
          </tr>
          <tr>
            <td className="tableTD col1">Modified</td>
            <td className="tableTD col2">
              {formatUser(modifiedData?.modified_by)}{' '}
              {formatDate(modifiedData?.modified_at)}
            </td>
          </tr>
        </tbody>
      </table>
      <section
        className={`popup full-section ${addDriveLinkModal ? 'active' : ''}`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Link Drive</h3>
              <div className="search">
                <div className="formItem">
                  <input
                    type="text"
                    name="contact_name"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div
              className=" tableListingLinkDrive mt-4 overflow-y-auto"
              style={{ height: '50vh' }}
            >
              <TableList
                isLoading={isLoading}
                data={rows}
                headers={TableHeaders}
                checkboxValues={selectedDrive2}
                handleCheckboxValue={(row) => row.id}
                handleCheckbox={setSelectedDrive}
                showAllCheckBoxListing={false}
              />
            </div>

            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                onClick={() => setAddDriveLinkModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-primary"
                onClick={submitLinkDrive}
                disabled={buttonDisabled}
              >
                Link
              </button>
            </div>
          </div>
        </div>
      </section>
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive Linked Successfully."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => {
            getDriveData(id);
            setShowModel(false);
          }}
        />
      ) : null}
    </>
  );
}

export default DriveInsightsSection;
