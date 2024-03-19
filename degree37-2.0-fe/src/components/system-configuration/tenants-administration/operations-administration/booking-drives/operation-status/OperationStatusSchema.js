import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  operationStatusName: Yup.string().required('Name is required.'),
  selectedAppliesTo: Yup.array().min(1, 'Applies to is required.'),
  description: Yup.string().required('Description is required.'),
  chipColor: Yup.string().required('Select chip color is required.'),
});

export default validationSchema;
