import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Row, Table } from 'antd';
import Meta from 'antd/lib/card/Meta';
import {
  get_online_client_ips,
  get_cc_attck_times,
  get_forbidden_ip_list,
  get_client_detail,
  get_upstream_detail,
} from '@/services/ant-design-pro/api';
import { history } from 'umi';
import ColumnsBuilder from './Components/ColumnsBuilder';
const Index = () => {
  const [sort, setSort] = useState('name'); // 排序升降
  const [page, setPage] = useState(1); // 排序类型
  const [pagecount, setPagecount] = useState(10); // 排序类型
  const [loadings, setLoadings] = useState(false);
  const [online_client_ips, setOnline_client_ips] = useState('0');
  const [cc_attck_times, setCc_attck_times] = useState('0');
  const [cc_all_attck_times, setCc_all_attck_times] = useState('0');
  const [forbidden_ip_list, setforbidden_ip_list] = useState('0');
  const [clientTableData, setClientTableData] = useState({} as any);
  const [upstreamTableData, setUpstreamTableData] = useState({} as any);
  const values = {
    page: page,
    pagecount: pagecount,
  };

  //将秒转化为时分秒
  const formateSeconds = (timems: string) => {
    let str = '';
    const time = parseInt(timems);
    const hour = Math.floor(time / 3600);
    const hourFormat = hour > 9 ? hour : '0' + hour;
    const minute = Math.floor((time - hour * 3600) / 60);
    const minuteFormat = minute > 9 ? minute : '0' + minute;
    const second = Math.floor(time - hour * 3600 - minute * 60);
    const secondFormat = second > 9 ? second : '0' + second;
    str += hourFormat + ':' + minuteFormat + ':' + secondFormat;
    return str;
  };

  const setTableData = (value: any) => {
    const datas = value?.client_infos;
    const keyList = ['name', 'times', 'cost', 'aver'];
    const NameList = ['高防名称', '次数', '耗时', '平均耗时'];
    const columns = [];
    const dataSource = [];

    for (let i = 0; i < keyList.length; i += 1) {
      columns.push({
        title: NameList[i],
        // width: 180,
        dataIndex: keyList[i],
        key: keyList[i],
        type: keyList[i],
        ellipsis: true,
        fixed: '',
        // "sorter": true,
      });
    }
    for (const name in datas) {
      const sValue = formateSeconds(datas[name].cost);
      dataSource.push({
        key: name,
        name: name,
        cost: sValue,
        times: datas[name].times,
        aver: `${Math.round((datas[name].cost / datas[name].times) * 1000) || 0}ms`,
      });
    }

    const count = value.count > 0 ? value.count : dataSource.length;
    const _setTableinfo = {
      columns: columns,
      dataSource: dataSource,
      total: count || 0,
      current: page || 1,
      pageSize: pagecount || 10,
    };
    console.log(_setTableinfo, '_setTableinfo');
    setClientTableData(_setTableinfo);
  };

  const setTableData2 = (value: any) => {
    const datas = value?.upstream_infos;
    const keyList = ['name', 'times', 'cost', 'aver'];
    const NameList = ['host', '次数', '耗时', '平均耗时'];
    const columns = [];
    const dataSource = [];
    for (let i = 0; i < keyList.length; i += 1) {
      columns.push({
        title: NameList[i],
        // width: 150,
        dataIndex: keyList[i],
        key: keyList[i],
        type: keyList[i],
        ellipsis: true,
        fixed: '',
        // "sorter": true,
      });
    }
    console.log(datas, 'datas');
    for (const name in datas) {
      const sValue = formateSeconds(datas[name].cost);
      dataSource.push({
        key: name,
        name: name,
        cost: sValue,
        times: datas[name].times,
        aver: `${Math.round((datas[name].cost / datas[name].times) * 1000) || 0}ms`,
      });
    }

    const count = value.count > 0 ? value.count : dataSource.length;
    const _setTableinfo = {
      columns: columns,
      dataSource: dataSource,
      total: count || 0,
      current: page || 1,
      pageSize: pagecount || 10,
    };
    console.log(_setTableinfo, '_setTableinfo2');
    setUpstreamTableData(_setTableinfo);
  };

  // 在线IP数
  const _get_online_client_ips = async () => {
    const value = await get_online_client_ips({ ...values });
    const count = value.count > 0 ? value.count : 0;
    setOnline_client_ips(count.toString());
    return value;
  };

  // CC攻击数
  const _get_cc_attck_times = async () => {
    const value = await get_cc_attck_times({ ...values });
    const count = value.times > 0 ? value.times : 0;
    setCc_attck_times(count.toString());
    setCc_all_attck_times(value.all_times > 0 ? value.all_times : 0);
    return value;
  };

  // 禁止IP数
  const _get_forbidden_ip_list = async () => {
    const value = await get_forbidden_ip_list({ ...values });
    const count = value.count > 0 ? value.count : 0;
    setforbidden_ip_list(count.toString());
    return value;
  };

  const _get_client_detail = async () => {
    const value = await get_client_detail({ ...values });
    console.log(value, 'setTableData');
    if (value.client_infos) {
      setTableData(value);
    }
    return value;
  };

  const _get_upstream_detail = async () => {
    const value = await get_upstream_detail({ ...values });
    console.log(value, 'upstream_infos');
    if (value.upstream_infos) {
      setTableData2(value);
    }
    return value;
  };

  const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 8,
    style: {
      marginBottom: 10,
    },
  };
  const tableColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12,
    style: {
      marginBottom: 10,
    },
  };
  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_online_client_ips();
      _get_cc_attck_times();
      _get_forbidden_ip_list();
      _get_client_detail();
      _get_upstream_detail();
    }
    setLoadings(false);
  }, [page, pagecount, loadings]);

  return (
    <PageContainer style={{ overflow: 'hidden' }}>
      <React.Fragment>
        <Row gutter={10}>
          <Col {...topColResponsiveProps}>
            <Card
              title="在线IP数"
              extra={
                <div onClick={() => history.push('get_request_rank/get_online_client_ips')}>
                  <span style={{ color: '#40a9ff' }}>IP名单</span>
                </div>
              }
            >
              <Meta
                avatar={<Avatar src="/online_client_ips.png" />}
                title="当前IP数 : "
                description={online_client_ips}
              />
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card
              title="CC统计"
              extra={
                <div onClick={() => history.push('get_request_rank/set_ccrule_list')}>
                  <span style={{ color: '#40a9ff' }}>配置防护</span>
                </div>
              }
            >
              <Meta
                avatar={<Avatar src="/cc_attck_times.png" />}
                title={"CC攻击数 " + " 总计:"+cc_all_attck_times}
                description={cc_attck_times}
              />
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card
              title="禁止IP总数"
              extra={
                <div onClick={() => history.push('get_request_rank/get_forbidden_ip_list')}>
                  <span style={{ color: '#40a9ff' }}>禁用原因</span>
                </div>
              }
            >
              <Meta
                avatar={<Avatar src="/forbidden_ip_list.png" />}
                title="IP数量 : "
                description={forbidden_ip_list}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col {...tableColResponsiveProps}>
            <Table
              title={() => '客户端IP列表(最近两小时)'}
              columns={ColumnsBuilder(upstreamTableData?.columns, () => {})}
              dataSource={upstreamTableData?.dataSource}
              pagination={false}
              loading={loadings}
              showSorterTooltip={true}
              bordered
            />
          </Col>
          <Col {...tableColResponsiveProps}>
            <Table
              title={() => '高防host(最近两小时)'}
              columns={ColumnsBuilder(clientTableData?.columns, () => {})}
              dataSource={clientTableData?.dataSource}
              pagination={false}
              loading={loadings}
              showSorterTooltip={true}
              bordered
            />
          </Col>
        </Row>
      </React.Fragment>
    </PageContainer>
  );
};

export default Index;
