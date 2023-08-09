import { axiosAuth as axios } from "@/lib/axios";
export const WithoutTokenGetApi=url => axios.get(url)
export async function WithTokenGetApi(url,axios) {
    let res=await axios.get(`${url}`)
    return res;
  }
export async function WithTokenWithoutTriggerGetApi(url,{ arg:{axios} }) {
    let res=await axios.get(`${url}`)
    return res;
  }
  export async function WithTokenTriggerGetApi(url,{ arg:{id,axios} }) {
    let res=await axios.get(`${url}/${id}`)
    return res;
  }
  export async function WithTokenTriggerPaginationGetApi(url,{ arg:{id,axios,page,search,size} }) {
    let res=await axios.get(`${url}/${id}?search=${search}&page=${page}&size=${size}`)
    return res;
  }