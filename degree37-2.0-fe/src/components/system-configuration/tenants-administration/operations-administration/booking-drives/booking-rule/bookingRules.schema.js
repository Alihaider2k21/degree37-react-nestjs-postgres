import * as yup from 'yup';
export const bookingRuleSchema = yup.object().shape({
  thirdRailFields: yup.object().shape({
    date: yup.boolean(),
    hours: yup.boolean(),
    projection: yup.boolean(),
    staffing_setup: yup.boolean(),
    location: yup.boolean(),
    status: yup.boolean(),
    add_field_id_list: yup.array().of(yup.string()),
  }),
  CurrentLockLeadTimeDto: yup.object().shape({
    lead_time: yup
      .number()
      .required('Lock lead time is required')
      .typeError('Lock Lead Time should only contain integer values')
      .positive()
      .integer(),

    effective_date: yup
      .string()
      .required('Lock Lead Time Effective Date is required'),
  }),
  ScheduleLockLeadTimeDto: yup.object().shape({
    lead_time: yup
      .number()
      .typeError('Schedule Lock Lead Time should only contain integer values')
      .positive()
      .integer()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? null : value
      ),
    effective_date: yup.string().when('lead_time', {
      is: (value) => value,
      then: () =>
        yup
          .string()
          .required('Schedule Lock Lead Time Effective Date is required'),
      otherwise: () => yup.string().nullable(),
    }),
  }),
  MaximumDrawHoursDto: yup.object().shape({
    hours: yup
      .number()
      .typeError('Maximum Hours should only contain integer and decimal values')
      .positive()
      .required('Maximum Hours is required'),
    allow_appointment: yup.boolean(),
  }),
  OefBlockOnDto: yup.string(),
  LocationQualificationDto: yup.object().shape({
    drive_scheduling: yup.boolean(),
    expires: yup.boolean(),
    expiration_period: yup
      .number()
      .typeError('Expiration period should only contain integer values')
      .positive()
      .integer()
      .transform((value, originalValue) =>
        String(originalValue).trim() === '' ? 0 : value
      )
      .when('expires', {
        is: (value) => value,
        then: () =>
          yup
            .number()
            .typeError('Expiration period should only contain integer values')
            .positive('Expiration period should only have positive value')
            .integer()
            .required('Expiration period is required'),
        otherwise: () =>
          yup
            .number()
            .typeError('Expiration period should only contain integer values')
            .integer()
            .transform((value, originalValue) =>
              String(originalValue).trim() === '' ? 0 : value
            )
            .notRequired(),
      }),
  }),
  sharingMaxMiles: yup
    .number()
    .typeError('Sharing Max Miles should only contain integer values')
    .positive()
    .integer()
    .required('Sharing Max Miles is required'),
  createdBy: yup.number(),
  field: yup.string(),
});
