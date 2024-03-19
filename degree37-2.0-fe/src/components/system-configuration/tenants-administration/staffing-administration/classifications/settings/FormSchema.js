import * as yup from 'yup';
export const settingSchema = yup.object().shape({
  max_consec_days_per_week: yup
    .number()
    .typeError('Max C/D/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-7.',
      'Max C/D/W Cannot Exceed 7 Days.',
      (value) => value >= 0 && value <= 7
    )
    .required('This field is required.'),
  min_days_per_week: yup
    .number()
    .typeError('Min D/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-7',
      'Min D/W Cannot Exceed 7 Days.',
      (value) => value >= 0 && value <= 7
    )
    .required('This field is required.'),
  max_days_per_week: yup
    .number()
    .typeError('Max D/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-7.',
      'Max D/W Cannot Exceed 7 Days.',
      (value) => value >= 0 && value <= 7
    )
    .required('This field is required.'),
  max_hours_per_week: yup
    .number()
    .typeError('Max Hr/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-168.',
      'Max Hr/W Cannot Exceed 168 Hours.',
      (value) => value >= 0 && value <= 168
    )
    .required('This field is required.'),
  min_hours_per_week: yup
    .number()
    .typeError('Min Hr/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-168.',
      'Min Hr/W Cannot Exceed 168 Hours.',
      (value) => value >= 0 && value <= 168
    )
    .required('This field is required.'),
  target_hours_per_week: yup
    .number()
    .typeError('Target Hr/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-168.',
      'Target Hr/W Cannot Exceed 168 Hours.',
      (value) => value >= 0 && value <= 168
    )
    .required('This field is required.'),
  max_weekend_hours: yup
    .number()
    .typeError('Max W/Hr Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-48',
      'Max W/Hr Cannot Exceed 48 Hours',
      (value) => value >= 0 && value <= 48
    )
    .required('This field is required.'),
  min_recovery_time: yup
    .number()
    .typeError('Min Recovery Time is required.')
    .integer('Please enter a whole number.')
    .max(500, 'Min Recovery Time Cannot Exceed 500 Hours.')
    .required('This field is required.'),
  max_consec_weekends: yup
    .number()
    .typeError('Max Consecutive Weekends Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-54',
      'Max Consecutive Weekends Cannot Exceed 54 Weekends',
      (value) => value >= 0 && value <= 54
    )
    .required('This field is required.'),
  max_ot_per_week: yup
    .number()
    .typeError('Max OT/W Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-168',
      'Max OT/W Cannot Exceed 168 Hours',
      (value) => value >= 0 && value <= 168
    )
    .required('This field is required.'),
  max_weekends_per_months: yup
    .number()
    .typeError('Max W/M Are required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-6',
      'Max W/M Cannot Exceed 6 Weekends.',
      (value) => value >= 0 && value <= 6
    )
    .required('This field is required.'),
  overtime_threshold: yup
    .number()
    .typeError('Overtime Threshold is required.')
    .integer('Please enter a whole number.')
    .test(
      'is-between-0-and-168',
      'Overtime Threshold Cannot Exceed 168 Hours.',
      (value) => value >= 0 && value <= 168
    )
    .required('This field is required.'),
});
