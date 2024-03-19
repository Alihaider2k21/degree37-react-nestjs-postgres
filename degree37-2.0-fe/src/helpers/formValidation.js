const validateForm = (formData, fieldNames, setErrors) => {
  let isValid = true;
  const newErrors = {};

  fieldNames.forEach((fieldName) => {
    const value = formData[fieldName.name];
    const fieldDefinition = fieldNames.find(
      (field) => field.name === fieldName.name
    );
    let errorMessage = '';

    if (
      (fieldDefinition?.required && value === null) ||
      value?.toString().trim() === ''
    ) {
      errorMessage = `${fieldDefinition.label} is required.`;
    }

    if (
      fieldDefinition?.maxLength &&
      value?.length > fieldDefinition?.maxLength
    ) {
      errorMessage = `Maximum ${fieldDefinition.maxLength} characters are allowed.`;
    }

    if (fieldDefinition?.shouldBeAPositiveInteger && value < 0) {
      errorMessage = `${fieldDefinition.label} should be a positive number.`;
    }

    if (errorMessage === '') {
      newErrors[fieldName.name] = '';
    } else {
      newErrors[fieldName.name] = errorMessage;
      isValid = false;
    }
  });

  setErrors((prevErrors) => ({
    ...prevErrors,
    ...newErrors,
  }));

  return isValid;
};

export default validateForm;
