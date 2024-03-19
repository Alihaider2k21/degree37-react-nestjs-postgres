import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TableList from '../../../common/tableListing';
import CancelModalPopUp from '../../../common/cancelModal';
import CloseOutImage from '../../../../assets/images/CloseoutImage.png';
import moment from 'moment';
import * as _ from 'lodash';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import ReactDatePicker from 'react-datepicker';
import Closeout1 from '../../../../assets/images/closeout1.png';
import Closeout2 from '../../../../assets/images/closeout2.png';
import SuccessPopUpModal from '../../../common/successModal';

const TableHeaders = [
  {
    name: 'name',
    label: 'Name',
    width: '17%',
    sortable: false,
  },
  {
    name: 'role_name',
    type: 'select',
    label: 'Role',
    width: '25%',
    sortable: false,
  },
  {
    name: 'email',
    label: 'Email',
    width: '19%',
    type: 'noWrap',
    sortable: false,
  },
  {
    name: 'phone',
    label: 'Phone',
    width: '17%',
    type: 'noWrap',
    sortable: false,
  },
  {
    name: 'city',
    label: 'City',
    width: '15%',
    sortable: false,
  },
  {
    name: '',
    label: '',
    width: '20%',
    sortable: false,
  },
];

function ContactsSection() {
  const { account_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [contactRows, setContactRows] = useState({});
  const [searchText, setSearchText] = useState('');
  const [addContactsModal, setAddContactsModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactRoles, setContactRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [closeModal, setCloseModal] = useState(false);
  const [accountContactsList, setAccountContactsList] = useState([]);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [contactTabs, setContactTabs] = useState('Current');
  const [closeoutDateInput, setCloseoutDateInput] = useState(null);
  const [closeOutDateModal, setCloseOutDateModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const [allRoles, setAllRoles] = useState([]);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    if (Object.values(selectedRoles)?.length > 0) {
      if (
        Object.values(selectedRoles).some(
          (item) => item.label === 'Primary Chairperson'
        )
      ) {
        const dupArr = [...contactRoles];
        const findIndex = dupArr.findIndex(
          (item) => item.label === 'Primary Chairperson'
        );
        if (findIndex !== -1) {
          dupArr.splice(findIndex, 1);
        }
        setContactRoles(dupArr);
      } else if (contactRoles.length !== allRoles.length) {
        setContactRoles(allRoles);
      }
    }
  }, [selectedRoles]);

  useEffect(() => {
    fetchAllVolunteerContacts();
  }, [searchText]);

  const fetchAllVolunteerContacts = async (filters) => {
    try {
      setIsLoading(true);
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-volunteer?fetchAll=true&status=true${
          searchText && searchText.length ? '&name=' + searchText : ''
        }`
      );
      const data = await response.json();
      if (data.status !== 500) {
        if (data.data.length > 0) {
          const contactData = data.data;
          let outputDataArray = [];
          for (const inputData of contactData) {
            const outputData = {
              ...inputData,
              id: inputData?.volunteer_id,
              name: inputData?.name,
              email: inputData?.primary_email,
              phone: inputData?.primary_phone,
              city: inputData?.address_city,
            };

            outputDataArray.push(outputData);
          }
          setContactRows(_.keyBy(outputDataArray, 'id'));
        } else {
          setContactRows({});
        }
      }
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getContactRoles();
  }, []);

  useEffect(() => {
    getAccountContacts(account_id);
  }, [account_id, contactTabs]);
  const getAccountContacts = async (id) => {
    setAccountContactsList([]);
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/${id}/account-contacts?is_current=${
        contactTabs === 'Current'
      }`
    );
    const { data } = await result.json();
    if (data?.length > 0) {
      setAccountContactsList(data);
    }
  };
  const getContactRoles = async () => {
    const deviceTypeUrl = `${BASE_URL}/contact-roles/volunteer`;
    const result = await fetch(`${deviceTypeUrl}`, {
      headers: {
        method: 'GET',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result.json();
    const mappedData = data?.data.map((item) => {
      return { value: item.id, label: item.name };
    });
    setContactRoles(mappedData);
    setAllRoles(mappedData);
  };
  useEffect(() => {
    if (accountContactsList.length > 0) {
      setSelectedContacts(accountContactsList.map((item) => item.record_id.id));
      const dupObj = {};
      accountContactsList.forEach((item) => {
        dupObj[item.record_id.id] = {
          value: item.role_id.id,
          label: item.role_id.name,
        };
      });
      setSelectedRoles(dupObj);
    }
  }, [accountContactsList?.length, closeModal, addContactsModal === true]);

  useEffect(() => {
    if (selectedContacts.length > 0) {
      const dupArr = [];
      accountContactsList.forEach((item) => {
        if (!selectedContacts.includes(item.record_id?.id)) {
          dupArr.push(item.id);
        }
      });
      setDeletedContacts(dupArr);
    } else if (
      accountContactsList.length > 0 &&
      selectedContacts.length === 0
    ) {
      setDeletedContacts(accountContactsList.map((item) => item.id));
    }
  }, [selectedContacts.length]);

  const submitContacts = async () => {
    setButtonDisabled(true);
    if (selectedContacts.length > 0) {
      let condition = [];
      selectedContacts.forEach((sc) => {
        Object.keys(selectedRoles).forEach((sr) => {
          if (sc == sr) {
            condition.push(sc);
          }
        });
      });
      if (
        selectedContacts.length <= Object.keys(selectedRoles).length &&
        condition.length === selectedContacts.length
      ) {
        if (
          !selectedContacts.some(
            (roleCompare) =>
              selectedRoles?.[roleCompare]?.label === 'Primary Chairperson'
          )
        ) {
          setButtonDisabled(false);
          return toast.error(
            'At least one contact with Primary chairperson role is required.'
          );
        }
        if (
          selectedContacts.filter(
            (roleCompare) =>
              selectedRoles?.[roleCompare]?.label === 'Primary Chairperson'
          ).length > 1
        ) {
          setButtonDisabled(false);
          return toast.error(
            'There can only be one contact with Primary Chairperson role.'
          );
        }
        const dupArr = [...selectedContacts];
        const dupArrDelete = [...deletedContacts];
        if (selectedContacts.length > 0) {
          accountContactsList.forEach((item) => {
            if (
              selectedContacts.includes(item.record_id?.id) &&
              item?.role_id?.id === selectedRoles[item.record_id?.id]?.value
            ) {
              const indexToRemove = dupArr.findIndex(
                (record) => record === item.record_id?.id
              );
              dupArr.splice(indexToRemove, 1);
            } else {
              if (!dupArrDelete.includes(item.id)) {
                dupArrDelete.push(item.id);
              }
            }
          });
        }

        const body = {
          deleteContacts: dupArrDelete,
          contacts: dupArr.map((item) => {
            return {
              contactable_type: 'accounts',
              contactable_id: account_id,
              record_id: item,
              role_id: selectedRoles[item]?.value,
            };
          }),
        };
        try {
          const response = await makeAuthorizedApiRequest(
            'POST',
            `${BASE_URL}/accounts/${account_id}/account-contacts`,
            JSON.stringify(body)
          );
          let data = await response.json();
          if (data?.status === 'success') {
            getAccountContacts(account_id);
            setAddContactsModal(false);
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
      } else {
        toast.error('Roles for selected contacts are required.');
      }
    } else {
      toast.error('At least one contact is required.');
    }
    setButtonDisabled(false);
    setDeletedContacts([]);
  };
  const handleSubmitCloseoutDate = async () => {
    try {
      const body = {
        closeout_date: moment(closeoutDateInput).utc(true).format(),
      };
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/accounts/account-contacts/${selectedContactId}`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        toast.success(data?.response);
        getAccountContacts(account_id);
        setCloseOutDateModal(false);
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
  };
  return (
    <>
      <table className="viewTables w-100 mt-0">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Contacts</span>
                {contactTabs === 'Current' && (
                  <button
                    onClick={() => setAddContactsModal(true)}
                    className="btn btn-link btn-md bg-transparent"
                  >
                    Add Contacts
                  </button>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          className={`overflow-y-auto w-100 ${
            accountContactsList.length > 5 ? ' d-block' : ''
          }`}
          style={{ height: accountContactsList.length > 6 ? '418px' : 'auto' }}
        >
          <tr className="bg-white position-sticky top-0 w-100">
            <td colSpan={contactTabs === 'Current' ? 5 : 4} className="pb-0">
              <div className="filterBar p-0">
                <div className="tabs border-0 mb-0">
                  <ul>
                    <li>
                      <Link
                        onClick={() => setContactTabs('Current')}
                        className={
                          contactTabs === 'Current' ? 'active' : 'fw-medium'
                        }
                      >
                        Current
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => setContactTabs('Past')}
                        className={
                          contactTabs === 'Past' ? 'active' : 'fw-medium'
                        }
                      >
                        Past
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
          {accountContactsList.length > 0 ? (
            <tr className="bg-white">
              <td className="tableTD tableHead" style={{ width: '35%' }}>
                Role
              </td>
              <td className="tableTD tableHead" style={{ width: '20%' }}>
                Name
              </td>
              {contactTabs === 'Current' ? (
                <>
                  <td className="tableTD tableHead" style={{ width: '20%' }}>
                    Phone
                  </td>
                  <td className="tableTD tableHead" style={{ width: '20%' }}>
                    Closeout
                  </td>
                  <td className="tableTD tableHead"></td>
                </>
              ) : (
                <>
                  <td className="tableTD tableHead" style={{ width: '22%' }}>
                    Start Date
                  </td>
                  <td className="tableTD tableHead" style={{ width: '23%' }}>
                    End Date
                  </td>
                </>
              )}
            </tr>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">No contacts found</td>
            </tr>
          )}
          {accountContactsList.length > 0 &&
            accountContactsList.map((item) => {
              return (
                <tr key={item.id}>
                  <td
                    className="tableTD col1"
                    style={{ width: '35%', whiteSpace: 'nowrap' }}
                  >
                    {item?.role_id?.name || '-'}
                  </td>
                  <td
                    className="tableTD col2"
                    style={{
                      width: '20%',
                      color: '#005375',
                      wordBreak: 'break-word',
                    }}
                  >
                    <span
                      className={'externalLink'}
                      style={{ wordBreak: 'break-word', cursor: 'pointer' }}
                    >
                      <Link
                        to={`/crm/contacts/volunteers/${item.record_id.id}/view`}
                        target="_blank"
                      >
                        {item?.record_id?.first_name}{' '}
                        {item?.record_id?.last_name || ''}
                      </Link>
                    </span>
                  </td>
                  {contactTabs === 'Current' ? (
                    <>
                      <td
                        className="tableTD col2"
                        style={{
                          width: '20%',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {contactRows[item?.record_id?.id]?.phone || '-'}
                      </td>
                      <td
                        className="tableTD col2"
                        style={{ width: '20%', whiteSpace: 'nowrap' }}
                      >
                        {item?.closeout_date
                          ? moment(item?.closeout_date).format('MM-DD-YYYY')
                          : ''}
                      </td>
                      <td className="tableTD col2 px-0" style={{ width: '5%' }}>
                        {item.closeout_date ? (
                          <img
                            src={Closeout2}
                            style={{ width: '17px' }}
                            alt="closeout"
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedContactId(item?.id);
                              setCloseOutDateModal(true);
                              setCloseoutDateInput(
                                new Date(item.closeout_date)
                              );
                            }}
                          />
                        ) : (
                          <img
                            src={Closeout1}
                            style={{ width: '17px' }}
                            alt="closeout"
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedContactId(item?.id);
                              setCloseOutDateModal(true);
                              setCloseoutDateInput(null);
                            }}
                          />
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className="tableTD col2"
                        style={{ width: '22%', whiteSpace: 'nowrap' }}
                      >
                        {item?.created_at
                          ? moment(item?.created_at).format('MM-DD-YYYY')
                          : ''}
                      </td>
                      <td
                        className="tableTD col2"
                        style={{ width: '23%', whiteSpace: 'nowrap' }}
                      >
                        {item?.closeout_date
                          ? moment(item?.closeout_date).format('MM-DD-YYYY')
                          : ''}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>

      <section
        className={`popup full-section ${addContactsModal ? 'active' : ''}`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Add Contacts</h3>
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
            <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
              <TableList
                isLoading={isLoading}
                data={Object.values(contactRows)}
                headers={TableHeaders}
                checkboxValues={selectedContacts}
                handleCheckboxValue={(row) => row.id}
                handleCheckbox={setSelectedContacts}
                selectOptions={contactRoles}
                selectValues={selectedRoles}
                setSelectValues={setSelectedRoles}
              />
            </div>

            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                onClick={() => {
                  if (
                    selectedContacts.length > 0 ||
                    Object.keys(selectedRoles).length > 0
                  ) {
                    setCloseModal(true);
                  } else {
                    setAddContactsModal(false);
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-primary"
                onClick={submitContacts}
                disabled={buttonDisabled}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`popup full-section ${closeOutDateModal ? 'active' : ''}`}
      >
        <div className="popup-inner" style={{ maxWidth: '500px' }}>
          <div className="icon">
            <img
              style={{ width: '20%' }}
              src={CloseOutImage}
              alt="CancelIcon"
              className="bg-white"
            />
          </div>
          <div className="content">
            <h3>Close Out Contact</h3>
            <p>
              Contacts will move to the Past tab when the scheduled close out
              date has passed.
            </p>
            <ReactDatePicker
              minDate={new Date()}
              dateFormat="MM-dd-yyyy"
              className={`custom-datepicker mt-4 w-100`}
              placeholderText="Date"
              selected={closeoutDateInput}
              onChange={(date) => {
                setCloseoutDateInput(date);
              }}
            />
            <div className="buttons">
              <button
                className="btn btn-secondary"
                style={{ width: '47%' }}
                onClick={() => setCloseOutDateModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ width: '47%' }}
                className="btn btn-primary"
                onClick={(e) => {
                  if (closeoutDateInput === null) {
                    toast.error('Date cannot be empty!');
                  } else {
                    handleSubmitCloseoutDate();
                  }
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </section>
      {closeModal === true ? (
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={false}
          setModalPopUp={setCloseModal}
          redirectPath={'/crm/accounts'}
          methodsToCall={true}
          methods={() => {
            setAddContactsModal(false);
          }}
        />
      ) : null}
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Account contacts added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => setShowModel(false)}
        />
      ) : null}
    </>
  );
}

export default ContactsSection;
