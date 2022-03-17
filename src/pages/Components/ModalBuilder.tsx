/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Modal, Button, Form, Input, message, AutoComplete } from 'antd';
import { useRequest } from 'umi';
const ModalBuilder = ({
  visibleValue,
  handleCancel,
  setData,
}: {
  visibleValue: boolean;
  handleCancel: any;
  setData: any;
}) => {
  const [errTip, setErrTip] = useState(''); // 排序类型
  const [helpDictTip, setHelpDictTip] = useState({} as any); // 排序类型
  const [modalkey, setModalkey] = useState(''); // 排序类型
  const [form] = Form.useForm();
  const {
    actionType,
    actionFunc,
    modalKeyList,
    loadings,
    primary = 'name',
    keyItems = {},
    tipItems = {},
    autocomplete_key = {},
    modalNameList = {},
  } = setData;

  const getAutoCompleteKey = (key: any) => {
    const options = [];
    if (autocomplete_key[key]) {
      for (const name in autocomplete_key[key]) {
        options.push({ value: name, key: name });
      }
    }
    return options;
  };

  const showMsg = (msg: { success: number; err_msg: any }) => {
    if (msg.success < 0) {
      message.error({
        content: msg.err_msg,
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
      setModalkey(Math.random().toString(32).slice(2));
      setErrTip('');
      handleCancel(true);
    }
  };

  const onFinish = async (values: any) => {
    const msg = await actionFunc(values);
    showMsg(msg);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancelModal = () => {
    handleCancel();
    setModalkey(Math.random().toString(32).slice(2));
    setErrTip('');
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const FormlistFun = () => {
    const _Formlist = [];
    if (modalKeyList) {
      let disabled = false;
      if (actionType == 'update' && modalKeyList[primary]) {
        modalKeyList['ori' + primary] = modalKeyList[primary];
        modalNameList['ori' + primary] = '原始主键';
      }
      for (const key in modalKeyList) {
        // 判断是更新还是新增还是编辑
        const config: any = {
          label: modalNameList[key] ? modalNameList[key] : key,
          key: key,
          name: key,
          initialValue: modalKeyList[key],
        };
        switch (actionType) {
          case 'update':
            disabled = key === 'id' || key === 'ori' + primary;
            config.rules = [{ required: true, message: `Please input your ${key}` }];
            break;
          case 'delete':
            disabled = true;
            break;
          case 'add':
            disabled = false;
            config.rules = [{ required: true, message: `Please input your ${key}` }];
            break;
          default:
            break;
        }
        switch (key) {
          // case 'value':
          //   break;
          case 'datetime':
            break;
          case 'actions':
            break;
          case 'key':
            break;
          case 'keyDetails':
            break;
          case 'redisHost':
            break;
          case 'key1':
            // config.validateStatus = 'erraor';
            config.help = (
              <span id={key} style={{ color: 'red' }}>
                {errTip || `参数值填写规则 => ${autocomplete_key[key] || '无可匹配规则'}`}
              </span>
            );
            _Formlist.push(
              <Form.Item {...config}>
                <AutoComplete
                  disabled={disabled}
                  onChange={(_value) => {
                    const info = autocomplete_key[key] || {};
                    setErrTip(`key = ${_value} 参数值 : ${info[_value] || '无可匹配规则'}`);
                  }}
                  placeholder={tipItems[key] || '请输入要求的key值'}
                  options={getAutoCompleteKey(key)}
                  filterOption={(inputValue, option) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  <Input />
                </AutoComplete>
              </Form.Item>,
            );
            break;
          default:
            let item = undefined;
            switch (keyItems[key]) {
              case 'textarea':
                item = (
                  <Form.Item {...config}>
                    <Input.TextArea showCount />
                  </Form.Item>
                );
                break;
              default:
                config.help = (
                  <span id={key} style={{ color: 'red' }}>
                    {helpDictTip[key]}
                  </span>
                );
                item = (
                  <Form.Item {...config}>
                    <AutoComplete
                      disabled={disabled}
                      onChange={(_value) => {
                        const info = autocomplete_key[key] || {};
                        const ok = { key: info };
                        setHelpDictTip((preDict: any) => {
                          return { ...preDict, ...ok };
                        });
                      }}
                      placeholder={tipItems[key] || '请输入要求的key值'}
                      options={getAutoCompleteKey(key)}
                      filterOption={(inputValue, option) =>
                        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    >
                      <Input />
                    </AutoComplete>
                  </Form.Item>
                );
                break;
            }
            _Formlist.push(item);
            break;
        }
      }
      return _Formlist;
    }
    return [];
  };
  return (
    <>
      <Modal
        key={modalkey}
        width={1000}
        visible={visibleValue}
        title={actionType == 'add' ? '新增' : actionType == 'delete' ? '删除' : '更新'}
        onCancel={handleCancelModal}
        destroyOnClose={true}
        mask={true}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            关闭
          </Button>,

          <Button
            key="submit"
            loading={loadings}
            type="primary"
            onClick={() => {
              handleOk();
            }}
            htmlType="submit"
          >
            确认
          </Button>,
        ]}
      >
        <Form
          style={{ paddingLeft: 50 }}
          form={form}
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          preserve={false}
        >
          {FormlistFun}
        </Form>
      </Modal>
    </>
  );
};

export default ModalBuilder;
