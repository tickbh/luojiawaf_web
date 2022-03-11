import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Pagination, Row, Space, Table } from 'antd';
import { get_request_aver_rank, clear_request_aver_rank } from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';
import { PlusCircleOutlined } from '@ant-design/icons';

const Index = (_isIndex: boolean) => {
  const [sort, setSort] = useState('name'); // 排序升降
  const [order, setOrder] = useState('asc'); // 排序类型
  const [page, setPage] = useState(1); // 排序类型
  const [pagecount, setPagecount] = useState(10); // 排序类型
  const [useTableData, setUseTableData] = useState({} as any);

  const values = {
    page: page,
    pagecount: pagecount,
  };

  const setTableData = (value: any) => {
    const datas = value?.datas;
    const keyList = ['url', 'ms'];
    const NameList = ['url', '耗时'];
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
    for (let o = 0; o < datas.length; o += 1) {
      dataSource.push({
        key: o,
        url: datas[o][0],
        ms: `${Math.round(datas[o][1] * 1000)}ms`,
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
  const get_request_data = async () => {
    const value = await get_request_aver_rank({ ...values });
    if (value.success > 0) {
      setTableData(value);
    }
    return value;
  };

  const _clear_request_aver_rank = async () => {
    const value = await clear_request_aver_rank({ ...values });
    if (value.success < 0) {
      message.error({
        content: value.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      setTableData(value);
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
    get_request_data();
  }, [page, pagecount]);

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
                  _clear_request_aver_rank();
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
