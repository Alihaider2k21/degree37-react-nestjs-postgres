import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RetryUtil } from './util/retryutil';
import { BBCSConstants } from './util/connectorconstants';
import { Injectable } from '@nestjs/common';
import {
  ModifyDonorAddress,
  ModifyDonorEmail,
  ModifyDonorWorkPhone,
  ModifyDonorHomePhone,
  ModifyDonorCellPhone,
} from './interfaces/modify';
import https from 'https';
import moment from 'moment';
import { TenantConfigurationDetail } from 'src/api/system-configuration/platform-administration/tenant-onboarding/tenant/entities/tenantConfigurationDetail';

@Injectable()
export class BBCSConnector {
  /**
   * The function `findSponsorGroup` makes a call to the BBCS API to find a sponsor group and returns
   * the response data.
   * @param {any} data - The `data` parameter is an object that contains the data to be sent in the
   * request to the BBCS API. It can include any necessary parameters or payload required by the API
   * endpoint specified in the `BBCSConstants.FIND_SPONSOR_GROUP_URL` constant.
   * @returns The function `findSponsorGroup` returns a Promise that resolves to an object. The
   * structure of the returned object depends on the response type received from the `callToBBCS`
   * function.
   */
  public async findSponsorGroup(data: any): Promise<any> {
    try {
      const response = await this.callToBBCS(
        'GET',
        BBCSConstants.FIND_SPONSOR_GROUP_URL,
        data
      );
      const responseData = response.data;

      const responseTypeActions = {
        EXACT: () => {
          const exactMatch = responseData.data[0];
          return {
            uuid: exactMatch.UUID,
            id: exactMatch.id,
            type: 'EXACT',
            ...exactMatch,
          };
        },
        MULTIEXACT: () => {
          return {
            type: 'MULTIEXACT',
            ...responseData.data,
          };
        },
        NOMATCH: () => null,
      };

      const action = responseTypeActions[responseData.type];
      if (action) {
        return action();
      }

      throw new Error('Unsupported response type');
    } catch (error) {
      throw new Error('Failed to fetch data from BBCS API');
    }
  }

