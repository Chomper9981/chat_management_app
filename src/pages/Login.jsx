import React from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Data = {
  users: [
    {
      id: 1,
      name: "Alice",
      Password: "123456",
      username: "alice",
      gmail: "alice@example.com",
    },
    {
      id: 2,
      name: "Bob",
      Password: "abcdef",
      username: "bob",
      gmail: "bob@example.com",
    },
    {
      id: 3,
      name: "Charlie",
      Password: "ghijkl",
      username: "charlie",
      gmail: "charlie@example.com",
    },
  ],
};

const Login = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    const user = Data.users.find(
      (u) => u.username === values.username && u.Password === values.password
    );
    if (user) {
      window.alert("Đăng nhập thành công!", user);
      navigate("/conversations");
    } else {
      window.alert("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
    console.log("Form data:", values);
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ width: 300 }}
    >
      <Form.Item
        name="username"
        label="Tên đăng nhập"
        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
