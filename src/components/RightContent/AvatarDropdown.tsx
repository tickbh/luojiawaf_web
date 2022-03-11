import React, { useState, useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal, Button, Form, Input, message } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin, modify_password } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }else if (key === 'password') {
        setIsModalVisible(true)
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const handleOk = () => {
    form.submit()
    // setIsModalVisible(false);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    try {
      const msg = await modify_password(values);
      console.log('Success:', msg);
      message.info('更改密码成功,请重新登陆');
      countDown()
      setIsModalVisible(false);
    } catch (error) {
      
    }
  };

  function countDown() {
    let secondsToGo = 2;
    const modal = Modal.success({
      title: '密码修改成功',
      content: `即将为您自动跳转到登陆页:${secondsToGo}s.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: `即将为您自动跳转到登陆页:${secondsToGo}s.`,
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
      window.location.href = '/user/login'
    }, secondsToGo * 1000);
  }
  

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="password">
        <SettingOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Modal title="修改密码" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
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
      ]}>
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
        label="旧密码"
        name="old_password"
        rules={[
          {
            required: true,
            message: 'Please input your old_password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="新密码"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>


    </Form>
      </Modal>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src="/logo.png" alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
