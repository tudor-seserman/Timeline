import axios from "axios";


export default axios.create({
  // DEVELOPMENT
  baseURL: "http://localhost:5128/api/",
  // PRODUCTION
  // baseURL: "",
});
