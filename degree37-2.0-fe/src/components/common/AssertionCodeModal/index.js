import React from 'react';
import TableList from '../tableListing';

const AssertionCodeModal = ({
  isLoading,
  filteredCenterCodeRows,
  CenterCodesTableHeaders,
  addCenterCodesModal,
  handleCenterCodeSearch,
  setSearchText,
  setSelectedCenterCodes,
  setAddCenterCodesModal,
  submitCenterCodes,
  selectedCenterCodes,
  centerDateValues,
  setCenterDateValues,
  searchText,
}) => {
  return !isLoading ? (
    <section
      className={`aboutAccountMain popup full-section ${
        addCenterCodesModal ? 'active' : ''
      }`}
    >
      <div
        className="popup-inner"
        style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
      >
        <div className="content">
          <div className="d-flex align-items-center justify-between">
            <h3>Add Assertion Codes</h3>
            <div className="search">
              <div className="formItem">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => handleCenterCodeSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-y-auto" style={{ height: '50vh' }}>
            <TableList
              isLoading={isLoading}
              data={Object.values(filteredCenterCodeRows)}
              headers={CenterCodesTableHeaders}
              checkboxValues={selectedCenterCodes}
              handleCheckboxValue={(row) => row.id}
              handleCheckbox={setSelectedCenterCodes}
              dateValues={centerDateValues}
              setDateValues={setCenterDateValues}
              searchQuery={searchText}
            />
          </div>
          <div className="buttons d-flex align-items-center justify-content-end mt-4">
            <button
              className="btn btn-link"
              onClick={() => {
                setSearchText('');
                setSelectedCenterCodes([]);
                setAddCenterCodesModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-md btn-primary"
              onClick={submitCenterCodes}
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

export default AssertionCodeModal;
