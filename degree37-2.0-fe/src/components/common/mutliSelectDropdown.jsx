import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Form from 'react-bootstrap/Form';

const Option = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const style = {
    alignItems: 'end',
    backgroundColor: 'transparent',
    color: '#2D2D2E',
    fontSize: '16px',
    display: 'flex',
  };

  // prop assignment
  const props = {
    ...innerProps,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <Form.Check
        type={'checkbox'}
        checked={isSelected}
        className="custom-checkbox"
        style={{ marginRight: '8px' }}
      />
      {children}
    </components.Option>
  );
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 2;
  const totalItems = getValue().length;

  const style = {
    marginLeft: 'auto',
    background: '#d4eefa',
    borderRadius: '4px',
    fontFamily: 'Open Sans',
    fontSize: '11px',
    padding: '3px',
    order: 99,
  };

  return index + 1 <= maxToShow ? (
    <>
      <components.MultiValue {...props} />
      {index + 1 === totalItems && (
        <div className="react-select__counter" style={style}>
          {totalItems}
        </div>
      )}
    </>
  ) : index + 1 === totalItems ? (
    <>
      <div className="react-select__counter" style={style}>
        {totalItems}
      </div>
    </>
  ) : null;
};

const MultiSelectDropdown = ({
  onChange,
  placeholder,
  options,
  selected,
  onBlur,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    onChange(selectedOptions); // Notify the parent component about the change
  };

  useEffect(() => {
    setSelectedOptions(selected);
  }, [selected]);

  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={selectedOptions}
      options={options}
      isMulti
      components={{
        Option,
        MultiValue,
        MultiValueContainer: ({ selectProps, data }) => {
          const values = selectProps.value;
          if (values) {
            return values[0].label === data.label ? (
              <span style={{ marginTop: '10px' }}>{data.label}</span>
            ) : (
              <span style={{ marginTop: '10px' }}>{', ' + data.label}</span>
            );
          } else return '';
        },
      }}
      onChange={handleChange}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isClearable={false}
      onBlur={onBlur}
      backspaceRemovesValue={false}
    />
  );
};

export default MultiSelectDropdown;
