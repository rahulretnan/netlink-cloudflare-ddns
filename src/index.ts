import { ICloudflareApiProps, updateARecordIp } from './cloudflareApi';
import { getPublicIpAddress, IGetPublicIpAddress } from './netlinkRouterApi';
export * from './cloudflareApi';
export * from './netlinkRouterApi';

export type INetlinkDDnsProps = ICloudflareApiProps & IGetPublicIpAddress;

const netlinkDDns = async ({
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
}: INetlinkDDnsProps) => {
  const publicIpAddress: string | undefined = await getPublicIpAddress({
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

module.exports = netlinkDDns;
