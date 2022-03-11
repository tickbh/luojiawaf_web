import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
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
  Select,
  Space,
  Table,
} from 'antd';
import {
  get_client_ip_visit,
  add_block_client,
  del_block_client,
  get_block_list,
  get_client_random_visits,
} from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import ModalBuilder from '@/pages/Components/ModalBuilder';
import { PoweroffOutlined } from '@ant-design/icons';

const Index = () => {
  const [sort, setSort] = useState('name'); // 排序升降
  const [order, setOrder] = useState('asc'); // 排序类型
  const [page, setPage] = useState(1); // 页数
  const [pagecount, setPagecount] = useState(10); // 页条数
  const [blockname, setBlockname] = useState(''); // 排序类型
  // const [defaultName, setDefaultName] = useState(''); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);
  const [visibleValue, setVisibleValue] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [blockNameList, setBlockNameList] = useState([] as any);
  const [formValue, setFormValue] = useState({} as any);
  const keyList = ['request', 'host', 'datetime', 'actions'];
  const NameList = ['请求类型', '地址', '时间戳', '参数详情'];
  const { Search } = Input;
  const { Option } = Select;
  const { query = {} } = history.location;
  const values = {
    page: page,
    pagecount: pagecount,
    name: query.name || blockname,
    ip: query.ip || searchValue,
  };
  function getLastString(obj: string) {
    const index = obj.lastIndexOf(':');
    // eslint-disable-next-line no-param-reassign
    obj = obj.substring(index + 1, obj.length);
    return obj;
  }
  function getFirstString(obj: string) {
    const index = obj.indexOf('\r\nG');
    // eslint-disable-next-line no-param-reassign
    obj = obj.substring(index + 1, obj.length);
    return obj;
  }
  const setTableData = (value: any) => {
    //创建表格
    const datas = value?.datas || [];
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
      const isList = element;
      const isListSpilt = isList.split(' ');
      const requestType = isListSpilt[0].split('\r\n');
      const host = requestType[0].split(':') || [];
      const datetime = getLastString(requestType[0]);
      const details = getFirstString(isList);
      dataSource.push({
        key: index,
        request: requestType[1] || '',
        host: `${host[0]}:${host[1]}`,
        detailAciton: details.substring(0, 20) + '...' || '',
        details: details || '',
        datetime,
        openUrl: element,
        actions: [
          {
            component: 'button',
            type: 'primary',
            text: `${details.substring(0, 30)}`,
            key: index,
            id: index,
            custom: 'detailModal',
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
  const _getBlockName = async () => {
    const result = await get_block_list({ ...values });
    const nameList: any[] = [];
    if (result.success < 0) {
      return message.error({
        content: result.err_msg,
        style: {
          fontSize: 16,
        },
      });
    }
    (result['lists'] || []).forEach((element: string, index: number) => {
      const { name } = JSON.parse(element);
      if (index == 0) {
        values.name = name;
        setBlockname(name);
        // console.log(values, 8888);
      }
      if (name) {
        nameList.push(
          <Option value={name} key={index}>
            {name}
          </Option>,
        );
      }
    });
    setBlockNameList(nameList);
    // _get_client_ip_visit();
  };

  // 当页数和展示数量发生改变时,重新发起请求
  const _get_client_ip_visit = async () => {
    if (blockNameList.length == 0) {
      await _getBlockName();
    }
    const value =
      searchValue || query.ip
        ? await get_client_ip_visit({ ...values })
        : await get_client_random_visits({ ...values });
    if (value.success > 0) {
      setTableData(value);
    }
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
      _get_client_ip_visit();
    }
    setLoadings(false);
  }, [page, pagecount, loadings]);

  const handleCancel = (isLoading: boolean) => {
    if (isLoading === true) {
      setLoadings(!loadings);
    }
    setVisibleValue(false);
  };

  const openNotification = (result: any) => {
    const description = result;
    console.log(result, 'result');
    notification.open({
      message: '信息详情',
      description,
      className: 'custom-class',
      style: {
        width: 600,
      },
    });
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

  const onSearch = (value: any) => {
    console.log(value);
    setSearchValue(value);
    enterLoading(!loadings);
  };

  const selectOnchange = (value: any) => {
    setBlockname(value);
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

  const OpenUrl: any = (id: any, type: string) => {
    for (const dataSource of useTableData.dataSource) {
      if (dataSource.key == id) {
        openNotification(dataSource.details);
        // console.log(dataSource, 999, id);
        // const base64Url = btoa(dataSource.openUrl);
        // console.log(base64Url, 1233);
        // window.open(`https://tool.fit/http?raw=${base64Url}`);
      }
    }
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
              <Select
                // defaultValue={defaultName}
                // key={defaultName}
                value={blockname}
                placeholder="请输入高防名称"
                style={{ width: 120 }}
                onChange={selectOnchange}
              >
                {blockNameList}
              </Select>
              <Search
                placeholder={'未输入IP则随机访问'}
                defaultValue={query['ip'] || ''}
                onSearch={onSearch}
                enterButton
              />

              {/* <Button
                key="button"
                type="primary"
                icon={<PoweroffOutlined />}
                // loading={result.loading}
                onClick={() => enterLoading(!loadings)}
              >
                查询
              </Button> */}
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
            columns={ColumnsBuilder(useTableData?.columns, OpenUrl)}
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
