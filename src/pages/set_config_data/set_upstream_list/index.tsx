import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, message, Modal, Pagination, Row, Space, Table } from 'antd';
import {
  get_upstream_list,
  add_upstream_client,
  del_upstream_client,
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
  const keyList = ['name', 'ip', 'host', 'port', 'fail', 'fail_timeout', 'weight', 'actions'];
  const NameList = ['名字', 'IP', 'Host', '端口', '失败次数', '超时', '权重', '操作'];
  const defaultValue = {
    port: 80,
    fail: 2,
    fail_timeout: 180,
    weight: 100,
  };
  const { Search } = Input;
  const values = {
    page: page,
    pagecount: pagecount,
  };

  function getSub(obj: string) {
    const index = obj.indexOf(':');
    // eslint-disable-next-line no-param-reassign
    obj = obj.substring(index + 1, obj.length);
    return obj;
  }

  const setTableData = (value: any) => {
    //创建表格
    const datas = value?.values || [];
    const columns = [];
    const dataSource: any = [];
    for (let i = 0; i < keyList.length; i += 1) {
      columns.push({
        title: NameList[i],
        width: 180,
        dataIndex: keyList[i],
        key: keyList[i],
        type: keyList[i],
        // ellipsis: true,
        fixed: '',
        // "sorter": true,
      });
    }
    columns[columns.length - 1].fixed = 'right';
    columns[columns.length - 1].width = 180;
    let idIndex = 0;
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    datas.forEach((element: any, index: any) => {
      console.log(element, 22);
      for (const name in element) {
        const data = JSON.parse(element[name]);
        idIndex += 1;
        dataSource.push({
          key: idIndex,
          ip: data.ip || '',
          port: data.port || '80',
          fail: data.fail || '',
          fail_timeout: data.fail_timeout || '',
          weight: data.weight || '',
          host: data.host || '',
          name: data.name || '',
          actions: [
            {
              component: 'button',
              type: 'primary',
              text: '编辑',
              key: idIndex + 1,
              id: idIndex,
              custom: 'update',
            },
            {
              component: 'button',
              type: 'primary',
              text: '删除',
              key: idIndex,
              id: idIndex,
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
  const _get_upstream_list = async () => {
    const value = await get_upstream_list({ ...values });
    setTableData(value);
    return value;
  };

  // 删除
  const _del_upstream_client = async (_values: any) => {
    const value = await del_upstream_client({ ..._values });
    console.log(value, '_del_upstream_client');
    return value;
  };

  // 新增
  const _add_upstream_client = async (_values: any) => {
    const value = await add_upstream_client({ ..._values });
    console.log(value, '_add_upstream_client');
    return value;
  };

  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_upstream_list();
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
        keyNameLis[key] = defaultValue[key] || '';
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
    console.log(type, 99);
    const actionFuncType: any = {
      update: _add_upstream_client,
      delete: _del_upstream_client,
    };
    console.log(id, type, useTableData.dataSource, 'useTableData.dataSource');
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
      loadings: loadings,
    });
  };

  async function confirm(e: any) {
    //批量删除数据
    console.log(e);
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    let selectedRowKeysList = '';
    (selectedRowKeys || []).forEach((key: any, index: any) => {
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
    const result = await _del_upstream_client(_values);
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
                    actionFunc: (_values: any) => _add_upstream_client(_values),
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
            rowSelection={rowSelection}
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
