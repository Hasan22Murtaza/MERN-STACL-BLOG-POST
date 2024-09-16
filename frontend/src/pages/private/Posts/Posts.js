import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { api } from "../../../api/apiService";

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be valid"),
  password: yup.string().when("isEditMode", {
    is: false,
    then: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`users/${userId}`);
      setValue("username", response.data.username);
      setValue("email", response.data.email);
      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const updatedData = { ...data };

    if (updatedData.password === "") {
        delete updatedData.password;
    }
    try {
      await api.put(`users/${userId}`, updatedData);
      toast.success("User updated successfully");
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Profile</h1>
        {/* <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/user/meetings">Home</Link>
            </li>
            <li className="breadcrumb-item">Users</li>
          </ol>
        </nav> */}
      </div>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="col-12">
                  <h5 className="card-title" />

                  <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        id="username"
                        placeholder="Enter username"
                        {...register("username")}
                      />
                      {errors.username && (
                        <div className="invalid-feedback">
                          {errors.username.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        placeholder="Enter email"
                        disabled
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        placeholder="Enter password"
                        autoComplete="off"
                        {...register("password")}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      Save changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
