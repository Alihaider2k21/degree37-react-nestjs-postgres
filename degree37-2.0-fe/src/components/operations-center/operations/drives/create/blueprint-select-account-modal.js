import React, { useEffect, useState } from 'react';
import styles from '../index.module.scss';
import { Modal } from 'react-bootstrap';
import TableList from '../../../../common/tableListing';
import TopBar from '../../../../common/topbar/index';

export default function BluePrintSelectAccountsModal({
  blueprintSelectAccountModal,
  setBlueprintSelectAccountModal,
  selectedAccount,
  setSelectedAccount,
  accountRows,
  accountsSearchText,
  setAccountsSearchText,
}) {
  const [tempSelectedAccount, setTempSelectedAccount] = useState([]);

  useEffect(() => {
    if (selectedAccount) setTempSelectedAccount([selectedAccount.id]);
  }, [selectedAccount, blueprintSelectAccountModal]);

  const TableHeaders = [
    {
      name: 'label',
      label: 'Account',
      sortable: false,
    },
    {
      name: 'alternate_name',
      label: 'Alternate Name',
      sortable: false,
    },
    {
      name: 'street_address',
      label: 'Street Address',
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
  ];

  const submitAccounts = async () => {
    console.log({ tempSelectedAccount });
    const account = accountRows?.filter(
      (item) => item.id === tempSelectedAccount?.[0]
    )?.[0];
    setSelectedAccount(account);
    setBlueprintSelectAccountModal(false);
  };

  return (
    <Modal
      show={blueprintSelectAccountModal}
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
              selectSingle={true}
              showAllCheckBoxListing={false}
              data={accountRows}
              headers={TableHeaders}
              checkboxValues={tempSelectedAccount}
              handleCheckboxValue={(row) => row.id}
              handleCheckbox={setTempSelectedAccount}
            />
          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
            <p
              onClick={() => {
                setBlueprintSelectAccountModal(false);
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
