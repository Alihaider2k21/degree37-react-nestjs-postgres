import React, { useEffect, useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
const InputField = ({
  type = 'number',
  name,
  placeholder,
  label,
  value,
  onChange,
  onBlur,
  error,
  isDisabled,
}) => {
  return (
    <div className="form-field col-md-6">
      <p htmlFor={name} style={{ paddingBottom: '7px' }}>
        {label ? label : <i>&nbsp;</i>}
      </p>
      <div className="field">
        <TimePicker
          name={name}
          disabled={isDisabled}
          value={dayjs(value)}
          onChange={onChange}
          placeholder={placeholder}
          label={placeholder}
          slotProps={{ textField: { error: false } }}
          sx={{
            '& .MuiInputBase-root': {
              height: '56px',
              borderRadius: '8px',
            },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#387de5',
                transition: 'all 0.3s ease',
              },
            },
          }}
        />
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

const DailyHourForm = ({
  setFormData,
  setErrors,
  initialInputState,
  isDisabled = false,
}) => {
  const [inputs, setInputs] = useState(initialInputState);
  useEffect(() => {
    setInputs(initialInputState);
  }, [initialInputState]);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index].value = value;
    setInputs(newInputs);
    setFormData(newInputs);
    newInputs[index].error = '';
    for (const day of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
      const earliestDepartTimeInput = newInputs.find(
        (input) => input.name === `${day}_earliest_depart_time`
      );
      const latestReturnTimeInput = newInputs.find(
        (input) => input.name === `${day}_latest_return_time`
      );
      if (earliestDepartTimeInput.value && latestReturnTimeInput.value) {
        const earliestDepartTime = dayjs(earliestDepartTimeInput.value);
        const latestReturnTime = dayjs(latestReturnTimeInput.value);

        if (earliestDepartTime.isAfter(latestReturnTime)) {
          latestReturnTimeInput.error = `Latest return time should be after earliest depart time for ${day}`;
          setInputs(newInputs);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [latestReturnTimeInput.label]: `Latest return time should be after earliest depart time for ${day}`,
          }));
        } else {
          latestReturnTimeInput.error = '';
          setInputs(newInputs);
          setErrors((prevErrors) => ({
            ...prevErrors,
            [latestReturnTimeInput.label]: '',
          }));
        }
      }
    }
  };
  const handleInputBlur = (index) => {
    const value = inputs[index].value;
    if (!value) {
      const newInputs = [...inputs];
      newInputs[index].error = `${newInputs[index].label} is required`;
      setInputs(newInputs);
      setFormData(newInputs);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [newInputs[index].label]: `${newInputs[index].label} is required`,
      }));
    } else {
      const newInputs = [...inputs];
      newInputs[index].error = '';
      setErrors((prevErrors) => ({
        ...prevErrors,
        [newInputs[index].label]: '',
      }));
      setInputs(newInputs);
      setFormData(newInputs);
    }
  };

  return (
    <div className="row daily-hour">
      {inputs.map((input, index) => (
        <InputField
          key={input.name}
          label={input.isDrive}
          type="number"
          name={input.name}
          placeholder={`${input.label}*`}
          value={input.value}
          onChange={(value) => handleInputChange(index, value)}
          onBlur={() => handleInputBlur(index)}
          error={input.error}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

export default DailyHourForm;
