import * as yup from 'yup';
import { customFieldsValidation } from '../../../../../common/customeFileds/yupValidation';

const phone_regex = /^\(\d{3}\) \d{3}-\d{4}$/;

const FacilitySchema = (customFields) => {
  console.log(customFields, 'customFileds');
  const validation = customFieldsValidation(customFields);
  return yup
    .object({
      name: yup.string().required('Name is required.'),
      alternate_name: yup.string().required('Alternate name is required.'),
      physical_address: yup.string().required('Physical address is required.'),
      postal_code: yup.string().required('Zip code is required.'),
      city: yup.string().required('City is required.'),
      state: yup.string().required('State is required.'),
      county: yup.string().required('County is required.'),
      phone: yup
        .string()
        .matches(phone_regex, {
          message:
            'Please enter a valid phone number in the format (123) 456-7890.',
          excludeEmptyString: true,
        })
        .required('Phone number is required.'),
      status: yup.boolean(),
      collection_operation: yup
        .string()
        .typeError('Collection operation is required.')
        .required('Collection operation is required.'),
      ...validation,
    })
    .required();
};

export default FacilitySchema;
