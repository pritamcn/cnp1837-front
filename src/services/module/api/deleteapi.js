export async function DeleteWithToken(url,{ arg:{axios} }) {
    let res=await axios.delete(`${url}`)
    return res;
  }
  export async function DeleteWithTokenTriggerApi(url,{ arg:{id,axios} }) {
    let res=await axios.delete(`${url}/${id}`)
    return res;
  }