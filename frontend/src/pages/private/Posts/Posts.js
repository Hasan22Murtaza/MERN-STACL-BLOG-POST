import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { api } from "../../../api/apiService";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

const Posts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("posts");
      console.log("res", response);
      setPosts(response.data);
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

  const openModal = () => {
    reset();
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (selectedPost) {
        await api.put(`posts/${selectedPost._id}`, data);
        setPosts(
          posts.map((post) =>
            post._id === selectedPost._id ? { ...post, ...data } : post
          )
        );
        toast.success("Post updated successfully");
      } else {
        const response = await api.post("posts", data);
        setPosts([response.data, ...posts]);
        toast.success("Post added successfully");
      }
      reset();
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (post) => {
    setValue("title", post.title);
    setValue("content", post.content);
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      setIsLoading(true);
      try {
        
        await api.delete(`posts/${postId}`);
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Posts</h1>
      </div>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="col-12">
                  <h5 className="card-title" />
                  <Button className="btn btn-primary" onClick={openModal}>
                    Create Post
                  </Button>
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-md-8">
                        <h2>Posts List</h2>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Title</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {posts &&
                              posts.map((post, index) => {
                                return (
                                  <tr key={post?.id}>
                                    <td>{index + 1}</td>
                                    <td>{post?.title}</td>
                                    <td>
                                      <span
                                        title="Edit"
                                        className="text-primary me-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleEditUser(post)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </span>
                                      <span
                                        title="Delete"
                                        className="text-danger me-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleDeletePost(post._id)
                                        }
                                      >
                                        <i className="bi bi-trash"></i>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* React Bootstrap Modal */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPost ? "Edit Post" : "Add New Post"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                id="title"
                placeholder="Enter title"
                {...register("title")}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Desc
              </label>
              <input
                type="text"
                className={`form-control`}
                id="content"
                placeholder="Enter content"
                {...register("content")}
              />
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {selectedPost ? "Update" : "Save"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Posts;
