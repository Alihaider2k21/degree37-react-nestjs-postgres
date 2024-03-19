import React from 'react';
import { LocationType, opertaionType } from '../data';
import SelectDropdown from '../../../../../common/selectDropdown';

const Fliters = ({ setQueryParams, queryParams, clearFilter }) => {
  return (
    <div className="filterBar">
      <div className="filterInner">
        <h2>Filters</h2>
        <div className="filter">
          <form className="d-flex gap-3">
            <SelectDropdown
              placeholder={'Operation Type'}
              defaultValue={queryParams?.operationType}
              selectedValue={queryParams?.operationType}
              removeDivider
              showLabel
              onChange={(value) => {
                setQueryParams((prev) => ({
                  ...prev,
                  operationType: value,
                }));
              }}
              options={opertaionType}
            />

            <SelectDropdown
              placeholder={'Location Type'}
              defaultValue={queryParams?.locationType}
              selectedValue={queryParams?.locationType}
              removeDivider
              showLabel
              onChange={(value) => {
                setQueryParams((prev) => ({
                  ...prev,
                  locationType: value,
                }));
              }}
              options={LocationType}
            />
            <SelectDropdown
              placeholder={'Status'}
              defaultValue={queryParams?.status}
              selectedValue={queryParams?.status}
              removeDivider
              showLabel
              onChange={(value) => {
                setQueryParams((prev) => ({
                  ...prev,
                  status: value,
                }));
              }}
              options={[
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
              ]}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Fliters;
