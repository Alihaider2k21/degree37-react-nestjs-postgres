import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Modal } from 'react-bootstrap';
import TableList from '../../../../common/tableListing';
import TopBar from '../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import jwt from 'jwt-decode';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import ToolTip from '../../../../common/tooltip';

export default function AddAccountsModal({
  setAddAccountsModal,
  addAccountsModal,
  accountRows,
  accountsSearchText,
  setAccountsSearchText,
  selectedAccounts,
  setSelectedAccounts,
  dataItem,
  handleSort,
  setShowModel,
  shiftId,
  handleShiftSlots,
}) {
  const [tempSelectedAccounts, settempSelectedAccounts] = useState([]);
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem('token');
  const decodeToken = jwt(accessToken);
  useEffect(() => {
    settempSelectedAccounts(selectedAccounts);
  }, [selectedAccounts]);

  const TableHeaders = [
    {
      name: 'external_id',
      label: 'Donor ID',
      sortable: true,
    },
    {
      name: 'name',
      label: 'Donor Name',
      sortable: true,
    },
    {
      name: 'primary_email',
      label: 'Email',
      sortable: true,
    },
    {
      name: 'primary_phone',
      label: 'Phone',
      sortable: true,
    },
    {
      name: 'address',
      label: 'Address',
      sortable: true,
    },
    {
      name: 'address_city',
      label: 'City',
      sortable: true,
    },
    {
      name: 'address_state',
      label: 'State',
      sortable: true,
    },
    {
      name: 'zip_code',
      label: 'Zip Code',
      sortable: true,
    },
  ];

  const submitAccounts = async () => {
    if (tempSelectedAccounts.length > 0) {
      setSelectedAccounts(tempSelectedAccounts);
      if (selectedAccounts.length == 1) {
        const donor_appointment = tempSelectedAccounts?.map((e) => {
          return {
            appointmentable_id: +id,
            procedure_type_id: +dataItem?.procedure_type_id,
            slot_id: +dataItem?.id,
            donor_id: +e,
            appointmentable_type: 'drives',
            note: '   ',
            status: '1',
            created_by: +decodeToken?.id,
          };
        });
        const body = {
          donor_appointment: donor_appointment,
        };
        try {
          const response = await makeAuthorizedApiRequest(
            'POST',
            `${BASE_URL}/drives/donors/appointments`,
            JSON.stringify(body)
          );
          const data = await response.json();

          if (data.status === 'success') {
            setAddAccountsModal(false);
            handleShiftSlots(shiftId.procedure_type_id);
            setShowModel(true);
            setSelectedAccounts([]);
          }
        } catch (error) {
          toast.error('Error fetching donor schedules:', error);
        }
      } else {
        toast.error(`Maximum one donor can be selected.`);
      }
    } else {
      toast.error('Minimum one donor is required.');
    }
  };

  return (
    <Modal
      show={addAccountsModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="formGroup">
          <TopBar
            BreadCrumbsData={[]}
            BreadCrumbsTitle={'Search Donor'}
            SearchValue={accountsSearchText}
            SearchOnChange={(e) => {
              setAccountsSearchText(e.target.value);
            }}
            SearchPlaceholder={'Search'}
            icon={
              <ToolTip text={`Search by name, donor id, phone and email.`} />
            }
          />

          <div className="overflow-y-auto" style={{ height: '50vh' }}>
            <div className={styles.customTablesBorderss}>
              <TableList
                data={accountRows}
                headers={TableHeaders}
                checkboxValues={selectedAccounts}
                handleCheckboxValue={(row) => row.donor_id}
                handleCheckbox={setSelectedAccounts}
                handleSort={handleSort}
                showAllCheckBoxListing={false}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
            <p
              onClick={() => {
                setAddAccountsModal(false);
                setSelectedAccounts([]);
              }}
              className={styles.btncancel}
            >
              Cancel
            </p>
            <p className={styles.btnAddContact} onClick={submitAccounts}>
              Submit
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
