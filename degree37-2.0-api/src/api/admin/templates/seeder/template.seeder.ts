import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { Templates } from '../entities/templates.entity';

@Injectable()
export class TemplateSeeder implements Seeder {
  constructor(
    @InjectRepository(Templates)
    private readonly templateRepository: Repository<Templates>
  ) {}

  async seed(): Promise<any> {
    try {
      const templatesData = [
        {
          title: 'admin create donor',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${OTP}',
              description:
                'OTP is used to send created One Time password to user',
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${Email}',
              description: 'Secure Email is used for login',
            },
            {
              variable: '${RequestedDateTime}',
              description:
                'Requested Date Time is used to identify on which date and time this email went out',
            },
            {
              variable: '${ExpiryDate}',
              description: 'Expiry Date is used for when will your OTP expire',
            },
          ],
        },
        {
          title: 'create new admin user',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${Email}',
              description: 'Secure Email is used for login',
            },
            {
              variable: '${Password}',
              description: 'Password is used for the login',
            },
          ],
        },
        {
          title: 'reset password for admin user',
          variables: [
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${RequestedDateTime}',
              description:
                'Requested Date Time is used to identify on which date and time this email went out',
            },
            {
              variable: '${ExpiryDate}',
              description: 'Expiry Date is used for when will your OTP expire',
            },
            {
              variable: '${secureEmail}',
              description: 'Secure Email is used for the encrypted email',
            },
            {
              variable: '${OTP}',
              description:
                'OTP is used to send created One Time password to user',
            },
          ],
        },
        {
          title: 'create new donor',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
          ],
        },
        {
          title: 'reset password for donor',
          variables: [
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${RequestedDateTime}',
              description:
                'Requested Date Time is used to identify on which date and time this email went out',
            },
            {
              variable: '${ExpiryDate}',
              description: 'Expiry Date is used for when will your OTP expire',
            },
            {
              variable: '${secureEmail}',
              description: 'Secure Email is used for the encrypted email',
            },
            {
              variable: '${OTP}',
              description:
                'OTP is used to send created One Time password to user',
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
          ],
        },
        {
          title: 'activate donor',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${Password}',
              description: 'Password is used for login ',
            },
          ],
        },
        {
          title: 'add appointment',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${appointmentDate}',
              description:
                'Appointment Date used for display the date of appointment ',
            },
            {
              variable: '${appointmentTime}',
              description:
                "Appointment Time is used for display the user's appointment time",
            },
            {
              variable: '${timeZone}',
              description:
                'Time Zone is used for display the Time Zone in which your appointment is booked.',
            },
            {
              variable: '${UserName}',
              description:
                'Username is used for display the full name of the user',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${ResourceName}',
              description: 'ResourceName is used for appointment detail',
            },
          ],
        },
        {
          title: 'modify appointment',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${appointmentDate}',
              description:
                'Appointment Date used for display the date of appointment ',
            },
            {
              variable: '${appointmentTime}',
              description:
                "Appointment Time is used for display the user's appointment time",
            },
            {
              variable: '${timeZone}',
              description:
                'Time Zone is used for display the Time Zone in which your appointment is booked.',
            },
            {
              variable: '${UserName}',
              description:
                'Username is used for display the full name of the user',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
            {
              variable: '${ResourceName}',
              description: 'ResourceName is used for appointment detail',
            },
          ],
        },
        {
          title: 'cancel appointment',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${appointmentDate}',
              description:
                'Appointment Date used for display the date of appointment ',
            },
            {
              variable: '${appointmentTime}',
              description:
                "Appointment Time is used for display the user's appointment time",
            },
            {
              variable: '${ResourceName}',
              description: 'ResourceName is used for appointment detail',
            },
          ],
        },
        {
          title: 'create new client',
          variables: [
            {
              variable: '${FirstName}',
              description: "FirstName is used for user's First name",
            },
            {
              variable: '${LastName}',
              description: "LastName is used for the user's Last name",
            },
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update client',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'archive donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'unarchive donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
            {
              variable: '${PhoneNumber}',
              description:
                'Phone Number is used for from which client this call went out',
            },
          ],
        },
        {
          title: 'publish donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'unpublish donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all donation type',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'archive resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'unarchive resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'publish resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'unpublish resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all resource',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create staff',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update staff',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete staff',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all staff',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create staff designation',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update staff designation',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete staff designation',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all staff designation',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create sponsor group',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update sponsor group',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete sponsor group',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all sponsor group',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'approved drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'unapproved drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'active drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'deactive drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all drive center',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'create event',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'update event',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete event',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'delete all event',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
        {
          title: 'appointment suggestion',
          variables: [
            {
              variable: '${ClientName}',
              description:
                'Client Name is used for from which client this email went out',
            },
            {
              variable: '${UserName}',
              description: 'Username is used for full name of the user',
            },
          ],
        },
      ];

      for (const data of templatesData) {
        const template = new Templates();
        template.title = data.title;
        template.slug = data.title.replace(/ /g, '_').toUpperCase();
        template.variables = data.variables;
        template.is_active = true;
        template.created_at = new Date();
        template.updated_at = new Date();
        template.deleted_at = null;

        const templateExist = await this.templateRepository.findOne({
          where: { title: data.title },
        });
        if (!templateExist) {
          await this.templateRepository.insert(template);
        }
      }
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }

  async drop(): Promise<any> {
    try {
      await this.templateRepository.query(`DELETE FROM templates`);

      // Reset primary key sequence
      await this.templateRepository.query(
        `ALTER SEQUENCE templates.id RESTART WITH 1`
      );
    } catch (e) {
      console.error('error seeding db : ', e);
    }
  }
}
