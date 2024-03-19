import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class DriveContactsDto {
  @ApiProperty()
  contacts: [
    {
      drive_id: any;
      accounts_contacts_id: any;
      role_id: any;
    }
  ];

  deleteContacts: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class DriveCertificationsDto {
  @ApiProperty()
  certifications: [
    {
      certification: any;
    }
  ];

  deleteCertifications: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}

export class DriveEquipmentsDto {
  @ApiProperty()
  equipments: [
    {
      equipment_id: any;
      quantity: any;
    }
  ];

  deleteEquipments: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
export class LinkDriveDto {
  @ApiProperty()
  linkDrive: [
    {
      drive_id: any;
    }
  ];

  deleteLinkedDrive: [string];

  @ApiHideProperty()
  forbidUnknownValues: true;
}
