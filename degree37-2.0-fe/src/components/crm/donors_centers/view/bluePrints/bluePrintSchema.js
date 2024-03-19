import * as Yup from 'yup';

const bluePrintSchema = Yup.object().shape({
  name: Yup.string().required('Blueprint Name is required.'),
});
export default bluePrintSchema;
