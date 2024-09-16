import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { api } from "../../../api/apiService";
import { toast } from "react-toastify";

const Login = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await api.post("auth/login", data);
      localStorage.setItem('token', response.data.token);
      toast.success("Login successfully");
      navigate("/user/posts");
      setIsLoading(false);
    } catch (error) {
      toast.error(error.data.message);
      console.error("Login failed:", error.data.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex justify-content-center py-4">
            <Link
              to="/"
              className="logo d-flex align-items-center w-auto"
            >
              {/* <img src="assets/img/logo.png" alt=""> */}
              <span className="d-none d-lg-block">Admin</span>
            </Link>
          </div>
          {/* End Logo */}
          <div className="card mb-3">
            <div className="card-body">
              <p />

              <div className="pt-4 pb-2">
                <h5 className="card-title text-center pb-0 fs-4">
                  Login to Your Account
                </h5>
                <p className="text-center small">
                  Enter your email &amp; password to login
                </p>
              </div>
              <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={isLoading || !isValid}
                  >
                    Login
                  </button>
                </div>
              </form>
                <div className="col-12">
                  <p className="small mb-0">
                    Forget Password?{" "}
                    <Link to="/auth/forget-password" className="">
                      {" "}
                      Forget Password{" "}
                    </Link>
                  </p>
                  <p className="small mb-0">
                    Don't have account?{" "}
                    <Link to="/auth/register" className="">
                      {" "}
                      Create an account{" "}
                    </Link>
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
