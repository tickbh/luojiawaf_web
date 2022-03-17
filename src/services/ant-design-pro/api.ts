// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

const { NODE_ENV } = process.env;
export let request_url = 'http://127.0.0.1:6988';
if (NODE_ENV != 'development') {
  request_url = '';
}
let my_token: string = localStorage.getItem('waf-token') || '';
export let my_project: string = localStorage.getItem('waf-project') || '';

export function set_access_token(token: string) {
  my_token = token;
  localStorage.setItem('waf-token', token);
}

export function set_project_name(name: string) {
  my_project = name;
  localStorage.setItem('waf-project', name);
}

function do_request<T>(url: string, options: { [key: string]: any }): Promise<T> {
  if (url.indexOf('/waf/login') == -1) {
    if (!options['headers']) {
      options['headers'] = {};
    }
    options['headers']['X-Token'] = my_token;
  }
  return request(request_url + url, options);
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return do_request<{
    data: API.CurrentUser;
  }>('/waf/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return do_request<Record<string, any>>('/waf/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return do_request<API.LoginResult>('/waf/login?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 POST /waf/modify_password */
export async function modify_password(body: any, options?: { [key: string]: any }) {
  return do_request<any>('/waf/modify_password?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码 POST /waf/modify_password */
export async function modify_project_name(body: any, options?: { [key: string]: any }) {
  return do_request<any>('/waf/modify_project_name?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function search_forbidden_ip( //禁用IP
  params: {
    // query
    /** 当前IP */
    client_ip?: string;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/search_forbidden_ip?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_forbidden_ip_list( //禁用IP
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_forbidden_ip_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_client_ip_url_times( //禁用IP
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
    /** 页面的容量 */
    ip?: string;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_client_ip_url_times?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_cc_attck_times( //禁用IP
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
    /** 页面的容量 */
    ip?: string;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_cc_attck_times?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_request_aver_rank( //平均访问耗时
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_request_aver_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_request_cost_rank( //访问耗时
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_request_cost_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// export async function get_request_cost_time( //访问耗时
//   params: {
//     // query
//     /** 当前的页码 */
//     page?: number;
//     /** 页面的容量 */
//     pagecount?: number;
//     urls?: any;
//   },
//   options?: { [key: string]: any },
// ) {
//   return do_request<any>('/waf/get_request_cost_time?', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

/** 登录接口 POST /api/login/account */
export async function get_request_cost_time(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  return do_request<API.LoginResult>('/waf/get_request_cost_time?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function get_request_aver_time(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  return do_request<API.LoginResult>('/waf/get_request_aver_time?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function get_request_url_times(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  return do_request<API.LoginResult>('/waf/get_request_url_times?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_online_client_ips( //url请求数
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_online_client_ips?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_request_url_rank( //url请求数
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_request_url_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function clear_request_url_rank( //url请求数
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/clear_request_url_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function clear_request_cost_rank( //url请求数
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/clear_request_cost_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function clear_request_aver_rank( //url请求数
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/clear_request_aver_rank?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_client_detail( //客户端IP列表
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_client_detail?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_upstream_detail( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_upstream_detail?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_upstream_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_upstream_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_upstream_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/add_upstream_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_upstream_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_upstream_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_ssl_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_ssl_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_ssl_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/add_ssl_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_ssl_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_ssl_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_error_list( //获取高防列表
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
    /** 页面的容量 */
    name?: string;
    /** 页面的容量 */
    status?: string;
    /** 页面的容量 */
    yesterday?: number | boolean;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_error_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_server_infos( //获取服务器信息
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
    /** 页面的容量 */
    name?: string;
    /** 页面的容量 */
    status?: string;
    /** 页面的容量 */
    yesterday?: number | boolean;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_server_infos?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_client_attack_visits( //获取高防列表
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
    /** 页面的容量 */
    name?: string;
    /** 页面的容量 */
    status?: string;
    /** 页面的容量 */
    yesterday?: number | boolean;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_client_attack_visits?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_block_list( //获取高防列表
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_block_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_block_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //新增封禁IP
  return do_request<any>('/waf/add_block_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_block_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_block_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function add_forbidden_ip(body: any, options?: { [key: string]: any }) {
  //新增封禁IP
  return do_request<any>('/waf/add_forbidden_ip?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_forbidden_ip(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_forbidden_ip?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_ccrule_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_ccrule_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_ccrule_info(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/add_ccrule_info?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_ccrule_info(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_ccrule_info?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_config_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_config_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_config_info(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/add_config_info?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_config_info(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_config_info?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_record_ip_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_record_ip_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_record_ip_client(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  //删除封禁IP
  return do_request<any>('/waf/add_record_ip_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_record_ip_client(
  body: API.LoginParams,
  options?: { [key: string]: any },
) {
  //删除封禁IP
  return do_request<any>('/waf/del_record_ip_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_whiteurl_list( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_whiteurl_list?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add_whiteurl_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/add_whiteurl_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function del_whiteurl_client(body: API.LoginParams, options?: { [key: string]: any }) {
  //删除封禁IP
  return do_request<any>('/waf/del_whiteurl_client?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function get_client_ip_visit( //访问列表
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_client_ip_visit?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function get_client_random_visits( //负载均衡
  params: {
    // query
    /** 当前的页码 */
    page?: number;
    /** 页面的容量 */
    pagecount?: number;
  },
  options?: { [key: string]: any },
) {
  return do_request<any>('/waf/get_client_random_visits?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
