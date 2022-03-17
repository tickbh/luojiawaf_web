const RouteWatcher = '@/components/PageTab/RouteWatcher';
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    component: '@/components/PageTab/TabLayout',
    flatMenu: true, // lift sub-routes up to top
    routes: [
      {
        path: '/welcome',
        name: '数据首页',
        icon: 'smile',
        component: './Welcome',
        wrappers: [RouteWatcher],
      },
      {
        path: '/get_request_rank',
        icon: 'HomeOutlined',
        name: 'get_request_rank',
        routes: [
          {
            name: '获取在线IP',
            path: 'get_online_client_ips',
            component: './get_request_rank/get_online_client_ips',
            wrappers: [RouteWatcher],
          },
          {
            name: '禁止的ip列表',
            path: 'get_forbidden_ip_list',
            component: './get_request_rank/get_forbidden_ip_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '请求耗时列表',
            path: 'get_request_cost_rank',
            component: './get_request_rank/get_request_cost_rank',
            wrappers: [RouteWatcher],
          },
          {
            name: '获取错误列表',
            path: 'get_error_list',
            component: './get_request_rank/get_error_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '黑白名单||日志',
            path: 'get_record_ip_list',
            component: './get_request_rank/get_record_ip_list',
            wrappers: [RouteWatcher],
          },
          {
            name: 'URL白名单',
            path: 'get_whiteurl_list',
            component: './get_request_rank/get_whiteurl_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '随机访问列表',
            path: 'get_client_ip_visit',
            component: './get_request_rank/get_client_ip_visit',
            wrappers: [RouteWatcher],
          },
          {
            name: '渗透攻击列表',
            path: 'get_client_attack_visits',
            component: './get_request_rank/get_client_attack_visits',
            wrappers: [RouteWatcher],
          },
          {
            name: '服务器信息',
            path: 'get_server_infos',
            component: './get_request_rank/get_server_infos',
            wrappers: [RouteWatcher],
          },
        ],
      },
      {
        path: '/set_config_data',
        icon: 'SettingOutlined',
        name: 'set_config_data',
        routes: [
          {
            name: '配置参数列表',
            path: 'set_config_data',
            component: './set_config_data/set_config_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '配置负载均衡',
            path: 'set_upstream_list',
            component: './set_config_data/set_upstream_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '配置SSL',
            path: 'set_ssl_list',
            component: './set_config_data/set_ssl_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '配置高防列表',
            path: 'set_block_list',
            component: './set_config_data/set_block_list',
            wrappers: [RouteWatcher],
          },
          {
            name: '配置CC防护',
            path: 'set_ccrule_list',
            component: './set_config_data/set_ccrule_list',
            wrappers: [RouteWatcher],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
