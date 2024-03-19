// import moment from 'moment';
import * as Yup from 'yup';
import { customFieldsValidation } from '../../../common/customeFileds/yupValidation';

const donorSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is required.')
    .matches(
      /^[A-Za-z\s]+$/,
      'First name cannot contain digits or special characters.'
    )
    .test(
      'alphabetic-characters',
      'Last name must be at least 3 alphabetic characters.',
      (value) => {
        // Count the number of alphabetic characters (excluding spaces)
        const alphabeticCharactersCount = value
          .replace(/ /g, '')
          .replace(/[^A-Za-z]/g, '').length;
        return alphabeticCharactersCount >= 3;
      }
    ),
  last_name: Yup.string()
    .required('Last name is required.')
    .matches(
      /^[A-Za-z\s]+$/,
      'Last name cannot contain digits or special characters.'
    )
    .test(
      'alphabetic-characters',
      'Last name must be at least 3 alphabetic characters.',
      (value) => {
        // Count the number of alphabetic characters (excluding spaces)
        const alphabeticCharactersCount = value
          .replace(/ /g, '')
          .replace(/[^A-Za-z]/g, '').length;
        return alphabeticCharactersCount >= 3;
      }
    ),
  nick_name: Yup.string().matches(
    /^(?:[a-zA-Z\s]*)$/,
    'Name must contain only alphabets and spaces.'
  ),
  blood_type: Yup.string().nullable(),
  birth_date: Yup.date()
    .required('Date is required.')
    .typeError('Please enter a valid date.')
    .max(new Date(), 'Selected date must be in the past.'),
  mailing_address: Yup.string().required('Mailing address is required.'),
  zip_code: Yup.string(),
  city: Yup.string(),
  state: Yup.string(),
  county: Yup.string(),
});

export const DonorFormSchema = (customFields, donorID) => {
  const customFieldsSchema = customFieldsValidation(customFields);

  return Yup.object().shape({
    ...customFieldsSchema,
    ...donorSchema.fields,
  });
};
