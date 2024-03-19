import React, { useState } from 'react';
import styles from './index.module.scss';
import CancelIconImage from '../../../assets/images/ConfirmCancelIcon.png';
import DatePicker from 'react-datepicker';
import PrintTemplate from '../PrintTemplate';

const initialDate = {
  startDate: null,
  endDate: null,
};

const PrintModal = ({
  visible,
  onCancel,
  icon,
  heading,
  description,
  classes,
  cancelBtnText = 'Cancel',
  confirmBtnText = 'Print',
  disabled = false,
  onPrint,
  printingData,
}) => {
  const [printRangeDate, setPrintRangeDate] = useState(initialDate);
  const [dateCrossColor, setDateCrossColor] = useState('#cccccc');

  const resetDateHandler = () => {
    setPrintRangeDate({ ...initialDate });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const value = { startDate: start, endDate: end };
    setPrintRangeDate(value);
  };

  const handlePrint = () => {
    if (printRangeDate?.startDate && printRangeDate?.endDate) {
      onPrint(printRangeDate?.startDate, printRangeDate?.endDate);
      resetDateHandler();
    }
  };

  return (
    <section
      className={`${styles.popup} ${visible && styles.active} ${
        classes?.root ?? ''
      }`}
    >
      <div className={`${styles.popupInner} ${classes?.inner ?? ''}`}>
        <div className={styles.icon}>
          <img src={icon ? icon : CancelIconImage} alt="CancelIcon" />
        </div>
        <div className={styles.content}>
          {heading ? <h3>{heading}</h3> : ''}
          {description ? <p>{description}</p> : ''}
          <form>
            <div className={`${styles.fieldDate} w-100`}>
              <DatePicker
                dateFormat="MM/dd/yy"
                className={`custom-datepicker ${styles.datepicker}`}
                style={{ minWidth: '19rem' }}
                selected={printRangeDate.startDate}
                onChange={handleDateChange}
                startDate={printRangeDate.startDate}
                endDate={printRangeDate.endDate}
                selectsRange
                placeholderText="Dates"
              />
              {(printRangeDate?.startDate || printRangeDate?.endDate) && (
                <span
                  className={`position-absolute ${styles.dateCross}`}
                  onClick={resetDateHandler}
                >
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className="css-tj5bde-Svg"
                    onMouseEnter={() => setDateCrossColor('#999999')}
                    onMouseLeave={() => setDateCrossColor('#cccccc')}
                  >
                    <path
                      fill={dateCrossColor}
                      d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
                    ></path>
                  </svg>
                </span>
              )}
              {(printRangeDate?.startDate || printRangeDate?.endDate) && (
                <label>Dates</label>
              )}
            </div>
          </form>
          <div className={`${styles.buttons} ${classes?.btnGroup ?? ''}`}>
            <button
              className={`btn btn-secondary ${classes?.btn ?? ''}`}
              onClick={onCancel}
            >
              {cancelBtnText}
            </button>
            <button
              className={`btn btn-primary ${classes?.btn ?? ''}`}
              onClick={() => handlePrint()}
              disabled={disabled}
            >
              {confirmBtnText}
            </button>
          </div>
        </div>
      </div>
      <div className="hidden">
        <PrintTemplate scheduleData={printingData} />
      </div>
    </section>
  );
};

export default PrintModal;
