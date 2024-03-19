import * as yup from 'yup';

// error handler
export const yupErrorHandler = (error) => {
  if (error.name === 'ValidationError') {
    let obj = {};
    for (let e of error.inner) {
      obj[e.path] = e.message;
    }
    return obj;
  }
  return null;
};

export const addNoteAttachmentCategorySchema = yup.object().shape({
  description: yup
    .string()
    .required('Description is required')
    .test(
      'len',
      'Maximum 500 characters are allowed',
      (val) => val.length < 501
    ),
  name: yup
    .string()
    .required('Name is required')
    .test('len', 'Maximum 50 characters are allowed', (val) => val.length < 51),
});
