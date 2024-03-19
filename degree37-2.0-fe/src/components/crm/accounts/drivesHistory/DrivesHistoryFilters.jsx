import React, { useState } from 'react';
import styles from './index.module.scss';
import SelectDropdown from '../../../common/selectDropdown';
import DatePicker from '../../../common/DatePicker';
import { Col, Row } from 'react-bootstrap';

export default function DrivesHistoryFilters({
  handleFilter,
  operationStatus,
  setPage,
}) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
    handleFilter({ status: option ? parseInt(option?.value) : '' });
    setPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setDateRange(value);
    handleFilter({ date_range: value });
    setPage(1);
  };

  return (
    <div className="filterBar">
      <div className="filterInner">
        <h2>Filters</h2>
        <form className="d-flex gap-4">
          <div className="filter">
            <Row>
              <Col md={6}>
                <div className="form-field w-100">
                  <div
                    className={`field position-relative ${styles.fieldDate}`}
                  >
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={handleDateChange}
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      placeholderText="Date Range"
                      selectsRange
                    />
                    {(dateRange?.startDate !== null &&
                      dateRange?.endDate !== null) ||
                    (dateRange?.startDate !== null &&
                      dateRange?.endDate === null) ? (
                      <label
                        className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                      >
                        Date Range
                      </label>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col md={2} className="me-5">
                <div className="d-flex w-100 gap-3 me-5">
                  <SelectDropdown
                    styles={{ root: '' }}
                    placeholder={'Status'}
                    showLabel={selectedStatus}
                    defaultValue={selectedStatus}
                    selectedValue={selectedStatus}
                    removeDivider
                    onChange={handleStatusChange}
                    options={operationStatus}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    </div>
  );
}