  /**
   * The function creates a new sponsor group via a BBCS API call.
   * @param {any} data - The `data` parameter is an object that contains the necessary information to
   * create a new sponsor group. It could include properties such as the sponsor group name,
   * description, and any other relevant details.
   * @param {TenantConfigurationDetail} config - The `config` parameter is an object of type
   * `TenantConfigurationDetail`. It contains configuration details specific to a tenant, such as API
   * keys, endpoints, and other settings required to make API calls to the BBCS (Blackbaud CRM) system.
   * @returns the data from the response of the API call.
   */
  public async createNewSponsorGroupApi(
    data: any,
    config: TenantConfigurationDetail
  ): Promise<any> {
    try {
      const response = await this.callToBBCS(
        'GET',
        BBCSConstants.CREATE_SPONSOR_GROUP_URL,
        data,
        null,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to create a new sponsor group via BBCS API');
    }
  }

  /**
   * The function fetches donor data from a BBCS API endpoint using the provided parameters and returns
   * a Promise.
   * @param {number} limit - The limit parameter specifies the maximum number of donor records to
   * retrieve from the server. It determines the number of records that will be returned in the
   * response.
   * @param {string} start - The start parameter is a string that represents the starting point for
   * fetching donor data. It is used to paginate through the data and retrieve a specific subset of
   * donors.
   * @param {string} updatedDate - The `updatedDate` parameter is a string that represents the date and
   * time when the donors' data was last updated. It is used to fetch only the donors' data that has
   * been updated after the specified date and time.
   * @param {TenantConfigurationDetail} config - The `config` parameter is of type
   * `TenantConfigurationDetail` and is used to pass the configuration details for the tenant. It
   * contains information such as API keys, endpoints, and other settings specific to the tenant.
   * @returns a Promise that resolves to any data.
   */
  public async fetchDonorsData(
    limit: number,
    start: string,
    updatedDate: string,
    config: TenantConfigurationDetail
  ): Promise<any> {
    try {
      return await this.callToBBCS(
        'GET',
        BBCSConstants.DONOR_SYNC_URL,
        {
          limit,
          start,
          updatedDate,
        },
        null,
        config
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * The function `getDonorEligibility` makes a POST request to a BBCS API endpoint to retrieve donor
   * eligibility information based on a UUID and target date.
   * @param {string} uuid - A string representing the unique identifier of the donor.
   * @param targetDate - The targetDate parameter is a moment object that represents the date for which
   * the donor eligibility is being checked. It is optional and defaults to the current date if not
   * provided.
   * @param {TenantConfigurationDetail} config - The `config` parameter is of type
   * `TenantConfigurationDetail`. It is an object that contains configuration details specific to a
   * tenant.
   * @returns the result of the callToBBCS function, which is a Promise.
   */
  public async getDonorEligibility(
    uuid: string,
    targetDate = moment(),
    config: TenantConfigurationDetail
  ): Promise<any> {
    try {
      return await this.callToBBCS(
        'POST',
        BBCSConstants.DONOR_ELIGIBILITY_URL,
        null,
        {
          uuids: [uuid],
          targetDate: targetDate.format('YYYY-MM-DD'),
        },
        config
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * The function fetches account group codes data by making a GET request to a specified URL using the
   * provided configuration.
   * @param {TenantConfigurationDetail} config - The `config` parameter is of type
   * `TenantConfigurationDetail`. It is used to pass the configuration details of the tenant to the
   * `fetchAccountGroupCodesData` function.
   * @returns a Promise that resolves to any data.
   */
  public async fetchAccountGroupCodesData(
    config: TenantConfigurationDetail
  ): Promise<any> {
    try {
      return await this.callToBBCS(
        'GET',
        BBCSConstants.ACCOUNT_URL,
        null,
        null,
        config
      );
    } catch (error) {
      console.error(error);
    }
  }

  public async modifyDonor(
    params:
      | ModifyDonorAddress
      | ModifyDonorEmail
      | ModifyDonorWorkPhone
      | ModifyDonorHomePhone
      | ModifyDonorCellPhone,
    config: TenantConfigurationDetail
  ) {
    try {
      return await this.callToBBCS(
        'GET',
        BBCSConstants.MODIFY_DONOR_URL,
        params,
        null,
        config
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * The function `callToBBCS` is an asynchronous function that makes a request to the BBCS APIs
   * @param {string} method - The HTTP method to be used for the API call (e.g., GET, POST, PUT, DELETE).
   * @param {string} apiEndpoint - The `apiEndpoint` parameter is a string that represents the specific
   * endpoint of the BBCS API that you want to call. It is appended to the `baseUrl` to form the complete
   * URL for the API request.
   * @param {any} queryParams - queryParams is an object that contains the query parameters to be
   * included in the API request. These parameters are used to filter or modify the data returned by the
   * API.
   * @param {any} [data] - The `data` parameter is an optional parameter that represents the request
   * payload or body data that you want to send with the API request. It can be any valid JSON object or
   * data that needs to be sent to the API endpoint.
   * @param {TenantConfigurationDetail} [config] - The `config` parameter is an optional object that
   * contains the configuration details for the API call. It includes the `end_point_url` and
   * `secret_value` properties, which are used to construct the base URL and set the API key for the
   * request.
   * @returns The function `callToBBCS` returns a Promise that resolves to the response data from the
   * BBCS API.
   */
  private async callToBBCS(
    method: string,
    apiEndpoint: string,
    queryParams: any,
    data?: any,
    config?: TenantConfigurationDetail
  ): Promise<any> {
    const baseUrl = config ? config?.end_point_url : process.env.BBCS_BASE_URL;
    const apiKey = config ? config?.secret_value : process.env.API_KEY;

    // creating axios request
    const requestConfig: AxiosRequestConfig = {
      method,
      url: baseUrl + apiEndpoint,
      headers: { apiKey },
      ...(queryParams && { params: queryParams }),
      ...(data && { data }),
    };

    const isTransientError = (error: any) => {
      return error.status >= 500;
    };

    const makeRequest = async () => {
      try {
        // Start Code to Bypass SSL Certificate Error
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        const axiosInstance: AxiosInstance = axios.create({
          httpsAgent: agent,
        });

        // End Code to Bypass SSL Certificate Error
        const response = await axiosInstance(requestConfig);
        return response.data;
      } catch (error) {
        throw new Error(
          `Failed to make a request to BBCS API: ${error.message}`
        );
      }
    };

    return RetryUtil.retry(makeRequest, 3, 1000, isTransientError);
  }
}
