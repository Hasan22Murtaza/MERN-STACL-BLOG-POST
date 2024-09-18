import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api/apiService";
import moment from 'moment';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("public/posts");
      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
      setIsLoading(false);
    }
  };

  const truncateContent = (content, limit = 400) => {
    if (!content) return "";
    return content.length > limit ? content.substring(0, limit) + "..." : content;
  };

  // Separate featured post (first post) from the rest
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

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
              <Link className="btn btn-sm btn-outline-secondary" to="/auth/login">
                Login
              </Link>
            </div>
          </div>
        </header>
        <div className="nav-scroller py-1 mb-3 border-bottom">
          <nav className="nav nav-underline justify-content-between">
            <a className="nav-item nav-link link-body-emphasis active" href="#">
              World
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              U.S.
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Technology
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Design
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Culture
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Business
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Politics
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Opinion
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Science
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Health
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Style
            </a>
            <a className="nav-item nav-link link-body-emphasis" href="#">
              Travel
            </a>
          </nav>
        </div>
      </div>
      <main className="container">
        {/* Featured Post */}
        {featuredPost && (
          <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
            <div className="col-lg-6 px-0">
              <h1 className="display-4 fst-italic">{featuredPost.title}</h1>
              <p className="lead my-3">{truncateContent(featuredPost.content, 400)}</p>
              <p className="lead mb-0">
                <Link to={`/post/${featuredPost._id}`} className="text-body-emphasis fw-bold">
                  Continue reading...
                </Link>
              </p>
            </div>
          </div>
        )}
        {/* Remaining Posts */}
        <div className="row mb-2">
          {remainingPosts.map((post, index) => {
            const hasContent = post.content && post.content.trim().length >= 400;
            const truncatedContent = truncateContent(post.content);

            return (
              <div className="col-md-6" key={index + 1}>
                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                  <div className="col p-4 d-flex flex-column position-static">
                    <h3 className="mb-0">{post?.title}</h3>
                    <div className="mb-1 text-body-secondary">{moment(post.createdAt).format('MMMM Do YYYY')}</div>
                    <p
                      className="card-text mb-auto"
                      dangerouslySetInnerHTML={{
                        __html: truncatedContent, // Render truncated content
                      }}
                    />
                    {hasContent && (
                      <Link
                        to={`/post/${post._id}`}
                        className="icon-link gap-1 icon-link-hover stretched-link"
                      >
                        Continue reading
                        <svg className="bi">
                          <use xlinkHref="#chevron-right" />
                        </svg>
                      </Link>
                    )}
                  </div>
                  <div className="col-auto d-none d-lg-block">
                    <svg
                      className="bd-placeholder-img"
                      width={200}
                      height={250}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
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

export default Home;
