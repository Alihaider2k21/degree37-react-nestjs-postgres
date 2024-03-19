import TimePicker from 'rc-time-picker';
import React from 'react';
import SvgComponent from '../../../common/SvgComponent';
import styles from './index.module.scss';

const NcpBlueprintTimerInput = ({
  value,
  onChange,
  placeholder,
  error,
  timeGap = null,
  onBlur = () => {},
}) => {
  return (
    <div className="form-field daily-hour">
      <div className={`field position-relative`}>
        <TimePicker
          placeholder={placeholder}
          value={value}
          showSecond={false}
          onChange={onChange}
          allowEmpty
          use12Hours
          clearIcon={true}
          onClose={onBlur}
          minuteStep={timeGap ? timeGap : 1}
          inputIcon={<SvgComponent name={'TimeClock'} />}
        />
        {value && (
          <label className={`position-absolute ${styles.labelTimer}`}>
            {placeholder}
          </label>
        )}
      </div>
      {error && (
        <div className="error">
          <div className="error">
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NcpBlueprintTimerInput;
