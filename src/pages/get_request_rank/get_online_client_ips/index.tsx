import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  notification,
  Pagination,
  Row,
  Space,
  Table,
  Tooltip,
} from 'antd';
import {
  get_online_client_ips,
  add_forbidden_ip,
  get_client_ip_url_times,
} from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import ModalBuilder from '@/pages/Components/ModalBuilder';
import { json } from '@umijs/deps/compiled/express';

const Index = (_isIndex: boolean) => {
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
  const keyList = ['client_ip_list', 'datetime', 'actions'];
  const NameList = ['IP', '时间戳', '操作'];
  const { Search } = Input;
  const values = {
    page: page,
    pagecount: pagecount,
    ip: searchValue,
  };

  const setTableData = (value: any) => {
    //创建表格
    const datas = value?.datas;
    const columns = [];
    const dataSource = [];
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
    for (let o = 0; o < datas.length; o += 1) {
      dataSource.push({
        key: o,
        client_ip_list: datas[o][0],
        datetime: datas[o][1],
        actions: [
          // { component: 'button', type: 'primary', text: '编辑', key: o + 1, id: o },
          {
            component: 'button',
            type: 'primary',
            text: '封禁',
            key: o + 1,
            id: o,
            custom: 'lock',
            forbidden_reason: datas[o][2],
          },
          {
            component: 'button',
            type: 'primary',
            text: '访问记录',
            key: o,
            id: o,
            custom: 'visit',
            forbidden_reason: datas[o][2],
          },
        ],
      });
      //单一搜索时增加被封禁原因
    }
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
  const _get_online_client_ips = async () => {
    const value = await get_online_client_ips({ ...values });
    if (value.success > 0) {
      setTableData(value);
    }
    // setLoadings(!loadings);
    return value;
  };

  const openNotification = (result: any) => {
    const description = JSON.stringify(result);
    console.log(result, 'result');
    notification.open({
      message: '访问记录详情',
      description,
      className: 'custom-class',
      style: {
        width: 600,
      },
    });
  };

  // 删除
  const _add_forbidden_ip = async (_values: any) => {
    const value = await add_forbidden_ip({ ..._values });
    console.log(value, '_add_forbidden_ip');
    return value;
  };

  // 访问记录
  const onSearch = async (value: any) => {
    const data = {
      ip: value || '',
    };
    const result = await get_client_ip_url_times({ ...data });

    if (result.success < 0) {
      message.error({
        content: result.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      let detail = {};
      if (result?.datas) {
        detail = result?.datas;
      }
      openNotification(detail);
    }
  };

  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_online_client_ips();
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
    console.log(value);
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

  const setInputKeyName = (_keyList: string[], _NameList: string[]) => {
    const modalNameList = {};
    (_keyList || []).forEach((key: string | number, index: string | number) => {
      modalNameList[key] = _NameList[index];
    });
    return modalNameList;
  };

  const handleOk: any = (id: any, type: string) => {
    let KeyNameList = '';
    console.log(id, type);

    for (const dataSource of useTableData.dataSource) {
      if (dataSource.key == id) {
        if (type == 'visit') {
          return onSearch(dataSource.client_ip_list);
        }
        KeyNameList = dataSource;
      }
    }
    setFormData({
      actionType: 'delete',
      actionFunc: (_values: any) => _add_forbidden_ip(_values),
      modalKeyList: KeyNameList,
      modalNameList: setInputKeyName(keyList, NameList),
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
            index == 0 ? `${dataSource.client_ip_list}` : `;${dataSource.client_ip_list}`;
        }
      }
    });
    const _values = {
      client_ip_list: selectedRowKeysList,
    };
    const result = await _add_forbidden_ip(_values);
    if (result.success < 0) {
      message.error({
        content: result.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      message.success({
        content: '查询成功',
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
            <Space>
              {/* <Search
                placeholder="输入需要单一搜索的IP"
                onSearch={() => enterLoading(!loadings)}
                enterButton
              /> */}
              {/* <Button
                key="button"
                type="primary"
                icon={<PoweroffOutlined />}
                // loading={result.loading}
                onClick={() => enterLoading(!loadings)}
              >
                查询
              </Button> */}
              <Tooltip
                placement="topLeft"
                title={`在线IP数 : ${useTableData.total || 0}`}
                arrowPointAtCenter
              >
                <Button>在线数IP数 : {useTableData.total || 0}</Button>
              </Tooltip>
            </Space>
          </Col>

          <Col flex="0 1 300px" style={{ textAlign: 'right' }}>
            {/* <Space>
              <Button
                onClick={() => {
                  setFormData({
                    actionType: 'add',
                    actionFunc: (_values: any) => _add_forbidden_ip(_values),
                    modalKeyList: getKeyNameList(keyList),
                    modalNameList: setInputKeyName(keyList, NameList),
                    loadings: loadings,
                  });
                }}
                type="primary"
                icon={<PlusCircleOutlined />}
              >
                新增
              </Button>

              <Button
                type="primary"
                onClick={() => setIsModalVisible(!isModalVisible)}
                icon={<PlusCircleOutlined />}
              >
                批量删除
              </Button>
              <Modal
                title="是否删除选中的所有IP数据"
                visible={isModalVisible}
                onOk={confirm}
                onCancel={cancel}
              ></Modal>
            </Space> */}
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
    <PageContainer title={_isIndex == false ? false : ''} style={{ overflow: 'hidden' }}>
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
            // footer={ tableData.summary}
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
