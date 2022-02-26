import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import url from 'url';

type VerificationCodeType = string | string[] | undefined;
type CsrfTokenType = string | string[] | undefined;

/**
 * Log into the router.
 *
 * @param gateWayIp - The router gateway Ip address.
 * @param username - The user name to login to router
 * @param password - The password to login to router
 */

export interface IGetPublicIpAddress {
  gateWayIp: string;
  username: string;
  password: string;
}

const ipRegex =
  '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

const checkIsLoggedIn = async (gateWayIp: string) => {
  let verificationCode: VerificationCodeType;
  let csrfToken: CsrfTokenType;
  try {
    const response: AxiosResponse<any, any> = await axios.get(
      `http://${gateWayIp}`
    );
    const $ = cheerio.load(response.data);
    verificationCode = $('#check_code').val();
    csrfToken = $('input[name=csrftoken]').val();
  } catch (e) {
    return {
      verificationCode: undefined,
      csrfToken: undefined,
      error: {
        message:
          'There is an issue with your network or please check the details provided are correct',
      },
    };
  }

  return { verificationCode, csrfToken, error: undefined };
};

const getLogoutCsrfToken = async (gateWayIp: string) => {
  let csrfToken: CsrfTokenType;
  try {
    const response = await axios.get(`http://${gateWayIp}/top_en.asp`);
    const $ = cheerio.load(response.data);
    csrfToken = $('input[name=csrftoken]').val();
    if (csrfToken) {
      return csrfToken;
    }
  } catch (e) {
    console.log(
      'There is an issue with your network or please check the router details provided are correct'
    );
  }
  return;
};

const login = async (
  verificationCode: VerificationCodeType,
  csrfToken: CsrfTokenType,
  username: string,
  password: string,
  gateWayIp: string
) => {
  if (verificationCode && csrfToken) {
    const params = new url.URLSearchParams({
      username,
      psd: password,
      verification_code: verificationCode,
      csrftoken: csrfToken,
    });
    await axios.post(
      `http://${gateWayIp}/boaform/admin/formLogin_en`,
      params.toString()
    );
    console.log('Successfully logged in');
  } else {
    console.log('Please check your verification code and csrf token');
  }
};
export const logout = async (gateWayIp: string) => {
  const csrfToken = await getLogoutCsrfToken(gateWayIp);
  if (csrfToken) {
    const params = new url.URLSearchParams({
      csrftoken: csrfToken,
    });

    await axios.post(
      `http://${gateWayIp}/boaform/admin/formLogout`,
      params.toString()
    );
    console.log('Successfully logged out');
  } else {
    console.log('Please check your csrf token');
  }
};

const getMyIp: (gateWayIp: string) => Promise<string> = async (
  gateWayIp: string
) => {
  try {
    const response = await axios.get(
      `http://${gateWayIp}/status_net_connet_info_en.asp`
    );
    const $ = cheerio.load(response.data);
    const parsedScriptInnerText = ($('script')[1].children[0] as any).data;
    const matchIpAddress = parsedScriptInnerText.match(ipRegex);
    if (matchIpAddress[0]) {
      const ipAddress = matchIpAddress[0];
      if (ipAddress === '255.255.255.255') {
        console.log('Please check your internet connection');
        return;
      }
      console.log(`Your public ip address is ${ipAddress}`);
      return ipAddress;
    }
  } catch (e) {
    console.log(
      'There is an issue with your network or please check the router details provided are correct'
    );
  }
  return;
};

export const getPublicIpAddress = async ({
  gateWayIp,
  username,
  password,
}: IGetPublicIpAddress) => {
  const { verificationCode, csrfToken, error } = await checkIsLoggedIn(
    gateWayIp
  );
  if (error) {
    console.log(error.message);
    return;
  }
  if (verificationCode && csrfToken) {
    await login(verificationCode, csrfToken, username, password, gateWayIp);
  }
  return await getMyIp(gateWayIp);
};
