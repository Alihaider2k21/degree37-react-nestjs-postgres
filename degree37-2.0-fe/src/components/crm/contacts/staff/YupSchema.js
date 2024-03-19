// import moment from 'moment';
import * as Yup from 'yup';
import { customFieldsValidation } from '../../../common/customeFileds/yupValidation';

const staffSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is required.')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only alphabets and spaces.'),
  last_name: Yup.string()
    .required('Last Name is required.')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only alphabets and spaces.'),
  nick_name: Yup.string().matches(
    /^(?:[a-zA-Z\s]*)$/,
    'Name must contain only alphabets and spaces.'
  ),
  birth_date: Yup.date()
    .required('Date is required.')
    .typeError('Please enter a valid date.')
    .max(new Date(), 'Selected date must be in the past.'),
  mailing_address: Yup.string().required('Mailing address is required.'),
  collection_operation_id: Yup.mixed().required(
    'Collection operations is required.'
  ),
  classification_id: Yup.mixed().required('Classification is required.'),
  zip_code: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  county: Yup.string(),
});

export const StaffFormSchema = (customFields) => {
  const customFieldsSchema = customFieldsValidation(customFields);

  return Yup.object().shape({
    ...customFieldsSchema,
    ...staffSchema.fields, // Corrected line to include the fields from VolunteerSchema
  });
};
