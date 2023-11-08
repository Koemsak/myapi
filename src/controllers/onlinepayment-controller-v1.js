import Joi from 'joi';
import Log from "../logger";
import { generateTxnId } from "../../utils/generateTxn";
import { onlinePaymentSchema } from "../models/Authorized";
import { createCipheriv, createHash, randomBytes } from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export const authorization = async (req, res) => {
  const logKey = generateTxnId("");
  Log.info(`${logKey} ------------------------ START REQEUST AUTHORIZATION ------------------------`);
  Log.info(`${logKey} Request data from partner: ${JSON.stringify(req.body)}`);
  // Validate field from partner request data
  const { error } = Joi.object(onlinePaymentSchema).validate(req.body);
  if (error) {
    const errorLog = { status: 400, message: error.details[0].message, data: null };
    Log.info(`${logKey} Response error from online payment controller v1 to partner: ${JSON.stringify(errorLog)}`);
    return res.status(400).json(errorLog);
  }

  // Get credential of third party
  const appMode = process.env.APP_MODE;
  let payment_base_url = process.env.PAYMENT_UAT_URL;
  if (appMode === "production") {
    payment_base_url = process.env.PAYMENT_PROD_URL;
  }

  const req_url = `${payment_base_url}/v1/gateway/check-credential`;
  const req_body = {
    user_name: req.body.username,
    rest_api_key: req.body.rest_api_key,
    service_type: "BILLPAYON"
  };
  const req_header = {
    "Content-Type": "application/json",
  };
  Log.info(`${logKey} Request check account url: ${req_url}`);
  Log.info(`${logKey} Request check account header: ${JSON.stringify(req_header)}`);
  Log.info(`${logKey} Request check account body: ${JSON.stringify(req_body)}`);

  // axios.post(req_url, req_body, { headers: req_header }).then((response) => {
  //   Log.info(`${logKey} Response check account from partner: ${JSON.stringify(response.data)}`);
  //   return res.status(200).json(response.data);
  // })
  //   .catch((error) => {
  //     const errorLog = { status: 500, message: error.message, data: null };
  //     Log.info(`${logKey} Response error from online payment controller v1 to partner: ${JSON.stringify(errorLog)}`);
  //     return res.status(500).json(errorLog);
  //   })

  axios({
    method: 'post',
    url: req_url,
    data: req_body,
    headers: req_header
  })
    .then(function (response) {
      Log.info(`${logKey} Response check account from partner: ${JSON.stringify(response.data)}`);
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      const errorLog = { status: 500, message: error.message, data: null };
      Log.info(`${logKey} Response error from online payment controller v1 to partner: ${JSON.stringify(errorLog)}`);
      return res.status(500).json(errorLog);
    });
}

export const test = async (req, res) => {
  // Set the current timestamp
  const currenttimestamp = Math.floor(Date.now() / 1000).toString();

  // Generate random strings
  const arrSource = '0123456789abcdef0123456789abcdef0123456789abcdef';
  const rand_str = randomBytes(8).toString('hex');
  const order_reference = randomBytes(4).toString('hex');


  // Set the amount
  let amount = 0.01;
  amount = amount.toFixed(2);

  // Set the credentials
  const username = 'online.seatusd';
  const billNum = '00426';
  const apiKey = 'f4d2149717c3d2d2e7070b4bb4e6546cb9803f90179724a16c0d36bc3b9c8aae';
  const password = '277a44d5ca16cd81ae9538f1269182df';

  // Set the endpoints and URLs
  const reqEndpoint = 'v1/online/payment/authorization';
  const confirmationEndpoint = 'v1/online/payment/confirm';
  const baseUrl = 'https://sdk-uat.wingmoney.com/wingonlinesdkv2';
  // const baseUrl = 'http://localhost/wingonlinesdkv2';
  const domain = 'api-dev.yes.com.kh';
  const referer = Buffer.from(`https://${domain}`).toString('base64');

  // Create the payload
  const data = {
    amount: amount,
    bill_till_number: billNum,
    order_reference_no: order_reference,
    return_url: 'https://www.google.com',
    cancel_url: 'https://www.google.com',
    rand_str: rand_str,
    timestamp: currenttimestamp,
    merchant_name: '',
    integration_type: 'WEBAPP'
  };

  // Encrypt the payload
  const iv = Buffer.from(password.substring(0, 16));
  const cipher = createCipheriv('aes-256-cbc', password, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const payload = Buffer.from(encrypted, 'base64').toString('base64');

  // Hash encryption
  const dataHash = `${username}#${apiKey}#${billNum}#${amount}#${order_reference}#${rand_str}#${currenttimestamp}`;
  const base64Hash = Buffer.from(dataHash).toString('base64');
  const aes256Hash = createCipheriv('aes-256-cbc', password, rand_str);
  let encryptedHash = aes256Hash.update(base64Hash, 'utf8', 'base64');
  encryptedHash += aes256Hash.final('base64');
  const hash = createHash('sha256').update(encryptedHash).digest('hex').toUpperCase();

  // Create the request object
  const request = {
    username: username,
    rest_api_key: apiKey,
    payload: payload,
    hash: hash,
    sandbox: '1'
  };

  console.log(JSON.stringify(request));

  // Make the API request
  axios.post(`${baseUrl}/${reqEndpoint}`, request, {
    headers: {
      'Content-Type': 'application/json',
      'Referer': referer
    }
  })
    .then(response => {
      console.log(response.data);
      if (response.data.errorCode === '200') {
        const success = {
          status: 200,
          message: 'Success',
          redirect_url: baseUrl + "/" + confirmationEndpoint + '?token=' + Buffer.from(response.data.token).toString('base64')
        }
        return res.status(200).json(success);
      } else {
        const error = {
          status: 500,
          message: response.data.errorText,
          redirect_url: null
        }
        return res.status(500).json(error);
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(401).json(error);
    });
}
