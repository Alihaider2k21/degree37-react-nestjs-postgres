import { HttpException, HttpStatus } from '@nestjs/common';
// import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
// import { resError } from 'src/api/system-configuration/helpers/response';
import { CustomFieldsData } from 'src/api/system-configuration/tenants-administration/organizational-administration/custom-fields/entities/custom-filed-data.entity';
import { QueryRunner } from 'typeorm/browser';

export async function saveCustomFields(
  customFieldsRepository: any,
  queryRunner: QueryRunner,
  data: any,
  created_by: any,
  tenant_id: any,
  createCustomFieldDrivesDataDto: any,
  response: any[]
) {
  const { fields_data, custom_field_datable_type } =
    createCustomFieldDrivesDataDto.custom_fields;

  if (!custom_field_datable_type) {
    throw new HttpException(
      `custom_field_datable_type is required.`,
      HttpStatus.BAD_REQUEST
    );
  }

  // const responseData = [];

  if (fields_data?.length) {
    for (const item of fields_data) {
      const customField = await customFieldsRepository.findOne({
        where: { id: item?.field_id, is_archived: false },
      });
      if (!customField) {
        throw new HttpException(
          `Field not found for ID ${item?.field_id}.`,
          HttpStatus.BAD_REQUEST
        );
      }

      if (customField?.is_required && !item?.field_data) {
        throw new HttpException(
          `Field data must be required for field id ${customField?.id}.`,
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if CustomFieldsData already exists for this custom field and data.
      // Find existing CustomFieldsData for update.
      const customFieldData = await queryRunner.manager.findOne(
        CustomFieldsData,
        {
          where: {
            custom_field_datable_id: data.id,
            custom_field_datable_type: custom_field_datable_type,
            field_id: { id: item?.field_id },
            tenant_id: { id: tenant_id.id },
          },
        }
      );

      if (customFieldData) {
        // If the data already exists, update the field_data.
        customFieldData.field_data = item?.field_data;
        await queryRunner.manager.save(customFieldData);
      } else {
        const customFieldData = new CustomFieldsData();
        customFieldData.custom_field_datable_id = data.id;
        customFieldData.custom_field_datable_type = custom_field_datable_type;
        customFieldData.field_id = customField;
        customFieldData.tenant_id = tenant_id;
        customFieldData.created_by = created_by;
        customFieldData.created_by = created_by;
        // customFieldData.tenant_id = created_by?.user?.tenant;
        customFieldData.field_data = item?.field_data;
        response.push(await queryRunner.manager.save(customFieldData));
      }
    }
  }
}
