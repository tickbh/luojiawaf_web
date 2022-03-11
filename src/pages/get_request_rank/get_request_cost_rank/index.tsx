import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  message,
  Pagination,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Table,
} from 'antd';
import {
  clear_request_cost_rank,
  clear_request_url_rank,
  clear_request_aver_rank,
  get_request_aver_rank,
  get_request_aver_time,
  get_request_cost_rank,
  get_request_cost_time,
  get_request_url_rank,
  get_request_url_times,
} from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import { PlusCircleOutlined } from '@ant-design/icons';

const Index = (_isIndex: boolean) => {
  const [sort, setSort] = useState('name'); // 排序升降
  const [order, setOrder] = useState('asc'); // 排序类型
  const [page, setPage] = useState(1); // 排序类型
  const [pagecount, setPagecount] = useState(10); // 排序类型
  const [requestType, setRequestType] = useState('cost'); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);
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
    //传入两组数据
    const datas = value;
    const keyList = ['url', 'cost', 'number', 'aver'];
    const NameList = ['url', '耗时', '请求次数', '平均耗时'];
    const columns = [];
    const dataSource = [];
    datas.url = datas.url || [];
    for (let i = 0; i < keyList.length; i += 1) {
      columns.push({
        title: NameList[i],
        width: 150,
        dataIndex: keyList[i],
        key: keyList[i],
        type: keyList[i],
        ellipsis: true,
        fixed: '',
        // "sorter": true,
      });
    }
    for (let o = 0; o < datas.url.length; o += 1) {
      const sValue = formateSeconds(datas.cost[o]);
      dataSource.push({
        key: o,
        url: datas.url[o],
        cost: `${sValue}`,
        number: datas.number[o],
        aver: `${Math.round(datas.aver[o] * 1000)}ms`,
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
    setUseTableData(_setTableinfo);
  };
  // 当页数和展示数量发生改变时,重新发起请求
  const _get_request_cost_rank = async () => {
    const result = await get_request_cost_rank({ ...values });
    return result;
  };

  const _get_request_url_rank = async () => {
    const result = await get_request_url_rank({ ...values });
    return result;
  };

  const _get_request_aver_rank = async () => {
    const result = await get_request_aver_rank({ ...values });
    return result;
  };

  const requestMap = {
    cost: _get_request_cost_rank,
    number: _get_request_url_rank,
    aver: _get_request_aver_rank,
  };

  const requestPustMap = {
    cost: get_request_cost_time,
    number: get_request_url_times,
    aver: get_request_aver_time,
  };

  const _get_request_url = async (type: string) => {
    const result = await requestMap[type]();
    const datas = result.datas || [];
    const request_name_list: any[] = [];
    const TableData: any = {};
    TableData[type] = [];
    (datas || []).forEach((list: any) => {
      request_name_list.push(list[0]);
      TableData.url = request_name_list;
      TableData[type].push(list[1]);
    });
    for (const key in requestPustMap) {
      if (key != type) {
        const resultPush = await requestPustMap[key]({ urls: request_name_list });
        const datasPush = resultPush.datas;
        TableData[key] = datasPush;
      }
    }
    console.log(TableData, 'TableData');
    TableData.count = result.count || 0;
    if (result.success > 0) {
      setTableData(TableData);
    }
  };

  const _clear_request_cost_rank = async () => {
    await clear_request_url_rank({ ...values });
    await clear_request_aver_rank({ ...values });
    const value = await clear_request_cost_rank({ ...values });

    if (value.success < 0) {
      message.error({
        content: value.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      _get_request_url(requestType);
      message.success({
        content: '清理成功',
        style: {
          fontSize: 16,
        },
      });
    }
    return value;
  };

  useEffect(() => {
    _get_request_url(requestType);
  }, [page, pagecount, requestType]);

  const tableChangeHandler = (_: any, __: any, sorter: any) => {
    if (sorter.order === undefined) {
      setSort('');
    } else {
      const orderBy = sorter.order === 'ascend' ? 'asc' : 'desc';
      setOrder(`${orderBy}`);
      setSort(`${sorter.field}`);
    }
  };
  const paginationChangeHandler = (_page: any, _per_page: any) => {
    setPage(_page);
    setPagecount(_per_page);
  };

  const RadioChange = (e: RadioChangeEvent) => {
    console.log(e.target.value, 'dasdasdasda');
    setRequestType(e.target.value);
  };

  const beforesearchLayout = () => {
    return (
      <>
        <Row>
          <Col flex="1 1 200px">
            {/* <Space>
              <Search placeholder="input search text" onSearch={onSearch} enterButton />
              <Button
                key="button"
                type="primary"
                icon={<PoweroffOutlined />}
                // loading={result.loading}
                onClick={() => enterLoading(!loadings)}
              >
                查询
              </Button>
            </Space> */}
          </Col>

          <Col flex="0 1 300px" style={{ textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  _clear_request_cost_rank();
                }}
                type="primary"
                icon={<PlusCircleOutlined />}
              >
                清理数据
              </Button>
            </Space>
          </Col>
        </Row>
      </>
    );
  };

  const afterTableLayout = () => {
    return (
      <Row
        style={{
          marginTop: 20,
        }}
      >
        <Col xs={24} sm={12}></Col>
        <Col xs={24} sm={12}>
          <Pagination
            defaultCurrent={1}
            total={useTableData?.total || 0}
            current={useTableData?.current || 1}
            pageSize={useTableData?.pageSize || 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `总共 ${total} 条数据`}
            onChange={paginationChangeHandler}
            onShowSizeChange={paginationChangeHandler}
          ></Pagination>
        </Col>
      </Row>
    );
  };
  // 将表格输出内容分装成组件

  return (
    <PageContainer title={_isIndex == false ? false : ''} style={{ overflow: 'hidden' }}>
      <React.Fragment>
        <Card style={{ borderBottom: 0 }} size="small">
          {beforesearchLayout()}
        </Card>
        <Card>
          {/* {beforeTableLayout()} */}
          <Table
            // className={Style.carMarginTop}
            title={() => (
              <Radio.Group
                onChange={(value) => {
                  RadioChange(value);
                }}
                value={requestType}
              >
                <Radio value="cost">cost</Radio>
                <Radio value="number">number</Radio>
                <Radio value="aver">aver</Radio>
              </Radio.Group>
            )}
            columns={ColumnsBuilder(useTableData?.columns, () => {})}
            dataSource={useTableData?.dataSource}
            scroll={{ y: 600 }}
            pagination={false}
            // loading={init.loading}
            onChange={tableChangeHandler}
            showSorterTooltip={true}
            bordered
            // summary={getTableData?.summary}
            // footer={ tableData.summary}
          />
          {afterTableLayout()}
        </Card>
      </React.Fragment>
    </PageContainer>
  );
};

export default Index;
