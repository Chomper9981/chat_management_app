import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../action/actions";
import Header from "../components/shared/Header.jsx";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { Text } = Typography;
  const accounts = useSelector((state) => state.account.accounts);

  const onFinish = (values) => {
    const user = accounts.find(
      (u) => u.username === values.username && u.Password === values.password,
    );

    if (user) {
      const myInfo = {
        id: user.id,
        name: user.name,
        username: user.username,
        gmail: user.gmail,
        avatar: user.avatar,
      };

      dispatch(loginSuccess(myInfo));

      message.success(`Đăng nhập thành công! Xin chào ${user.name}`);

      navigate("/conversations");
    } else {
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
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>

          <Text
            underline
            className="register-text"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Chưa có tài khoản? Nhấn vào đây để đăng ký
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default Login;
