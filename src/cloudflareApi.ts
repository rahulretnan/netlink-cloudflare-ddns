import axios from 'axios';

/**
 * Log into the router.
 *
 * @param email - The email used to login 'https://dash.cloudflare.com'
 * @param auth_method - Set to "global" for Global API Key or "token" for Scoped API Token
 * @param auth_key - Your API Token or Global API Key
 * @param zone_identifier - Your Zone Id, Can be found in the "Overview" tab of your domain
 * @param record_name -  Name of A record you want to update
 * @param ttl - Set the DNS TTL (seconds)
 * @param proxy - Set the proxy to true or false
 * @param publicIpAddress - The public IP address of your router
 */

export interface ICloudflareApiProps {
  email: string;
  auth_method: 'token' | 'global';
  auth_key: string;
  zone_identifier: string;
  record_name: string;
  ttl?: number;
  proxy?: boolean;
  publicIpAddress?: string;
}

const getHeader: any = (
  email: string,
  auth_key: string,
  auth_method: 'token' | 'global'
) => {
  return auth_method === 'global'
    ? {
        'X-Auth-Email': email,
        'X-Auth-Key': auth_key,
        'Content-Type': 'application/json',
      }
    : {
        'X-Auth-Email': email,
        Authorization: `Bearer ${auth_key}`,
        'Content-Type': 'application/json',
      };
};

export const getARecord = async ({
  email,
  auth_key,
  auth_method,
  record_name,
  zone_identifier,
}: ICloudflareApiProps) => {
  const url = `https://api.cloudflare.com/client/v4/zones/${zone_identifier}/dns_records?type=A&name=${record_name}`;
  const headers = getHeader(email, auth_key, auth_method);
  try {
    const response = await axios.get(url, {
      headers,
    });
    if (response.data.success && response.data.result.length === 0) {
      console.error('A record not found, Please provide a valid A record');
      return;
    }
    return response.data.result[0];
  } catch (e) {
    const error = e as any;
    console.log(error.response.data.errors[0].message);
  }
};

export const updateARecordIp = async ({
  auth_key,
  auth_method,
  email,
  record_name,
  zone_identifier,
  proxy = false,
  ttl = 3600,
  publicIpAddress,
}: ICloudflareApiProps) => {
  const ARecord = await getARecord({
    email,
    auth_key,
    auth_method,
    record_name,
    zone_identifier,
  });
  if (ARecord) {
    const record_identifier = ARecord.id;
    const url = `https://api.cloudflare.com/client/v4/zones/${zone_identifier}/dns_records/${record_identifier}`;
    const headers = getHeader(email, auth_key, auth_method);
    try {
      const response = await axios.patch(
        url,
        {
          type: 'A',
          name: record_name,
          content: publicIpAddress,
          ttl,
          proxied: proxy,
        },
        {
          headers,
        }
      );
      if (response.data.success && response.data.result.length === 0) {
        console.error('Failed to update A record');
        return;
      }
      console.log(
        `Updated IP address to ${publicIpAddress} of ${record_name} in cloudflare`
      );
      return response.data.result[0];
    } catch (e) {
      const error = e as any;
      console.log(error.response.data.errors[0].message);
    }
  }
  return;
};
