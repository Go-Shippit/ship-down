const pd_api_call = async (url: string, token: string) => {
  const pdRequest = await fetch(`https://api.pagerduty.com/${url}`, {
    method: 'GET',
//      'Authorization': `Token token=${token}`
//      'Content-Type': 'application/json',

    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.pagerduty+json;version=2'      
    }})
    const pdData = await pdRequest.text();
    return JSON.parse(pdData);
};

/**
 * @param schedules
 * @param date
 */
export const get_oncall_ids = async (
  schedules: string,
  date: string,
  external_token: string
) => {
  const sched_params = await Promise.all(schedules.split(",").map(async (s) => {
    return `schedule_ids[]=${s}`
  }))
  let url: string = `oncalls?since=${date}&` + sched_params.join('&');

  const resp = await pd_api_call(url, external_token);

  const oncall_list: string[] = await Promise.all(resp.oncalls.map(async (id: any) => {
    return id.user.id
  }));

  let oncall_unique = [... new Set(oncall_list)]; //dedup
  return oncall_unique;
};

/**
 * @param id
 */
export const get_email = async (id: string, external_token: string) => {
  const resp = await pd_api_call(`/users/${id}`, external_token);
  return resp.user.email;
};
