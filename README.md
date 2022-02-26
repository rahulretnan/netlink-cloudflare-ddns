# Netlink-Cloudflare-DDNS

[![MIT License](https://img.shields.io/github/license/NVictaTechSolution/netlink-cloudflare-ddns)](https://raw.githubusercontent.com/NVictaTechSolution/netlink-cloudflare-ddns/main/LICENSE)

![Tag](https://img.shields.io/github/v/tag/NVictaTechSolution/netlink-cloudflare-ddns)

![Open Issues](https://img.shields.io/github/issues/NVictaTechSolution/netlink-cloudflare-ddns)

![Star](https://img.shields.io/github/stars/NVictaTechSolution/netlink-cloudflare-ddns)

This package helps you to update your Dynamic WAN IP of Netlink Router into Cloudflare Dynamic DNS (DDNS) service.
You will be able to remotely access your home network with your custom domain registered in Cloudflare.

## Installation

Install **netlink-cloudflare-ddns** with **npm**

```bash
  npm install netlink-cloudflare-ddns
```

## API Reference

| Parameter         | Type             | Description                                                                |
| :---------------- | :--------------- | :------------------------------------------------------------------------- |
| `email`           | `string`         | The email used to login 'https://dash.cloudflare.com'                      |
| `auth_method`     | `global / token` | Set to "**global**" for Global API Key or "**token**" for Scoped API Token |
| `auth_key`        | `string`         | Your API Token or Global API Key                                           |
| `zone_identifier` | `string`         | Your **Zone Id**, Can be found in the "**Overview**" tab of your domain    |
| `record_name`     | `string`         | Name of **A record** you want to update                                    |
| `ttl`             | `string`         | Set the DNS TTL (seconds)                                                  |
| `proxy`           | `boolean`        | Set the proxy to true or false                                             |
| `gateWayIp`       | `string`         | The router gateway Ip address                                              |
| `username`        | `string`         | The user name of router                                                    |
| `password`        | `string`         | The password of router                                                     |

## Usage/Examples

```javascript
// ES6 or TypeScript:
import netlinkCloudFlareDDns from 'netlink-cloudflare-ddns';

// In other environments:

const netlinkCloudFlareDDns = require('netlink-cloudflare-ddns');

setInterval(async () => {
  await netlinkCloudFlareDDns({
    email: 'email@example.com',
    auth_key: 'smlkSIOKMSJBJBCXJBmSKMSSOsMOm0OSK',
    auth_method: 'token',
    record_name: 'test.example.com',
    zone_identifier: '2dfsd2fs2dfsff1s2fs212sf1f2sf1fsfg',
    proxy: false,
    ttl: 3600,
    gateWayIp: '192.168.1.1',
    username: 'admin',
    password: 'admin',
  });
}, 10000);
```

## Reference

This project is referenced from [cloudflare-ddns-updater](https://github.com/K0p1-Git/cloudflare-ddns-updater)

## License

[MIT](https://raw.githubusercontent.com/NVictaTechSolution/netlink-cloudflare-ddns/main/LICENSE)
