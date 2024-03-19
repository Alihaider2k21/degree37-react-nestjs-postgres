import * as yup from 'yup';
export const BusinessUnitSchema = yup
  .object({
    name: yup.string().required('Name is requried'),
    // parent_level: yup.string().required("Parent is requried"),
    organizational_level_id: yup
      .object()
      .required('Organizational level is requried'),
  })
  .required();
