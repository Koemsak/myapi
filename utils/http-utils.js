import axios from "axios";

export function requestUtility(url, data, header, method, logKey) {
  axios({
    method: method,
    url: url,
    data: data,
    headers: header
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};