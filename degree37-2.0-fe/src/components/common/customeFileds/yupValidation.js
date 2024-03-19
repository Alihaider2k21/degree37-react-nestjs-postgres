import * as Yup from 'yup';

export const customFieldsValidation = (customFields) => {
  const dynamicSchema = {};
  customFields
    ?.filter((e) => e?.is_required == true)
    .forEach((field, index) => {
      if (field?.field_data_type === '4') {
        dynamicSchema[field.id] = Yup.object().required(
          `This field is required.`
        );
      } else if (
        field?.field_data_type === '8' ||
        field?.field_data_type === '7'
      ) {
        dynamicSchema[field.id] = Yup.boolean().oneOf(
          [true],
          `This field is required.`
        );
      } else {
        dynamicSchema[field.id] = Yup.string().required(
          `This field is required.`
        );
      }
    });
  return dynamicSchema;
};
