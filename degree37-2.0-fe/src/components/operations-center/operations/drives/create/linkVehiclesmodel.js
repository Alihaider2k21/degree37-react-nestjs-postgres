import React, { useEffect, useState } from 'react';
import TableList from '../../../../common/tableListing';
import { Modal } from 'react-bootstrap';
import TopBar from '../../../../common/topbar/index';
import styles from '../index.module.scss';

function LinkVehiclesmodel({
  setModal,
  modal,
  contactRows,
  searchText,
  setSearchText,
  list,
  selectedItems,
  setSelectedItems,
  staffShareRequired,
  setcustomErrors,
  shift,
  shareStaffData,
  selectedLinkDrive,
  setSelectedLinkDrive,
}) {
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const showAllCheckBoxListing = false;
  useEffect(() => {
    setTempSelectedItems(selectedItems);
    setSelectedLinkDrive(selectedItems);
  }, [selectedItems]);
  const TableHeaders = [
    {
      name: 'date',
      label: 'Date',
      sortable: false,
    },
    {
      name: 'account',
      label: 'Account',
      sortable: false,
    },
    {
      name: 'location',
      label: 'Location',
      sortable: false,
    },
    {
      name: 'total_time',
      label: 'Start time - End time',
      sortable: false,
    },

    {
      name: 'vehicles_name',
      label: 'Vehicles',
      sortable: false,
    },
    {
      name: 'staffSetup',
      label: 'Staff Setup',
      sortable: false,
    },
  ];
  // useEffect(() => {
  //   if (tempSelectedItems?.length > 0) {
  //     console.log({ tempSelectedItems });
  //     const dupArr = [];
  //     list.forEach((item) => {
  //       if (!tempSelectedItems.includes(item?.id)) {
  //         dupArr.push(item.id);
  //       }
  //     });
  //   }
  // }, [tempSelectedItems?.length]);
  const submitSelection = async () => {
    setSelectedLinkDrive(tempSelectedItems);
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
            BreadCrumbsTitle={`Link Drive`}
            // SearchValue={searchText}
            // SearchOnChange={(e) => {
            //   setSearchText(e.target.value);
            // }}
            // SearchPlaceholder={'Search Staff'}
          />

          <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
            <TableList
              data={shareStaffData}
              headers={TableHeaders}
              checkboxValue={shareStaffData}
              checkboxValues={tempSelectedItems}
              handleCheckboxValue={(row) => row.id}
              handleCheckbox={setTempSelectedItems}
              showAllCheckBoxListing={showAllCheckBoxListing}
              showAllRadioButtonListing={true}
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

export default LinkVehiclesmodel;
