import { ICloudflareApiProps, updateARecordIp } from './cloudflareApi';
import { getPublicIpAddress, IGetPublicIpAddress } from './netlinkRouterApi';

export type INetlinkCloudflareDDnsProps = ICloudflareApiProps &
  IGetPublicIpAddress;

const netlinkCloudFlareDDns = async ({
  email,
  auth_key,
  auth_method,
  record_name,
  zone_identifier,
  proxy,
  ttl,
  gateWayIp,
  username,
  password,
}: INetlinkCloudflareDDnsProps) => {
  const publicIpAddress = await getPublicIpAddress({
    gateWayIp,
    password,
    username,
  });
  if (publicIpAddress) {
    await updateARecordIp({
      email,
      auth_key,
      auth_method,
      record_name,
      zone_identifier,
      publicIpAddress,
      proxy,
      ttl,
    });
  }
};

export default netlinkCloudFlareDDns;
