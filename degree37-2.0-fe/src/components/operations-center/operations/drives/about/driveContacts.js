import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TableList from '../../../../common/tableListing';
import CancelModalPopUp from '../../../../common/cancelModal';
import * as _ from 'lodash';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../common/successModal';
import SvgComponent from '../../../../common/SvgComponent';

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

function DriveContactsSection({ driveData, getDriveData }) {
  const { id } = useParams();
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
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bearerToken = localStorage.getItem('token');
  // const [allRoles, setAllRoles] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedContactID, setSelectedContactID] = useState(null);
  const [showModelDeletionSuccess, setShowModelDeletionSuccess] =
    useState(false);

  // useEffect(() => {
  //   if (Object.values(selectedRoles)?.length > 0) {
  //     if (
  //       Object.values(selectedRoles).some(
  //         (item) => item.label === 'Primary Chairperson'
  //       )
  //     ) {
  //       const dupArr = [...contactRoles];
  //       const findIndex = dupArr.findIndex(
  //         (item) => item.label === 'Primary Chairperson'
  //       );
  //       if (findIndex !== -1) {
  //         dupArr.splice(findIndex, 1);
  //       }
  //       setContactRoles(dupArr);
  //     } else if (contactRoles.length !== allRoles.length) {
  //       setContactRoles(allRoles);
  //     }
  //   }
  // }, [selectedRoles]);

  useEffect(() => {
    if (driveData !== null) {
      fetchAllVolunteerContacts(driveData);
    }
  }, [driveData]);
  useEffect(() => {
    if (searchText.length > 2 || searchText.length === 0) {
      fetchAllVolunteerContacts(driveData);
    }
  }, [searchText]);

  const fetchAllVolunteerContacts = async (driveData) => {
    try {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/${driveData?.account?.id}/account-contacts?is_current=true`
      );
      const accountRelatedContacts = await result.json();
      if (accountRelatedContacts?.data?.length > 0) {
        const contactsArray =
          accountRelatedContacts?.data?.map((item) => item?.record_id?.id) ||
          [];
        const contactsObject = _.keyBy(
          accountRelatedContacts?.data,
          'record_id.id'
        );
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/contact-volunteer?fetchAll=true&status=true${
            searchText && searchText.length ? '&name=' + searchText : ''
          }`
        );
        const data = await response.json();
        if (data.status !== 500) {
          if (data.data.length > 0) {
            const contactData = data.data.filter((item) =>
              contactsArray.includes(item.volunteer_id)
            );
            let outputDataArray = [];
            for (const inputData of contactData) {
              const outputData = {
                ...inputData,
                id: contactsObject?.[inputData?.volunteer_id]?.id,
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
      } else {
        setContactRows({});
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
    if (driveData != null) {
      getAccountContacts(driveData);
    }
  }, [driveData]);
  const getAccountContacts = async (driveData) => {
    const existingContacts =
      driveData?.drive?.drive_contacts?.map((item) => {
        return {
          id: item?.id,
          record_id: { id: item?.accounts_contacts_id },
          contactable_id: { id: item?.drive_id },
          role_id: item?.role,
        };
      }) || [];
    setAccountContactsList(existingContacts);
  };

  const getContactRoles = async () => {
    const deviceTypeUrl = `${BASE_URL}/contact-roles?fetchAll=true&status=${true}`;
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
    // setAllRoles(mappedData);
  };

  useEffect(() => {
    if (accountContactsList.length > 0 && !closeModal) {
      setSelectedContacts(
        accountContactsList.map((item) => item.record_id.id.toString())
      );
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
        if (!selectedContacts.includes(item.record_id?.id?.toString())) {
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
        // if (
        //   !selectedContacts.some(
        //     (roleCompare) =>
        //       selectedRoles?.[roleCompare]?.label === 'Primary Chairperson'
        //   )
        // ) {
        //   setButtonDisabled(false);
        //   return toast.error(
        //     'Atleast one contact with Primary chairperson role is required.'
        //   );
        // }
        // if (
        //   selectedContacts.filter(
        //     (roleCompare) =>
        //       selectedRoles?.[roleCompare]?.label === 'Primary Chairperson'
        //   ).length > 1
        // ) {
        //   setButtonDisabled(false);
        //   return toast.error(
        //     'There can only be one contact with Primary Chairperson role.'
        //   );
        // }
        const dupArr = [...selectedContacts];
        const dupArrDelete = [...deletedContacts];
        if (selectedContacts.length > 0) {
          accountContactsList.forEach((item) => {
            if (
              selectedContacts.includes(item.record_id?.id.toString()) &&
              +item?.role_id?.id === +selectedRoles[item.record_id?.id]?.value
            ) {
              const indexToRemove = dupArr.findIndex(
                (record) => +record === +item.record_id?.id
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
              drive_id: id,
              accounts_contacts_id: item,
              role_id: selectedRoles[item]?.value,
            };
          }),
        };
        try {
          const response = await makeAuthorizedApiRequest(
            'POST',
            `${BASE_URL}/drives/${id}/contacts`,
            JSON.stringify(body)
          );
          let data = await response.json();
          if (data?.status === 'success') {
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
      toast.error('Atleast one contact is required.');
    }
    setButtonDisabled(false);
    setDeletedContacts([]);
  };

  const handleRemoveContact = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/drives/${id}/contacts/${selectedContactID}`,
        JSON.stringify({ id: selectedContactID })
      );
      let data = await response.json();
      if (data?.status === 'success') {
        setArchiveModal(false);
        setShowModelDeletionSuccess(true);
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

                <button
                  onClick={() => setAddContactsModal(true)}
                  className="btn btn-link btn-md bg-transparent"
                >
                  Add Contacts
                </button>
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
          {accountContactsList.length > 0 ? (
            <tr className="bg-white">
              <td className="tableTD tableHead" style={{ width: '35%' }}>
                Role
              </td>
              <td className="tableTD tableHead" style={{ width: '20%' }}>
                Name
              </td>

              <td className="tableTD tableHead" style={{ width: '20%' }}>
                Contact
              </td>

              <td className="tableTD tableHead"></td>
            </tr>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">No contacts found</td>
            </tr>
          )}
          {accountContactsList.length > 0 &&
            accountContactsList.map((item) => {
              const person = contactRows?.[item?.record_id?.id];
              if (person) {
                return (
                  <tr key={item.id}>
                    <td
                      className="tableTD col2"
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
                          {person?.name}
                        </Link>
                      </span>
                    </td>

                    <td
                      className="tableTD col2"
                      style={{
                        width: '20%',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {person?.phone || '-'}
                    </td>
                    <td className="tableTD col2 px-0" style={{ width: '5%' }}>
                      <div
                        onClick={() => {
                          setSelectedContactID(item?.id);
                          setArchiveModal(true);
                        }}
                        style={{ width: 'fit-content', cursor: 'pointer' }}
                      >
                        <SvgComponent name={'DrivesCrossIcon'} />
                      </div>
                    </td>
                  </tr>
                );
              }
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
              {selectedRoles && selectedContacts && contactRoles && (
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
              )}
            </div>

            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                onClick={() => {
                  const condition = accountContactsList.filter((item) =>
                    selectedContacts.includes(item.record_id?.id?.toString())
                  );
                  const roleIDs = accountContactsList.map((item) =>
                    item.role_id.id.toString()
                  );
                  const condition2 = Object.values(selectedRoles).filter(
                    (role) => roleIDs.includes(role.value.toString())
                  );
                  if (
                    condition.length !== accountContactsList.length ||
                    condition2.length !== accountContactsList.length
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
          onConfirm={() => {
            getDriveData(id);
            setShowModel(false);
          }}
        />
      ) : null}
      <SuccessPopUpModal
        title={'Confirmation'}
        message={'Are you sure you want to archive?'}
        modalPopUp={archiveModal}
        setModalPopUp={setArchiveModal}
        showActionBtns={false}
        isArchived={true}
        archived={() => handleRemoveContact()}
        isNavigate={false}
        redirectPath={''}
      />
      {showModelDeletionSuccess === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive contact removed successfully."
          modalPopUp={showModelDeletionSuccess}
          isNavigate={true}
          setModalPopUp={setShowModelDeletionSuccess}
          showActionBtns={true}
          onConfirm={() => {
            getDriveData(id);
            setShowModelDeletionSuccess(false);
          }}
        />
      ) : null}
    </>
  );
}

export default DriveContactsSection;
