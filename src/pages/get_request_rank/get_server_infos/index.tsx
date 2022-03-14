import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import {
  get_server_infos,
  add_block_client,
  del_block_client,
  search_forbidden_ip,
  get_block_list,
} from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import ModalBuilder from '@/pages/Components/ModalBuilder';
import { PoweroffOutlined } from '@ant-design/icons';

const Index = () => {
  const [data, setData] = useState([] as any);
  const [netData, setNetData] = useState([] as any);

  const [sort, setSort] = useState('name'); // 排序升降
  const [order, setOrder] = useState('asc'); // 排序类型
  const [page, setPage] = useState(1); // 页数
  const [pagecount, setPagecount] = useState(10); // 页条数
  const [blockname, setBlockname] = useState(''); // 排序类型
  const [blockstatus, setBlockstatus] = useState('500'); // 排序类型
  const [yesterday, setYesterday] = useState(0); // 排序类型
  // const [defaultName, setDefaultName] = useState(''); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);
  const [visibleValue, setVisibleValue] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [blockNameList, setBlockNameList] = useState([] as any);
  const [formValue, setFormValue] = useState({} as any);
  const keyList = ['request', 'details', 'host', 'datetime', 'actions'];
  const NameList = ['请求类型', '信息详情', '地址', '时间戳', '模拟请求'];
  const { Search } = Input;
  const { Option } = Select;
  const values = {
    page: page,
    pagecount: pagecount,
    name: blockname,
    status: blockstatus,
    yesterday: yesterday == 0 ? false : 1,
  };

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
      console.log(element, 1111);
      const isList = element;
      let isListSpilt;
      if (isList[0]) {
        isListSpilt = isList[0].split(' ');
        // console.log(isListSpilt, 999);
      }
      dataSource.push({
        key: index,
        request: isListSpilt[0] || '',
        host: isListSpilt[3].split('\n')[0] || '',
        details: decodeURIComponent(isListSpilt[1]) || '',
        datetime: element[1] || '',
        openUrl: element[0],
        actions: [
          {
            component: 'button',
            type: 'primary',
            text: '模拟请求',
            key: index,
            id: index,
            custom: 'openUrl',
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
  };

  function get_date(timer: string) {
    const timestamp = Number(timer);
    const date = new Date(timestamp * 1000);
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  function get_network_speed(speed: string) {
    const timestamp = Number(speed);
    return Number((timestamp / 1024).toFixed(2));
  }

  // 当页数和展示数量发生改变时,重新发起请求
  const _get_server_list = async () => {
    if (blockNameList.length == 0) {
      await _getBlockName();
    }
    const value = await get_server_infos({ ...values });
    if (value.success > 0) {
      const fix_data = [];
      for (const idx in value.cpu_infos) {
        const cpu = value.cpu_infos[idx];
        const list = cpu.split('/');
        fix_data.push({
          timer: get_date(list[0]),
          value: list[1],
          category: 'Cpu占用率',
        });
      }

      for (const idx in value.mem_infos) {
        const info = value.mem_infos[idx];
        const list = info.split('/');

        fix_data.push({
          timer: get_date(list[0]),
          value: (Number(list[1]) / Number(list[2])).toFixed(2) + '%',
          category: '内存使用率',
        });
      }
      console.log(fix_data);
      setData(fix_data);

      const network_data = [];
      for (const idx in value.network_infos) {
        const info = value.network_infos[idx];
        const list = info.split('/');
        console.log('info == ', info, 'list = ', list);
        const timer = get_date(list[0]);
        network_data.push({
          timer: timer,
          value: get_network_speed(list[1]),
          category: '上行流量',
        });
        network_data.push({
          timer: timer,
          value: get_network_speed(list[2]),
          category: '下行流量',
        });
      }
      setNetData(network_data);
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
      _get_server_list();
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
        // console.log(dataSource, 999, id);
        const base64Url = btoa(dataSource.openUrl);
        console.log(base64Url, 1233);
        window.open(`https://tool.fit/http?raw=${base64Url}`);
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
              {/* <Search placeholder="input search text" onSearch={onSearch} enterButton /> */}
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

              <Button
                key="button"
                type="primary"
                icon={<PoweroffOutlined />}
                // loading={result.loading}
                onClick={() => enterLoading(!loadings)}
              >
                查询
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

  const netconfig = {
    data: netData,
    xField: 'timer',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        formatter: (v: string) => '' + Number(v).toFixed(2) + 'KB/s',
        // 数值格式化为千分位
        // formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  const config = {
    data,
    xField: 'timer',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        // 数值格式化为千分位
        // formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
  };

  return (
    <PageContainer style={{ overflow: 'hidden' }}>
      <React.Fragment>
        {/* <Card size="small" className={Style.paddingCard}>{beforesearchLayout()}</Card> */}
        <Card>
          <Card style={{ borderBottom: 0 }} size="small">
            {beforesearchLayout()}
          </Card>
          监控列表
          <Line {...netconfig} />
          <Line {...config} />
        </Card>
      </React.Fragment>
    </PageContainer>
  );
};

export default Index;
