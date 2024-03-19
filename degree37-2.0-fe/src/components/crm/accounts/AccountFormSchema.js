import * as yup from 'yup';
import { customFieldsValidation } from '../../common/customeFileds/yupValidation';
import { urlRegex } from '../../../helpers/Validation';

const phone_regex = /^\(\d{3}\) \d{3}-\d{4}$/;

const AccountSchema = yup
  .object({
    name: yup
      .string()
      .max(60, 'Name must be under 60 charachter!')
      .required('Name is required.'),
    alternate_name: yup
      .string()
      .max(60, 'Alternate name must be under 60 charachter!')
      .notRequired(),
    mailing_address: yup.string().required('Mailing address is required.'),
    zip_code: yup.string().required('Postal code is required.'),
    phone: yup
      .string()
      .matches(phone_regex, {
        message:
          'Please enter a valid phone number in the format (123) 456-7890.',
        excludeEmptyString: true,
      })
      .notRequired(),
    website: yup
      .string()
      .matches(
        urlRegex,
        'Please provide a correct domain, e.g: www.example.com.'
      )
      .notRequired(),
    facebook: yup
      .string()
      .matches(
        urlRegex,
        'Please provide a correct domain, e.g: www.example.com.'
      )
      .notRequired(),
    collection_operation: yup
      .string()
      .required('Collection operation is required.'),
    industry_category: yup.string().required('Industry category is required.'),
    industry_subcategory: yup
      .string()
      .required('Industry subcategory is required.'),
    stage: yup.string().required('Stage is required.'),
    source: yup.string().required('Source is required.'),
    recruiter: yup.string().required('Recruiter is required.'),
    is_active: yup.boolean(),
    RSMO: yup.boolean(),
  })
  .required();

export const AccountFormSchema = (customFields) => {
  const customFieldsSchema = customFieldsValidation(customFields);

  return yup.object().shape({
    ...customFieldsSchema,
    ...AccountSchema.fields, // Corrected line to include the fields from AccountSchema
  });
};
