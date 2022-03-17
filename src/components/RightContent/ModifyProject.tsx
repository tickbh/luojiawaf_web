/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { modify_project_name, set_project_name } from '@/services/ant-design-pro/api';
import { Modal, Button, Form, Input, message } from 'antd';
const ModalBuilder = ({
  visibleValue,
  handleCancel,
}: {
  visibleValue: boolean;
  handleCancel: any;
}) => {
  const [modalkey, setModalkey] = useState(''); // 排序类型
  const [form] = Form.useForm();

  const showMsg = (msg: { success: number; err_msg: any; project_name: any }) => {
    if (msg.success < 0) {
      message.error({
        content: msg.err_msg,
        style: {
          fontSize: 16,
        },
      });
    } else {
      set_project_name(msg.project_name);
      message.success({
        content: '处理成功',
        style: {
          fontSize: 16,
        },
      });
    }
  };

  const onFinish = async (values: any) => {
    const msg = await modify_project_name(values);
    showMsg(msg);
    handleCancel();
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancelModal = () => {
    handleCancel();
  };

  return (
    <>
      <Modal
        key={modalkey}
        width={400}
        visible={visibleValue}
        title={'修改项目名称'}
        onCancel={handleCancelModal}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            关闭
          </Button>,

          <Button
            key="submit"
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
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="项目名称"
            name="project_name"
            rules={[
              {
                required: true,
                message: '请输入项目名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalBuilder;
