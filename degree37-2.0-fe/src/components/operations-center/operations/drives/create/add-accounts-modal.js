import React, { useEffect, useState } from 'react';
import styles from '../index.module.scss';
import { Modal } from 'react-bootstrap';
import TableList from '../../../../common/tableListing';
import TopBar from '../../../../common/topbar/index';
import { toast } from 'react-toastify';

export default function AddAccountsModal({
  setAddAccountsModal,
  addAccountsModal,
  accountRows,
  accountsSearchText,
  setAccountsSearchText,
  selectedAccounts,
  setSelectedAccounts,
  isView,
  onSubmit,
}) {
  const [tempSelectedAccounts, settempSelectedAccounts] = useState([]);

  useEffect(() => {
    settempSelectedAccounts(selectedAccounts);
  }, [selectedAccounts]);

  const TableHeaders = [
    {
      name: 'name',
      label: 'Account',
      sortable: false,
    },
    {
      name: 'collection_operation_name',
      label: 'Collection Operation',
      sortable: false,
    },
    {
      name: 'city',
      label: 'City',
      sortable: false,
    },
    {
      name: 'state',
      label: 'State',
      sortable: false,
    },
    {
      name: '',
      label: '',
      sortable: false,
    },
  ];

  const submitAccounts = async () => {
    if (tempSelectedAccounts.length > 0) {
      setSelectedAccounts(tempSelectedAccounts);
      setAccountsSearchText('');
    } else {
      setAccountsSearchText('');
      toast.error('Atleast one account is required.');
    }
    setAddAccountsModal(false);
  };

  const handleSubmitClick = () => {
    if (isView) {
      onSubmit(tempSelectedAccounts);
      setAddAccountsModal(false);
    } else {
      submitAccounts();
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
            BreadCrumbsTitle={'Add Accounts'}
            SearchValue={accountsSearchText}
            SearchOnChange={(e) => {
              setAccountsSearchText(e.target.value);
            }}
            SearchPlaceholder={'Search Contact'}
          />

          <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
            <TableList
              data={accountRows}
              headers={TableHeaders}
              checkboxValues={tempSelectedAccounts}
              handleCheckboxValue={(row) => row.id}
              handleCheckbox={settempSelectedAccounts}
            />
          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
            <p
              onClick={() => {
                setAccountsSearchText('');
                setAddAccountsModal(false);
              }}
              className={styles.btncancel}
            >
              Cancel
            </p>
            <p className={styles.btnAddContact} onClick={handleSubmitClick}>
              Submit
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
