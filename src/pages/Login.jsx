import { useEffect, useState } from "react";
import { AccessTokenCookie } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../utils/api";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = async () => {
    setLoading(true);
    try {
      const data = form.getFieldsValue();
      console.log("data: ", data);
      // Simulate API call
      const res = await api.post("/o/token/", {
        grant_type: "password",
        username: data.username.trim(),
        password: data.password.trim(),
        client_id: "cpcWRvOnPvIPffynngx9iseE9EaFFsGQcbUb8lSL",
        client_secret:
          "mF260S3Ox0q3nSxbQfRCK8GphMBHxSA4YQFjG1zqCUq07umDbf36SkLR9SVXunIcwfUUfVg3G45sMm6AuFv5eTGbCBDMs0rAEVGUEGOIwsZIm0xdtMt3VxPEaKvLwlrk",
      });
      AccessTokenCookie.set(res.access_token);
      navigate('/')
    } catch (error) {
      message.error(api.setError(error));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = AccessTokenCookie.get();
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return (
    <div className=" flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username!" }]}
            >
              <Input
                prefix={<FaUser className="text-gray-400" />}
                autoComplete="off"
                placeholder="Username của bạn"
                size="large"
                className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                autoComplete="off"
                prefix={<FaLock className="text-gray-400" />}
                placeholder="Mật khẩu"
                size="large"
                className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
                iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
              />
            </Form.Item>
            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
