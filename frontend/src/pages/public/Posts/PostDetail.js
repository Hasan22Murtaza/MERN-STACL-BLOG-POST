import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/apiService";
import moment from "moment";

const PostDetail = () => {
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { postId } = useParams();
  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`public/post/${postId}`);
      setPost(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="container">
        <header className="border-bottom lh-1 py-3">
          <div className="row flex-nowrap justify-content-between align-items-center">
            <div className="col-4 pt-1">
              <a className="link-secondary" href="#">
                Logo
              </a>
            </div>
            <div className="col-4 d-flex justify-content-end align-items-center">
              <a className="link-secondary" href="#" aria-label="Search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="mx-3"
                  role="img"
                  viewBox="0 0 24 24"
                >
                  <title>Search</title>
                  <circle cx="10.5" cy="10.5" r="7.5" />
                  <path d="M21 21l-5.2-5.2" />
                </svg>
              </a>
              <Link
                className="btn btn-sm btn-outline-secondary"
                to="/auth/login"
              >
                Login
              </Link>
            </div>
          </div>
        </header>
      </div>
      <main className="container" style={{ marginTop: "25px" }}>
        <div className="row g-5">
          <div className="col-md-8">
            <article className="blog-post">
              <h2 className="display-5 link-body-emphasis mb-1">
                {post?.title}
              </h2>
              <p className="blog-post-meta">
                {moment(post?.createdAt).format("MMMM Do YYYY")}
              </p>
              <p
                dangerouslySetInnerHTML={{
                  __html: post?.content,
                }}
              />
            </article>

            <nav className="blog-pagination" aria-label="Pagination">
              <a className="btn btn-outline-primary rounded-pill" href="#">
                Older
              </a>
              <a
                className="btn btn-outline-secondary rounded-pill disabled"
                aria-disabled="true"
              >
                Newer
              </a>
            </nav>
          </div>
          <div className="col-md-4">
            <div className="position-sticky" style={{ top: "2rem" }}>
              <div>
                <h4 className="fst-italic">Recent posts</h4>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                      href="#"
                    >
                      <svg
                        className="bd-placeholder-img"
                        width="100%"
                        height={96}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                      >
                        <rect width="100%" height="100%" fill="#777" />
                      </svg>
                      <div className="col-lg-8">
                        <h6 className="mb-0">Example blog post title</h6>
                        <small className="text-body-secondary">
                          January 15, 2024
                        </small>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                      href="#"
                    >
                      <svg
                        className="bd-placeholder-img"
                        width="100%"
                        height={96}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                      >
                        <rect width="100%" height="100%" fill="#777" />
                      </svg>
                      <div className="col-lg-8">
                        <h6 className="mb-0">
                          This is another blog post title
                        </h6>
                        <small className="text-body-secondary">
                          January 14, 2024
                        </small>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                      href="#"
                    >
                      <svg
                        className="bd-placeholder-img"
                        width="100%"
                        height={96}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                      >
                        <rect width="100%" height="100%" fill="#777" />
                      </svg>
                      <div className="col-lg-8">
                        <h6 className="mb-0">
                          Longer blog post title: This one has multiple lines!
                        </h6>
                        <small className="text-body-secondary">
                          January 13, 2024
                        </small>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-5 text-center text-body-secondary bg-body-tertiary">
        <p>
          Blog template built for{" "}
          <a href="https://getbootstrap.com/">Bootstrap</a> by{" "}
          <a href="https://twitter.com/mdo">@mdo</a>.
        </p>
        <p className="mb-0">
          <a href="#">Back to top</a>
        </p>
      </footer>
    </>
  );
};

export default PostDetail;
