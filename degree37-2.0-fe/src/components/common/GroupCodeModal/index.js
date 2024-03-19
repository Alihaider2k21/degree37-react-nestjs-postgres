import React from 'react';
import TableList from '../tableListing';

const GroupCodeModal = ({
  isLoading,
  filteredGroupCodeRows,
  GroupCodesTableHeaders,
  addGroupCodesModal,
  handleGroupCodeSearch,
  setSearchText,
  setSelectedGroupCodes,
  setAddGroupCodesModal,
  submitGroupCodes,
  selectedGroupCodes,
  dateValues,
  setDateValues,
  searchText,
}) => {
  return !isLoading ? (
    <section
      className={`aboutAccountMain popup full-section ${
        addGroupCodesModal ? 'active' : ''
      }`}
    >
      <div
        className="popup-inner"
        style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
      >
        <div className="content">
          <div className="d-flex align-items-center justify-between">
            <h3>Add Group Codes</h3>
            <div className="search">
              <div className="formItem">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => handleGroupCodeSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
            <TableList
              isLoading={isLoading}
              data={Object.values(filteredGroupCodeRows)}
              headers={GroupCodesTableHeaders}
              checkboxValues={selectedGroupCodes}
              handleCheckboxValue={(row) => row.id}
              handleCheckbox={setSelectedGroupCodes}
              dateValues={dateValues}
              setDateValues={setDateValues}
              searchQuery={searchText}
            />
          </div>
          <div className="buttons d-flex align-items-center justify-content-end mt-4">
            <button
              className="btn btn-link"
              onClick={() => {
                setSearchText('');
                setSelectedGroupCodes([]);
                setAddGroupCodesModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-md btn-primary"
              onClick={submitGroupCodes}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  ) : (
    ''
  );
};

export default GroupCodeModal;
