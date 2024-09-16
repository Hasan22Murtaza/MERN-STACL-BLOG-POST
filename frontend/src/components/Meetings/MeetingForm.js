import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { api } from "../../api/apiService";
import { toast } from "react-toastify";
const MeetingForm = ({ meetings, setMeetings }) => {
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    scheduled_at: yup.string().required("Email is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post("meetings", data);
      setMeetings([response.data.meeting, ...meetings]);
      reset();
      toast.success("Meeting is created successfully");
      setIsLoading(false);
    } catch (error) {
      console.error("Login failed:", error.data.msg);
      setIsLoading(false);
    }
  };
  return (
    <div className="col-md-12">
      <h2>Schedule New Meeting</h2>
      <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="First Name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("first_name")}
                />
                {errors.first_name && (
                  <div className="invalid-feedback">{errors.first_name.message}</div>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Last name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("last_name")}
                />
                {errors.last_name && (
                  <div className="invalid-feedback">{errors.last_name.message}</div>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>
            </div>
            <div className="col-md-3">
            
            <div className="mb-3">
              <label htmlFor="scheduled_at" className="form-label">
                Date and Time:
              </label>
              <input
                type="datetime-local"
                id="scheduled_at"
                className="form-control"
                {...register("scheduled_at")}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !isValid}
        >
          Create Meeting
        </button>
      </form>
    </div>
  );
};

export default MeetingForm;
