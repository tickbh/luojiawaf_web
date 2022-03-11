import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Pagination, Row, Table } from 'antd';
import { get_client_detail } from '@/services/ant-design-pro/api';
import ColumnsBuilder from '@/pages/Components/ColumnsBuilder';

const Index = () => {
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
        ms: `${Math.round(datas[o][1])}s`,
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
    const value = await get_client_detail({ ...values });
    if (value.success > 0) {
      setTableData(value);
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
          {/* {beforeTableLayout()} */}
          <Table
            // className={Style.carMarginTop}
            columns={ColumnsBuilder(useTableData?.columns)}
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
