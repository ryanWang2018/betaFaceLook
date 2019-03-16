import axios from "axios";

export default axios.create({
  //baseURL: " http://localhost:4000",
  baseURL: "https://hidden-cliffs-49484.herokuapp.com",
  timeout: 10000,

  withCredentials: true
  // transformRequest: [(data) => JSON.stringify(data.data)],
  // headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  // }
  // headers: { "Access-Control-Allow-Origin" },
});
