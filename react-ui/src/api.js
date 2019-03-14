import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,

  withCredentials: true
  // transformRequest: [(data) => JSON.stringify(data.data)],
  // headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  // }
  // headers: { "Access-Control-Allow-Origin" },
});
