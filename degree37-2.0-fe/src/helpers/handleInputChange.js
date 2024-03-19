const handleInputChange = (name, value, setFormData, fieldNames, setErrors) => {
  setFormData((prevData) => {
    return {
      ...prevData,
      [name]: value,
    };
  });

  let errorMessage = '';

  const fieldDefinition = fieldNames.find((field) => field.name === name);

  if (fieldDefinition?.required && value?.toString().trim() === '') {
    errorMessage = `${fieldDefinition.label} is required.`;
  }

  if (
    fieldDefinition?.maxLength &&
    value?.length > fieldDefinition?.maxLength
  ) {
    errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed`;
  }

  if (fieldDefinition?.shouldBeAPositiveInteger && value < 0) {
    errorMessage = `${fieldDefinition.label} should be a positive number`;
  }

  const setError = (fieldName, errorMsg) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };
  setError(name, errorMessage);
};

export default handleInputChange;
