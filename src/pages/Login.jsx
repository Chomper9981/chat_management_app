import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../action/actions";
import Header from "../components/shared/Header.jsx";
import "./Login.css";
import {Accounts} from "../mocks/mockAccounts.js"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // Tìm user trong data
    const user = Accounts.find(
      (u) => u.username === values.username && u.Password === values.password
    );

    if (user) {
      // Tạo object myInfo (không lưu password)
      const myInfo = {
        id: user.id,
        name: user.name,
        username: user.username,
        gmail: user.gmail,
        avatar: user.avatar,
      };

      // Dispatch action để lưu vào Redux
      dispatch(loginSuccess(myInfo));

      // Hiển thị thông báo thành công
      message.success(`Đăng nhập thành công! Xin chào ${user.name}`);

      // Chuyển hướng đến trang conversations
      navigate("/conversations");
    } else {
      // Hiển thị thông báo lỗi
      message.error("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="login-form"
        >
          <h2 className="login-title">Đăng nhập</h2>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" }
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-demo-accounts">
            <p>Tài khoản demo:</p>
            <ul>
              <li>aaa / 123</li>
              <li>bbb / 123</li>
              <li>ccc / 123</li>
              <li>ddd / 123</li>
            </ul>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;