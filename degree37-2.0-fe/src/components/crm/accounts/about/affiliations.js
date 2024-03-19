import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CancelModalPopUp from '../../../common/cancelModal';
import moment from 'moment';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import DatePicker from '../../../common/DatePicker';
import Closeout1 from '../../../../assets/images/closeout1.png';
import Closeout2 from '../../../../assets/images/closeout2.png';
import AffiliationCloseOutImage from '../../../../assets/images/affiliation-closeout.png';
import SuccessPopUpModal from '../../../common/successModal';
import AddAffiliationsModal from './add-affiliations-modal';
import dayjs from 'dayjs';
function AffiliationsSection() {
  const { account_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [closeModal, setCloseModal] = useState(false);
  const [affiliationTabs, setAffiliationTabs] = useState('Current');
  const [affiliationCloseOutDateModal, setAffiliationCloseOutDateModal] =
    useState(false);
  const [affiliationCloseoutDateInput, setAffiliationCloseoutDateInput] =
    useState(null);
  const [selectedAffiliationId, setSelectedAffiliationId] = useState(null);
  const [addAffiliationModal, setAddAffiliationModal] = useState(false);
  const [affiliationSearch, setAffiliationSearch] = useState('');
  const [affiliationList, setAffiliationList] = useState([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState([]);
  const [accountAffiliationsList, setAccountAffiliationsList] = useState([]);
  const bearerToken = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);

  const [modalMessage, setModalMessage] = useState(
    'Account affiliations updated.'
  );

  useEffect(() => {
    if (accountAffiliationsList.length > 0) {
      setSelectedAffiliations(
        accountAffiliationsList.map((item) =>
          item?.affiliation_id?.id.toString()
        )
      );
    }
  }, [accountAffiliationsList?.length, closeModal, addAffiliationModal]);

  useEffect(() => {
    getAccountAffiliations(account_id);
  }, [account_id, affiliationTabs]);

  const getAccountAffiliations = async (account_id) => {
    setAccountAffiliationsList([]);
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/${account_id}/account-affiliations?is_current=${
        affiliationTabs === 'Current'
      }`
    );
    const { data } = await result.json();
    if (data) {
      setAccountAffiliationsList(data);
    }
  };
  const handleSubmitAffiliationCloseoutDate = async () => {
    try {
      const inputDate = moment(affiliationCloseoutDateInput);
      let closeout_date = inputDate.isValid() ? inputDate.format() : null;

      const body = {
        closeout_date: closeout_date,
      };
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/accounts/${account_id}/account-affiliations/${selectedAffiliationId}`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        getAccountAffiliations(account_id);
        setAffiliationCloseOutDateModal(false);
        setModalMessage(data?.response);
        setShowModal(true);
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

  useEffect(() => {
    if (affiliationSearch === '' || affiliationSearch.length > 2)
      fetchAllAffiliation();
  }, [affiliationSearch]);

  const fetchAllAffiliation = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/affiliations/bycollectionoperation?name=${affiliationSearch}&status=${true}`,
        {
          headers: {
            method: 'GET',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      setAffiliationList(
        data?.data?.map((item) => {
          return {
            ...item,
            id: item.id.toString(),
          };
        }) ?? []
      );
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const selected = [];
    const others = [];
    affiliationList?.map((item) => {
      if (selectedAffiliations.includes(item.id.toString()))
        selected.push(item);
      else others.push(item);
    });
    setAffiliationList([...selected, ...others]);
  }, [selectedAffiliations]);

  const submitAffiliations = async (selected) => {
    const allAffiliations = [...selected];
    accountAffiliationsList.forEach((item) => {
      if (allAffiliations.includes(item.toString())) {
        const indexToRemove = allAffiliations.findIndex(
          (record) => +record === +item
        );
        allAffiliations.splice(indexToRemove, 1);
      }
    });

    let deletedAffiliations = [];
    const dupArr = [];
    accountAffiliationsList.forEach((item) => {
      if (!selected.includes(item)) {
        dupArr.push(item.id);
      }
    });
    deletedAffiliations = dupArr;

    const body = {
      deleteAffiliations: deletedAffiliations,
      allAffiliations: allAffiliations,
    };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/accounts/${account_id}/account-affiliations`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        getAccountAffiliations(account_id);
        setAddAffiliationModal(false);
        setModalMessage('Account affiliations updated');
        setShowModal(true);
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
    } finally {
      setSelectedAffiliations(selected);
    }
  };

  return (
    <>
      <table className="viewTables w-100 mt-4">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Affiliations</span>
                {affiliationTabs === 'Current' && (
                  <button
                    onClick={() => setAddAffiliationModal(true)}
                    className="btn btn-link btn-md bg-transparent"
                  >
                    Add Affiliation
                  </button>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          className={`overflow-y-auto w-100 ${
            accountAffiliationsList.length > 5 ? ' d-block' : ''
          }`}
          style={{
            height: accountAffiliationsList.length > 5 ? '364px' : 'auto',
          }}
        >
          <tr className="bg-white position-sticky top-0 w-100">
            <td
              colSpan={affiliationTabs === 'Current' ? 5 : 4}
              className="pb-0"
            >
              <div className="filterBar p-0">
                <div className="tabs border-0 mb-0">
                  <ul>
                    <li>
                      <Link
                        onClick={() => setAffiliationTabs('Current')}
                        className={
                          affiliationTabs === 'Current' ? 'active' : 'fw-medium'
                        }
                      >
                        Current
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={() => setAffiliationTabs('Past')}
                        className={
                          affiliationTabs === 'Past' ? 'active' : 'fw-medium'
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
          {accountAffiliationsList.length > 0 ? (
            <tr className="bg-white">
              <td className="tableTD tableHead" style={{ width: '30%' }}>
                Affiliation Name
              </td>
              <td className="tableTD tableHead" style={{ width: '20%' }}>
                Start
              </td>
              <td className="tableTD tableHead" style={{ width: '20%' }}>
                User
              </td>
              {affiliationTabs === 'Current' ? (
                <>
                  <td className="tableTD tableHead" style={{ width: '20%' }}>
                    Closeout
                  </td>
                  <td className="tableTD tableHead"></td>
                </>
              ) : (
                <>
                  <td className="tableTD tableHead" style={{ width: '23%' }}>
                    End Date
                  </td>
                </>
              )}
            </tr>
          ) : (
            <tr>
              <td className="no-data text-sm text-center">
                No affiliations found
              </td>
            </tr>
          )}
          {accountAffiliationsList.length > 0 &&
            accountAffiliationsList.map((item) => {
              return (
                <tr key={item.id}>
                  <td
                    className="tableTD col1"
                    style={{ width: '30%', wordBreak: 'break-word' }}
                  >
                    {item?.affiliation_id?.name || '-'}
                  </td>
                  <td className="tableTD col2" style={{ width: '20%' }}>
                    {item?.created_at
                      ? moment(item?.created_at).utc().format('MM-DD-yyyy')
                      : ''}
                  </td>
                  <td
                    className="tableTD col2"
                    style={{
                      width: '20%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {`${item?.created_by?.first_name} ${
                      item?.created_by?.last_name || ''
                    }`}
                  </td>
                  {affiliationTabs === 'Current' ? (
                    <>
                      <td className="tableTD col2" style={{ width: '20%' }}>
                        {item?.closeout_date
                          ? dayjs(item?.closeout_date).format('MM-DD-YYYY')
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
                              setSelectedAffiliationId(item?.id);
                              setAffiliationCloseOutDateModal(true);
                              setAffiliationCloseoutDateInput(
                                new Date(item?.closeout_date)
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
                              setSelectedAffiliationId(item?.id);
                              setAffiliationCloseOutDateModal(true);
                              setAffiliationCloseoutDateInput(null);
                            }}
                          />
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="tableTD col2" style={{ width: '20%' }}>
                        {item?.closeout_date
                          ? dayjs(item?.closeout_date).format('MM-DD-YYYY')
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
        className={`popup full-section ${
          affiliationCloseOutDateModal ? 'active' : ''
        }`}
      >
        <div className="popup-inner" style={{ maxWidth: '500px' }}>
          <div className="icon">
            <img
              style={{ width: '20%' }}
              src={AffiliationCloseOutImage}
              alt="CancelIcon"
              className="bg-white"
            />
          </div>
          <div className="content">
            <h3>Close Out Affiliation</h3>
            <p className="mb-4">
              Affiliation will move to the Past tab when the scheduled close out
              date has passed.
            </p>
            <DatePicker
              minDate={new Date()}
              dateFormat="MM-dd-yyyy"
              className={`custom-datepicker w-100`}
              placeholderText="Date"
              selected={affiliationCloseoutDateInput}
              onChange={(date) => {
                setAffiliationCloseoutDateInput(date);
              }}
            />
            <div className="buttons">
              <button
                className="btn btn-secondary"
                style={{ width: '47%' }}
                onClick={() => setAffiliationCloseOutDateModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ width: '47%' }}
                className="btn btn-primary"
                onClick={(e) => {
                  handleSubmitAffiliationCloseoutDate();
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </section>
      <AddAffiliationsModal
        setAddAffiliationsModal={setAddAffiliationModal}
        addAffiliationsModal={addAffiliationModal}
        dataRows={affiliationList}
        searchText={affiliationSearch}
        setSearchText={setAffiliationSearch}
        selectedItems={selectedAffiliations}
        setSelectedItems={setSelectedAffiliations}
        onSubmit={submitAffiliations}
      />
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
            setAddAffiliationModal(false);
          }}
        />
      ) : null}
      {showModal === true ? (
        <SuccessPopUpModal
          title="Success!"
          message={modalMessage}
          modalPopUp={showModal}
          isNavigate={true}
          setModalPopUp={setShowModal}
          showActionBtns={true}
          onConfirm={() => setShowModal(false)}
        />
      ) : null}
    </>
  );
}

export default AffiliationsSection;
