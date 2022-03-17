import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, message, Modal, Pagination, Row, Space, Table } from 'antd';
import {
  get_config_list,
  add_config_info,
  del_config_info,
  search_forbidden_ip,
} from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import { PlusCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import ModalBuilder from '@/pages/Components/ModalBuilder';

const Index = () => {
  const [sort, setSort] = useState('name'); // 排序升降
  const [order, setOrder] = useState('asc'); // 排序类型
  const [page, setPage] = useState(1); // 排序类型
  const [pagecount, setPagecount] = useState(10); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);
  const [visibleValue, setVisibleValue] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [formValue, setFormValue] = useState({} as any);
  const keyList = ['key1', 'value', 'keyDetails', 'actions'];
  const NameList = ['Key', '参数值', '配置详情', '操作'];
  const primary = 'key1';
  const autocomplete_key = {
    key1: {
      'limit_ip:all': '如200/100 前者表示一分钟内的并发数/后者超过前者的数量的延时响应',
      'limit_uri:all': '如200/100 前者表示一分钟内的并发数/后者超过前者的数量的延时响应',
      not_wait_forbidden_ratio: `默认为0.5, 规则判断错序的比例 `,
      not_wait_forbidden_min_len: `默认为20, 规则判断错序最小值 `,
      min_all_visit_times: `默认为20, 规则判定总访问次数的起点值 `,
      max_visit_idx_num: `默认为2, 排序最高的前两台占比 `,
      max_visit_ratio: `默认为0.75, 即前2条访问量占总比值的比例 `,
      default_forbidden_time: `禁用ip的默认时长, 默认为600即10分 `,
      white_ip_check: `白名单检查 on 为开启 `,
      forbidden_ip_check: `IP禁止检查 on 为开启- `,
      limit_ip_check: `IP限制检查 on 为开启 `,
      white_url_check: `白名单url检查 on 为开启 `,
      post_attack_check: `post参数攻击请求on 为开启 `,
      url_args_attack: `参数攻击请求on 为开启 `,
      random_record_value: `随机记录的值, 100%则填10000 `,
      limit_wd: '针对星期的限制，1/2/4，表示星期一,星期二,星期四做限制',
      limit_time: '针对时间段的限制, 如(12:00-13:00/18:30-20:30)表示12点到13点, 18点半到20点半',
      'limit_ip:127.0.0.1':
        '针对ip(127.0.0.1)如200/100 前者表示一分钟内的并发数/后者超过前者的数量的延时响应',
      'limit_uri:/test/limit':
        '针对uri(/test/limit)如200/100 前者表示一分钟内的并发数/后者超过前者的数量的延时响应',
    },
  };
  const { Search } = Input;
  const values = {
    page: page,
    pagecount: pagecount,
  };
  const setKeyDetails = (_keyName: string, _value: any) => {
    const deatilsText = [];
    let nowText = '';
    const nowValue = (
      <span key={_keyName} style={{ color: 'red' }}>
        {_value}
      </span>
    );
    nowText = (autocomplete_key[primary][_keyName] || '未匹配到对应的key ') + '-> 当前 ';
    deatilsText.push(nowText);
    deatilsText.push(nowValue);
    return deatilsText;
  };
  const setTableData = (value: any) => {
    //创建表格
    const datas = value?.lists || [];
    const columns = [];
    const dataSource: any = [];
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
    columns[columns.length - 1].fixed = 'right';
    columns[columns.length - 1].width = 180;
    datas.forEach((element: any, index: any) => {
      for (const keyName in element) {
        const keyDetails = setKeyDetails(keyName, element[keyName]);
        dataSource.push({
          key: index,
          key1: keyName || '',
          value: element[keyName] || '',
          keyDetails,
          actions: [
            {
              component: 'button',
              type: 'primary',
              text: '编辑',
              key: index + 1,
              id: index,
              custom: 'update',
            },
            {
              component: 'button',
              type: 'primary',
              text: '删除',
              key: index,
              id: index,
              custom: 'delete',
            },
          ],
        });
      }
    });

    const count = value.count > 0 ? value.count : dataSource.length;
    const _setTableinfo = {
      columns: columns,
      dataSource: dataSource,
      total: count || 0,
      current: page || 1,
      pageSize: pagecount || 10,
    };
    setUseTableData(_setTableinfo); //修改表格数据
  };
  // 当页数和展示数量发生改变时,重新发起请求
  const _get_config_list = async () => {
    const value = await get_config_list({ ...values });
    if (value.success > 0) {
      setTableData(value);
    }
    // setLoadings(!loadings);
    return value;
  };

  // 删除
  const _del_config_info = async (_values: any) => {
    const value = await del_config_info({ ..._values });
    console.log(value, '_del_config_info');
    return value;
  };

  // 新增
  const _add_config_info = async (_values: any) => {
    const value = await add_config_info({ ..._values });
    console.log(value, '_add_config_info');
    return value;
  };

  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_config_list();
    }
    setLoadings(false);
  }, [page, pagecount, loadings]);

  const handleCancel = (isLoading: boolean) => {
    if (isLoading === true) {
      setLoadings(!loadings);
    }
    setVisibleValue(false);
  };

  const setFormData = ({ ...value }) => {
    setVisibleValue(true);
    setFormValue({ ...value });
  };

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

  const getKeyNameList = (value: any) => {
    // console.log(value);
    const keyNameLis: any = {};
    if (value.length > 0) {
      value.forEach((key: any) => {
        keyNameLis[key] = '';
      });
      return keyNameLis;
    }
    return {};
  };

  const onSelectChange = (_selectedRowKeys: any) => {
    setSelectedRowKeys(_selectedRowKeys);
  };

  const enterLoading = (value: boolean) => {
    setLoadings(value);
  };

  const onSearch = (value: any) => {
    console.log(value);
    setSearchValue(value);
    enterLoading(!loadings);
  };

  const setInputKeyName = (_keyList: string[], _NameList: string[]) => {
    const modalNameList = {};
    (_keyList || []).forEach((key: string | number, index: string | number) => {
      modalNameList[key] = _NameList[index];
    });
    return modalNameList;
  };

  const handleOk: any = (id: any, type: string) => {
    let KeyNameList = '';
    const actionFuncType: any = {
      update: _add_config_info,
      delete: _del_config_info,
    };
    for (const dataSource of useTableData.dataSource) {
      if (dataSource.key == id) {
        KeyNameList = dataSource;
      }
    }
    setFormData({
      actionType: type,
      actionFunc: (_values: any) => actionFuncType[type](_values),
      modalKeyList: KeyNameList,
      modalNameList: setInputKeyName(keyList, NameList),
      autocomplete_key,
      primary,
      loadings: loadings,
    });
  };

  async function confirm(e: any) {
    //批量删除数据
    console.log(e);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    let selectedRowKeysList = '';
    selectedRowKeys.forEach((key: any, index: any) => {
      for (const dataSource of useTableData.dataSource) {
        if (dataSource.key == key) {
          selectedRowKeysList +=
            index == 0 ? `${dataSource['client_ip_list']}` : `;${dataSource['client_ip_list']}`;
        }
      }
    });
    const _values = {
      client_ip_list: selectedRowKeysList,
    };
    const result = await _del_config_info(_values);
    if (result.success < 0) {
      message.error({
        content: result.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      message.success({
        content: '处理成功',
        style: {
          fontSize: 16,
        },
      });
      handleCancel(true);
    }
  }

  function cancel(e: any) {
    console.log(e);
    setIsModalVisible(false);
    message.success('已取消操作');
  }

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
                  setFormData({
                    actionType: 'add',
                    actionFunc: (_values: any) => _add_config_info(_values),
                    modalKeyList: getKeyNameList(keyList),
                    modalNameList: setInputKeyName(keyList, NameList),
                    autocomplete_key,
                    primary,
                    loadings: loadings,
                  });
                }}
                type="primary"
                icon={<PlusCircleOutlined />}
              >
                新增
              </Button>
            </Space>
          </Col>
        </Row>
      </>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
    <PageContainer style={{ overflow: 'hidden' }}>
      <React.Fragment>
        {/* <Card size="small" className={Style.paddingCard}>{beforesearchLayout()}</Card> */}
        <Card>
          <Card style={{ borderBottom: 0 }} size="small">
            {beforesearchLayout()}
          </Card>
          <Table
            // className={Style.carMarginTop}
            // rowSelection={rowSelection}
            columns={ColumnsBuilder(useTableData?.columns, handleOk)}
            dataSource={useTableData?.dataSource}
            scroll={{ y: 600 }}
            pagination={false}
            loading={loadings}
            onChange={tableChangeHandler}
            showSorterTooltip={true}
            bordered
            // summary={getTableData?.summary}
            // footer={123}
          />
          {afterTableLayout()}
          <ModalBuilder
            visibleValue={visibleValue}
            handleCancel={handleCancel}
            setData={formValue}
          />
        </Card>
      </React.Fragment>
    </PageContainer>
  );
};

export default Index;
