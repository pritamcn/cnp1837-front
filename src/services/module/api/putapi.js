export async function UpdateWithTokenapi(url,  { arg:{data,axios} }) {
    let res=await axios.put(`${url}`, data)
    return res;
  }