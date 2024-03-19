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

export const addNoteAttachmentSubCategorySchema = yup.object().shape({
  description: yup.string().required('Description is required'),
  name: yup.string().required('Name is required'),
  category_id: yup.string().required('Attachment Category is required'),
});
