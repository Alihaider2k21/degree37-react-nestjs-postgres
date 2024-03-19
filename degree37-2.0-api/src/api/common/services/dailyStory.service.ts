import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ErrorConstants } from 'src/api/system-configuration/constants/error.constants';
import { SuccessConstants } from 'src/api/system-configuration/constants/success.constants';
import {
  resError,
  resSuccess,
} from 'src/api/system-configuration/helpers/response';
import { decryptSecretKey } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/utils/encryption';

export async function getDecryptedTenantConfig(id: any, tenantRepository: any) {
  try {
    const tenant = await tenantRepository.findOne({
      where: { id: id },
      relations: ['configuration_detail'],
    });

    if (!tenant) {
      throw new HttpException(`Tenant Config not found.`, HttpStatus.NOT_FOUND);
    }

    const transformedData = tenant?.configuration_detail?.map(
      (detail: any) => ({
        element_name: detail.element_name,
        secret_key: decryptSecretKey(detail?.secret_key),
        secret_value: decryptSecretKey(detail?.secret_value),
        end_point_url: detail?.end_point_url,
      })
    );

    return resSuccess(
      'Tenant config found Successfully.', // message
      SuccessConstants.SUCCESS,
      HttpStatus.OK,
      transformedData[0]
    );
  } catch (error) {
    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export async function getTenantData(id: any, tenantRepository: any) {
  try {
    const tenant = await tenantRepository.findOne({
      where: { id: id },
      relations: ['configuration_detail'],
    });

    if (!tenant) {
      throw new HttpException(`Tenant Config not found.`, HttpStatus.NOT_FOUND);
    }

    return resSuccess(
      'Tenant config found Successfully.', // message
      SuccessConstants.SUCCESS,
      HttpStatus.OK,
      tenant
    );
  } catch (error) {
    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export async function createDailyStoryTenant(
  tenantName: string,
  email: string
): Promise<any> {
  const degree37Apitoken = `${process.env.DAILY_STORY_API_TOKEN}`;
  const degree37ApiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/admin/tenant/provision/`;

  const degree37Payload = {
    key: `${process.env.DAILY_STORY_D37_key}`,
    name: tenantName,
    emails: [email],
    // settings: [
    //   {
    //     '034cdba4-4e8b-419b-8683-a448d7756cb9': `${uniqueId}`,
    //   },
    // ],
    // Add other required fields as needed
  };

  try {
    const degree37Response = await axios.post(degree37ApiUrl, degree37Payload, {
      headers: {
        Authorization: `Bearer ${degree37Apitoken}`,
      },
    });
    // const degree37Response = {
    //   data: {
    //     Status: true,
    //     Message: '',
    //     Response: {
    //       tenantuid: 'h09dejtgtmq02v4l',
    //       token: {
    //         DateCreated: '2023-12-10T19:25:38.1225743Z',
    //         Token: 'nddfqxgcx7kmyjy8kiqpnhsv2-us-2',
    //         Description: 'API token',
    //         TenantId: 121,
    //       },
    //     },
    //   },
    // };
    const degree37Data = degree37Response?.data?.Response;
    return degree37Data;
  } catch (error) {
    console.error('Error calling Degree 37 API:', error);
    throw new HttpException(
      'Error provisioning tenant',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function sendDegree37Invitation(
  apiToken: string,
  fullName: string,
  email: string
): Promise<any> {
  const degree37ApiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/invite/`;

  const degree37Payload = {
    Fullname: fullName,
    Email: email,
    // Add other required fields as needed
  };

  try {
    const degree37Response = await axios.post(degree37ApiUrl, degree37Payload, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const degree37Data = degree37Response?.data?.Response;

    return degree37Data;
  } catch (error) {
    console.error('Error sending Degree 37 invitation:', error.message);
    throw new HttpException(
      'Error sending invitation',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function getDailyStoryTenantUsers(apiToken: string): Promise<any> {
  const degree37ApiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/users/`;

  try {
    const degree37Response = await axios.get(degree37ApiUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const degree37Data = degree37Response?.data;

    return degree37Data;
  } catch (error) {
    console.error('Error getting DailyStory Tenant Users:', error.message);
    throw new HttpException(
      'Error getting DailyStory Tenant Users',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function getDailyStoryTenantUser(
  apiToken: string,
  userUid: string
): Promise<any> {
  try {
    if (!userUid) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    const degree37ApiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/user/${userUid}`;
    const degree37Response = await axios.get(degree37ApiUrl, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    const degree37Data = degree37Response?.data;

    return degree37Data;
  } catch (error) {
    console.error('Error getting DailyStory Tenant User:', error.message);
    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export async function deleteDailyStoryTenantUser(
  apitoken: string,
  userUid: string
): Promise<any> {
  try {
    if (!userUid) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    const degree37ApiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/user/${userUid}`;
    const degree37Response = await axios.delete(degree37ApiUrl, {
      headers: {
        Authorization: `Bearer ${apitoken}`,
      },
    });
    const degree37Data = degree37Response?.data;
    return degree37Data;
  } catch (error) {
    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export async function createOrUpdateCampaign(data: any, token: string) {
  const apiUrl = `${process.env.DAILY_STORY_COMMUNICATION_URL}/campaign`;
  const campaignData = {
    tenantId: `${data?.tenantId}`,
    campaignId: '0',
    name: `D37-${data?.tenantName}`,
    description: 'D37 Campaign',
    conversionGoals: {
      enabled: false,
      suspects: 0,
      mcls: 0,
      mqls: 0,
      sqls: 0,
    },
    status: 'Active',
    url_shortener: null,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.post(apiUrl, campaignData, { headers });
    // const response = {
    //   data: { Status: true, Message: '', Response: { id: 1566 } },
    // };
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error creating or updating campaign:', error.message);
    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export async function getDSTemplates(
  campaignId: number,
  dailyStoryToken: string
) {
  try {
    const url = `${process.env.DAILY_STORY_COMMUNICATION_URL}/emails/${campaignId}`;
    const token = decryptSecretKey(dailyStoryToken);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const templates: any = await axios.get(url, { headers });
    return templates?.data;
  } catch (error) {
    console.log({ error });

    return resError(error.message, ErrorConstants.Error, error.status);
  }
}

export enum MessageType {
  'email' = 'email',
}

interface emailBody {
  email_body: string;
  subject: string;
  from: string; // from email
  messageType: MessageType.email;
}
export async function sendDSEmail(
  templateId: any,
  toEmail: any,
  emailBody: emailBody,
  dailyStoryToken: string
) {
  try {
    const url = `${process.env.DAILY_STORY_COMMUNICATION_URL}/email/send/${templateId}?email=${toEmail}`;
    const token = decryptSecretKey(dailyStoryToken);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const emailResponse: any = await axios.post(url, emailBody, {
      headers,
    });

    console.log({ emailResponse });

    return emailResponse?.data;
  } catch (error) {
    if (!error.response?.data?.Status) {
      return resError(
        error.response.data?.Message,
        ErrorConstants.Error,
        error.status
      );
    }
  }
}
