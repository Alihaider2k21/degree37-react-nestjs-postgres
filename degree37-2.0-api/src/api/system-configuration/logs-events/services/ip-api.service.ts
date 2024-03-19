import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class IpApiService {
  static readonly IP_API_BASE_URL = 'http://ip-api.com/json/';

  async getIpDetails(ip: string) {
    const apiUrl = `${IpApiService.IP_API_BASE_URL + ip}`;

    try {
      return (await axios.get(apiUrl))?.data;
    } catch (error) {
      throw new Error('Error fetching IP details');
    }
  }
}
