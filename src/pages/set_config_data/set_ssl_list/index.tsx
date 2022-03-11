import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, message, Modal, Pagination, Row, Space, Table } from 'antd';
import {
  get_ssl_list,
  add_ssl_client,
  del_ssl_client,
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
  const keyList = ['name', 'host', 'pem', "pem_key", 'actions'];
  const NameList = ['名字', 'Host', 'pem', "pem_key", '操作'];
  const keyItems = {pem: "textarea", pem_key: "textarea"};
  const defaultValue = {
    port: 80,
    fail: 2,
    fail_timeout: 180,
    weight: 100,
  };
  const values = {
    page: page,
    pagecount: pagecount,
  };

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
    console.log(datas)
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    datas.forEach((element: any, index: any) => {
      console.log(element, 22);
      for (const name in element) {
        const ssl_data = JSON.parse(element[name]);
        idIndex += 1;
        dataSource.push({
          key: idIndex,
          name: ssl_data.name || '',
          host: ssl_data.host || '',
          pem: (ssl_data.pem || '').substr(0, 100),
          pem_key: (ssl_data.pem_key || '').substr(0, 100),
          pem_ori: (ssl_data.pem || ''),
          pem_key_ori: (ssl_data.pem_key || ''),
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
  const _get_ssl_list = async () => {
    const value = await get_ssl_list({ ...values });
    setTableData(value);
    return value;
  };

  // 删除
  const _del_ssl_client = async (_values: any) => {
    const value = await del_ssl_client({ ..._values });
    console.log(value, '_del_ssl_client');
    return value;
  };

  // 新增
  const _add_ssl_client = async (_values: any) => {
    const value = await add_ssl_client({ ..._values });
    console.log(value, '_add_ssl_client');
    return value;
  };

  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_ssl_list();
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

  const setInputKeyName = (_keyList: string[], _NameList: string[]) => {
    const modalNameList = {};
    (_keyList || []).forEach((key: string | number, index: string | number) => {
      modalNameList[key] = _NameList[index];
    });
    return modalNameList;
  };

  const handleOk: any = (id: any, type: string) => {
    let KeyNameList;
    console.log(type, 99);
    const actionFuncType: any = {
      update: _add_ssl_client,
      delete: _del_ssl_client,
    };
    console.log(id, type, useTableData.dataSource, 'useTableData.dataSource');
    for (const dataSource of useTableData.dataSource) {
      if (dataSource.key == id) {
        KeyNameList = {
          name: dataSource.name,
          host: dataSource.host,
          pem: dataSource.pem_ori,
          pem_key: dataSource.pem_key_ori,
        };
      }
    }
    setFormData({
      actionType: type,
      actionFunc: (_values: any) => actionFuncType[type](_values),
      keyItems: keyItems,
      modalKeyList: KeyNameList,
      modalNameList: setInputKeyName(keyList, NameList),
      loadings: loadings,
    });
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
                  setFormData({
                    actionType: 'add',
                    actionFunc: (_values: any) => _add_ssl_client(_values),
                    keyItems: keyItems,
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
