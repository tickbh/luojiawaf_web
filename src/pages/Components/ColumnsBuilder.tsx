import { Space, Tooltip } from 'antd';
import moment from 'moment';
import ActionBuilder from './ActionBuilder';

const ColumnsBuilder = (
  column: any[],
  handleOk: { (id: any, type: string): void; (): void; (): void; (id: any, type: string): void },
) => {
  if (column === undefined) {
    return [];
  }
  const newColumns: any[] = [];
  (column || []).forEach((columnValue: any | undefined) => {
    const { type } = columnValue;
    switch (type) {
      // case 'time': // 自定义时间格式
      //   columnValue.render = (value: any | undefined) => {
      //     return moment(parseInt(`${value}000`, 10)).format('YYYY-MM-DD HH:mm:ss');
      //   };
      //   break;
      case 'datetime': // 自定义时间格式
        columnValue.render = (value: any | undefined) => {
          return (
            <Tooltip
              placement="topLeft"
              title={moment(parseInt(value, 10) * 1000).format('YYYY-MM-DD HH:mm:ss')}
            >
              {moment(parseInt(value, 10) * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Tooltip>
          );
        };
        break;
      case 'actions': // 自定应添加button 后端传值最好
        columnValue.render = (value: any | undefined) => {
          return <Space>{ActionBuilder(value, handleOk)}</Space>;
        };
        break;
      //   case "tags": // 自定义字体样式
      //     columnValue.render = (value: any) => {
      //       return <Space>{TagsBuilder(value)}</Space>
      //     }
      //   break;

      default:
        columnValue.render = (value: any | undefined) => {
          return (
            <Tooltip placement="topLeft" title={value}>
              {value}
            </Tooltip>
          );
        };

        break;
    }
    newColumns.push(columnValue);
  });
  return newColumns;
};

export default ColumnsBuilder;
