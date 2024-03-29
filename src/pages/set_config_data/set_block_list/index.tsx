import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, message, Modal, Pagination, Row, Space, Table } from 'antd';
import { get_block_list, add_block_client, del_block_client } from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import { PlusCircleOutlined } from '@ant-design/icons';
import ModalBuilder from '@/pages/Components/ModalBuilder';

const Index = () => {
  const [page, setPage] = useState(1); // 排序类型
  const [pagecount, setPagecount] = useState(10); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);
  const [visibleValue, setVisibleValue] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);

  const [formValue, setFormValue] = useState({} as any);
  const keyList = ['server_id', 'name', 'actions'];
  const NameList = ['服务id', '名称', '操作'];
  const values = {
    page: page,
    pagecount: pagecount,
  };

  const setTableData = (value: any) => {
    //创建表格
    const datas = value?.lists || [];
    const columns = [];
    const dataSource: any = [];
    for (let i = 0; i < keyList.length; i += 1) {
      if (keyList[i] != 'oriname')
        columns.push({
          title: NameList[i],
          width: 150,
          dataIndex: keyList[i],
          key: keyList[i],
          type: keyList[i],
          ellipsis: true,
          fixed: '',
        });
    }
    columns[columns.length - 1].fixed = 'right';
    columns[columns.length - 1].width = 180;
    datas.forEach((element: any, index: any) => {
      console.log(element, 22);
      const isMap = JSON.parse(element);
      dataSource.push({
        key: index,
        server_id: isMap.server_id || '',
        name: isMap.name || '',
        oriname: isMap.name || '',
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
  const _get_block_list = async () => {
    const value = await get_block_list({ ...values });
    if (value.success > 0) {
      setTableData(value);
    }
    // setLoadings(!loadings);
    return value;
  };

  // 删除
  const _del_block_client = async (_values: any) => {
    const value = await del_block_client({ ..._values });
    console.log(value, '_del_block_client');
    return value;
  };

  // 新增
  const _add_block_client = async (_values: any) => {
    const value = await add_block_client({ ..._values });
    console.log(value, '_add_block_client');
    return value;
  };

  useEffect(() => {
    if (!loadings) {
      setLoadings(true);
      _get_block_list();
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
      update: _add_block_client,
      delete: _del_block_client,
    };
    console.log(id, type);
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
    const result = await _del_block_client(_values);
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
                    actionFunc: (_values: any) => _add_block_client(_values),
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
            // rowSelection={rowSelection}
            columns={ColumnsBuilder(useTableData?.columns, handleOk)}
            dataSource={useTableData?.dataSource}
            scroll={{ y: 600 }}
            pagination={false}
            loading={loadings}
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
