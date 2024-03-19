import React, { useEffect, useState } from 'react';
import styles from '../index.module.scss';
import { Modal } from 'react-bootstrap';
import TableList from '../../../../common/tableListing';
import TopBar from '../../../../common/topbar/index';

export default function ShareStaffModal({
  setModal,
  modal,
  searchText,
  setSearchText,
  selectedItems,
  staffShareRequired,
  shareStaffData,
}) {
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const showAllCheckBoxListing = false;
  useEffect(() => {
    setTempSelectedItems(selectedItems);
  }, [selectedItems]);

  const TableHeaders = [
    {
      name: 'collection_operation_name',
      label: 'Collection Operation',
      sortable: false,
    },
    {
      name: 'availableStaff',
      label: 'Available Staff',
      sortable: false,
    },
    {
      name: 'type',
      label: 'Type',
      sortable: false,
    },
  ];
  const submitSelection = async () => {
    setModal(false);
  };
  return (
    <Modal
      show={modal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="formGroup">
          <TopBar
            BreadCrumbsData={[]}
            BreadCrumbsTitle={`Share Staff (${staffShareRequired} Required)`}
            SearchValue={searchText}
            SearchOnChange={(e) => {
              setSearchText(e.target.value);
            }}
            SearchPlaceholder={'Search Staff'}
          />

          <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
            <TableList
              data={shareStaffData}
              headers={TableHeaders}
              checkboxValues={tempSelectedItems}
              handleCheckboxValue={(row) => row.collection_operation.id}
              handleCheckbox={setTempSelectedItems}
              showAllCheckBoxListing={showAllCheckBoxListing}
              selectSingle={true}
            />
          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
            <p
              onClick={() => {
                setModal(false);
              }}
              className={styles.btncancel}
            >
              Cancel
            </p>
            <p className={styles.btnAddContact} onClick={submitSelection}>
              Save
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
