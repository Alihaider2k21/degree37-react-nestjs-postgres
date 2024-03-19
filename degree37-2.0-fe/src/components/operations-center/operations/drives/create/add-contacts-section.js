import React from 'react';
import styles from '../index.module.scss';
import SvgComponent from '../../../../common/SvgComponent';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function AddContactsSection({
  setAddContactsModal,
  selectedContacts,
  setSelectedContacts,
  selectedRoles,
  setSelectedRoles,
  contactRoles,
  contactRows,
  customErrors,
}) {
  const filterContact = (id) => {
    return Object.values(contactRows)?.filter((item) => item.id === id)[0];
  };
  const filterRole = (id) => {
    return contactRoles?.filter((item) => item.value === id)[0];
  };

  const handleContactRemove = (contactId) => {
    setSelectedContacts(selectedContacts.filter((item) => item !== contactId));
    const tempRoles = selectedRoles;
    delete tempRoles[contactId];
    setSelectedRoles(tempRoles);
  };
  return (
    <div className="formGroup">
      <div className="d-flex ">
        <h5>Add Contacts</h5>
        <span className="ms-2">
          <OverlayTrigger
            placement="right"
            styles={{ maxWidth: '500px' }}
            id="contactTooltip"
            // show={true}
            overlay={(props) => (
              <Tooltip id="addContactsSectionDrivesTooltip" {...props}>
                At least one primary chairperson is required during <br />{' '}
                account creation.
              </Tooltip>
            )}
          >
            <div className={`me-0`}>
              <SvgComponent name={'ToolTipIcon'} />
            </div>
          </OverlayTrigger>
        </span>
      </div>
      <div className="w-100 my-2">
        <div className={`table-responsive ${styles.tableAccount}`}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedRoles &&
                selectedContacts &&
                selectedContacts?.length != 0 &&
                selectedContacts.map((item, index) => {
                  const contact = filterContact(item);
                  const contactRole = filterRole(selectedRoles?.[item]?.value);
                  return (
                    <tr key={index}>
                      <td className="text-nowrap">{contact?.name}</td>
                      <td className="text-nowrap">{contactRole?.label}</td>
                      <td className="text-nowrap">{contact?.email}</td>
                      <td className="text-nowrap">{contact?.phone}</td>
                      <td
                        onClick={() => {
                          handleContactRemove(item);
                        }}
                      >
                        <SvgComponent name={'DrivesCrossIcon'} />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`d-flex ${
          customErrors?.contacts
            ? 'justify-content-between'
            : 'justify-content-end'
        } w-100`}
      >
        {customErrors?.contacts && (
          <p className={styles.error}>{customErrors?.contacts}</p>
        )}
        <p
          onClick={() => {
            setAddContactsModal(true);
          }}
          className={styles.btnAddContact}
        >
          Add Contacts
        </p>
      </div>
    </div>
  );
}
