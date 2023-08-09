
import { axiosAuth } from "@/lib/axios";
export function WithoutTokenPostApi(url, arg ) {
    return axiosAuth.post(`${url}`, arg.arg)
  }
  export async function WithTokenPostApi(url,{ arg:{payload,axios} }) {
   let res=await axios.post(`${url}`, payload)
    return res;
  }
  export async function WithTokenMultipleFormdataPostApi(url,{arg:{payload,axios,name}} ) {
     let data = new FormData();
     for (let i=0;i<payload?.length;i++){
      data.append(`${name}`, payload[i]);
     }
    let res=await axios.post(`${url}`, data)
    return res;
  }
  export async function WithTokenSingleFormdataPostApi(url,{arg:{payload,axios,name}} ) {
    let data = new FormData();
    data.append(`${name}`, payload);
   let res=await axios.post(`${url}`, data)
   return res;
 }