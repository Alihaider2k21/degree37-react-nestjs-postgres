import * as Yup from 'yup';

const profileSchema = Yup.object().shape({
  profile_name: Yup.string()
    .required('Profile Name is required.')
    .max(50, 'Maximum 50 characters are allowed.'),
  event_category_id: Yup.string().required('Event Category is required.'),
  event_subcategory_id: Yup.string().required('Event Subcategory is required.'),
  collection_operation_id: Yup.string().required(
    'Collection Operation is required.'
  ),
  owner_id: Yup.string().required('Owner is required.'),
});

export default profileSchema;
