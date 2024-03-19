import * as yup from 'yup';

export const PickupSchema = yup
  .object({
    description: yup.string().required('Description is required.'),
    start_time: yup.string().required('Start time is required.'),
    equipment_id: yup.string().required('Type is required.'),
  })
  .required();
