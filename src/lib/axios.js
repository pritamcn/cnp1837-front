import axios from "axios";
import { baseURL } from "../config";
export const axiosAuth = axios.create({
  baseURL: baseURL,
  //headers: { "Content-Type": "application/json" },
});