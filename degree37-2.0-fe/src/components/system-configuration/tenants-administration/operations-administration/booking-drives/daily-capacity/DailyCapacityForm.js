import React, { useEffect, useState } from 'react';
const exceptThisSymbols = ['e', 'E', '+', '-', '.'];
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
      <p htmlFor={name}>{label}</p>
      <div className="field">
        <input
          type={type}
          disabled={isDisabled}
          id={name}
          min={0}
          onKeyDown={(e) =>
            exceptThisSymbols.includes(e.key) && e.preventDefault()
          }
          style={{ marginTop: !label ? '32px' : '' }}
          className={'form-control'}
          name={name}
          placeholder=" "
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
        <label htmlFor={name}>{placeholder}</label>
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

const DailyCapacityForm = ({
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
    newInputs[index].value = +value;
    if (
      typeof value === 'string' &&
      value.startsWith('0') &&
      value.length > 1
    ) {
      newInputs[index].value = value.slice(1);
    }
    if (value > 999) {
      newInputs[index].value = 999;
    }
    setInputs(newInputs);
    setFormData(newInputs);
    newInputs[index].error = '';
  };

  const handleInputBlur = (index) => {
    const value = inputs[index].value;
    if (value === '') {
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
    <div className="row w-100">
      {inputs.map((input, index) => (
        <InputField
          key={input.name}
          label={input.isDrive}
          type="number"
          name={input.name}
          placeholder={`${input.label}*`}
          value={input.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onBlur={() => handleInputBlur(index)}
          error={input.error}
          isDisabled={isDisabled}
        />
      ))}
    </div>
  );
};

export default DailyCapacityForm;
