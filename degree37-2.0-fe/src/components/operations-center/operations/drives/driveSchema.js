// import moment from 'moment';
import * as Yup from 'yup';
import { customFieldsValidation } from '../../../common/customeFileds/yupValidation';

const createDynamicSchema = (customFields, equipment) => {
  // const dynamicSchema = {};
  // // Add validation rules for custom fields
  // // customFields
  // //   ?.filter((e) => e?.is_required == true)
  // //   .forEach((field, index) => {
  // //     dynamicSchema[field.id] = Yup.mixed().required(`This field is required.`);
  // //   });
  const validation = customFieldsValidation(customFields);

  return Yup.object().shape({
    form: Yup.string().required('Form Name is required.'),
    start_date: Yup.date()
      .required('Start date is required.')
      .typeError('Start date must be a valid date.'),
    account: Yup.object()
      .required('Account is required.')
      .typeError('Account is required.'),
    location: Yup.object()
      .required('Location is required.')
      .typeError('Location is required.'),
    promotion: Yup.object()
      .required('Promotion is required.')
      .typeError('Promotion is required.'),
    recruiter: Yup.object()
      .required('Recruiter is required.')
      .typeError('Recruiter is required.'),
    status: Yup.object()
      .required('Operation status is required.')
      .typeError('Operation status is required.'),
    location_type: Yup.string().required('Please select a location.'),
    miles: Yup.string().required('Please select a location.'),
    minutes: Yup.string().required('Please select a location.'),
    collection_operation: Yup.string().required('Please select an account.'),
    territory: Yup.string().required('Please select an account.'),
    // marketing_start_date: Yup.date()
    //   .required('Marketing start date is required.')
    //   .typeError('Marketing start date must be a valid date.'),
    // marketing_end_date: Yup.date()
    //   .required('Marketing end date is required.')
    //   .typeError('Marketing end date must be a valid date.')
    //   .when('marketing_start_date', (marketing_start_date, schema) => {
    //     return schema.test(
    //       'is-greater',
    //       'End date must be greater than Start date.',
    //       function (marketing_end_time) {
    //         if (!marketing_start_date || !marketing_end_time) {
    //           return true;
    //         }
    //         const startTimeDate = new Date(`${marketing_start_date}`);
    //         const endTimeDate = new Date(`${marketing_end_time}`);
    //         if (endTimeDate >= startTimeDate) {
    //           return true;
    //         }
    //         return false;
    //       }
    //     );
    //   }),
    // marketing_start_time: Yup.date()
    //   .required('Marketing end time is required.')
    //   .typeError('Marketing end time must be a valid date.'),
    // marketing_end_time: Yup.date()
    //   .required('Marketing end time is required.')
    //   .typeError('Marketing end time must be a valid date.')
    //   .when('marketing_start_time', (marketing_start_time, schema) => {
    //     return schema.test(
    //       'is-greater',
    //       'End Time must be greater than Start Time',
    //       function (marketing_end_time) {
    //         if (!marketing_start_time || !marketing_end_time) {
    //           return true;
    //         }
    //         const startTimeDate = new Date(`${marketing_start_time}`);
    //         const endTimeDate = new Date(`${marketing_end_time}`);
    //         const momentStartTime = moment(startTimeDate).format('HH:mm');
    //         const momentEndTime = moment(endTimeDate).format('HH:mm');
    //         const [hour1, minute1] = momentStartTime.split(':').map(Number);
    //         const [hour2, minute2] = momentEndTime.split(':').map(Number);
    //         if (hour1 < hour2) {
    //           return true;
    //         } else if (hour1 === hour2 && minute1 < minute2) {
    //           return true;
    //         }

    //         return false;
    //       }
    //     );
    //   }),
    // marketing_start_time: Yup.string().required('Start Time is required.'),
    // marketing_end_time: Yup.string()
    //   .when('marketing_start_time', (marketing_start_time, schema) => {
    //     return schema.test(
    //       'is-greater',
    //       'End Time must be greater than Start Time',
    //       function (marketing_end_time) {
    //         if (!marketing_start_time || !marketing_end_time) {
    //           return true;
    //         }
    //         const startTimeDate = new Date(`${marketing_start_time}`);
    //         const endTimeDate = new Date(`${marketing_end_time}`);
    //         const momentStartTime = moment(startTimeDate).format('HH:mm');
    //         const momentEndTime = moment(endTimeDate).format('HH:mm');
    //         const [hour1, minute1] = momentStartTime.split(':').map(Number);
    //         const [hour2, minute2] = momentEndTime.split(':').map(Number);
    //         if (hour1 < hour2) {
    //           return true;
    //         } else if (hour1 === hour2 && minute1 < minute2) {
    //           return true;
    //         }

    //         return false;
    //       }
    //     );
    //   })
    //   .required('End Time is required.'),
    order_due_date: Yup.date()
      .required('Oder due date is required.')
      .typeError('Oder due date must be a valid date.'),
    certifications: Yup.array().min(
      1,
      'At least one certification is required.'
    ),
    ...validation,
  });
};

export default createDynamicSchema;
