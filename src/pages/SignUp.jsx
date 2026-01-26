import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, registerSuccess } from "../action/actions";
import Header from "../components/shared/Header.jsx";
import "./SignUp.css";
import { v4 as uuidv4 } from "uuid";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const [form] = Form.useForm();
  const { Text } = Typography;

  const onFinish = (values) => {
    // Kiểm tra username đã tồn tại chưa
    const existingUser = accounts.find(
      (u) => u.username === values.username
    );

    if (existingUser) {
      message.error("Tên đăng nhập đã tồn tại!");
      return;
    }

    // Tạo user mới (giả lập)
    const newUser = {
      id: uuidv4(),
      name: values.name,
      username: values.username,
      gmail: values.email,
      Password: values.password,
      avatar: "https://i.pravatar.cc/150?img=" + (accounts.length + 1), // Avatar mặc định
    };

    dispatch(registerSuccess(newUser))

    // Tự động đăng nhập
    const myInfo = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      gmail: newUser.gmail,
      avatar: newUser.avatar,
    };

    dispatch(loginSuccess(myInfo));

    message.success(`Đăng ký thành công! Xin chào ${newUser.name}`);

    // Chuyển đến trang conversations
    navigate("/conversations");
  };

  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="signup-form"
        >
          <h2 className="signup-title">Đăng ký tài khoản</h2>

          <Form.Item
            name="name"
            label="Tên đầy đủ"
            rules={[
              { required: true, message: "Vui lòng nhập tên đầy đủ!" }
            ]}
          >
            <Input placeholder="Nhập tên đầy đủ" />
          </Form.Item>

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
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>

          <Text 
            underline 
            className="login-text"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Đã có tài khoản? Nhấn vào đây để đăng nhập
          </Text>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;