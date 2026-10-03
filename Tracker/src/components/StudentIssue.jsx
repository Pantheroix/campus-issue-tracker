import { useEffect, useRef } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function StudentIssue() {
  const location = useLocation();
  const userProfile = location.state || { name: "Student" };
  const overviewRef = useRef(null);
  const issueListRef = useRef(null);
  const notificationRef = useRef(null);

  const [comment, setComment] = useState("");
  const [showComment, SetShowComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");
  const [issueError, setIssueError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const HandelChange = (event) => {
    const { id, value } = event.target;
    setIssue((prevdata) => ({
      ...prevdata,
      [id]: value,
    }));
  };

  const HandelTChange = (event) => {
    const text = event.target.value;
    setComment(text);
  };

  const [userIssues, setuserIssues] = useState([
    {
      title: "",
      description: "",
      category: "",
      location: "",
      status: "",
    },
  ]);

  const [issue, setIssue] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  useEffect(() => {
    const fetchPcomplains = async () => {
      const api = "http://localhost:3000/api/fetch/issues";
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const response = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        });

        const resdata = await response.json();

        if (response.ok) {
          setuserIssues(resdata.fdata || []);
          setIssueError("");
        } else {
          setIssueError("Unable to load your issue history right now.");
          setuserIssues([]);
        }
      } catch (err) {
        console.log(err);
        setIssueError("Something went wrong while fetching your issues.");
        setuserIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPcomplains();
  }, []);

  const HandelSubmit = async (event) => {
    event.preventDefault();
    const api = "http://localhost:3000/api/issues";
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify(issue),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setSubmitMessage("Issue submitted successfully.");
        setIssue({
          title: "",
          description: "",
          category: "",
          location: "",
        });
      } else {
        setIssueError(
          data.message || "Could not submit your issue. Please try again.",
        );
      }
    } catch (err) {
      console.log(err);
      setIssueError(
        "Submission failed. Please check your connection and try again.",
      );
    }
  };

  const HandelCSubmit = async (event, issue_id) => {
    event.preventDefault();

    try {
      const api = `http://localhost:3000/api/issues/${issue_id}/comments/add`;
      const token = localStorage.getItem("token");

      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify({
          comment: comment,
        }),
      });

      const responsedata = await response.json();

      if (response.ok) {
        console.log(responsedata);
        setComment("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [issue_id, setIssue_id] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const FetchComments = async () => {
      if (!issue_id) return;

      const api = `http://localhost:3000/api/issues/${issue_id}/comments`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        });

        const responsedata = await response.json();

        if (response.ok) {
          setComments(responsedata.data || []);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.log(err);
        setComments([]);
      }
    };

    FetchComments();
  }, [issue_id]);

  const summaryStats = [
    {
      label: "Open tickets",
      value: userIssues.filter((item) => item.status !== "Resolved").length,
    },
    {
      label: "In progress",
      value: userIssues.filter(
        (item) => item.status === "inprogress" || item.status === "In Progress",
      ).length,
    },
    {
      label: "Resolved",
      value: userIssues.filter((item) => item.status === "Resolved").length,
    },
  ];

  const scrollToSection = (section) => {
    setActiveSection(section);

    if (section === "overview" && overviewRef.current) {
      overviewRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (section === "issues" && issueListRef.current) {
      issueListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (section === "notifications" && notificationRef.current) {
      notificationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const sectionRefs = {
      overview: overviewRef,
      issues: issueListRef,
      notifications: notificationRef,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const sectionName = Object.entries(sectionRefs).find(
          ([, ref]) => ref.current === visibleEntry.target,
        )?.[0];

        if (sectionName) {
          setActiveSection(sectionName);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.5, 0.8],
        rootMargin: "-10% 0px -30% 0px",
      },
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-shell dashboard-shell">
      <aside className="sidebar-panel">
        <div className="brand-block">
          <div className="brand-mark">C</div>
          <div>
            <p className="eyebrow">Campus portal</p>
            <h2>Student desk</h2>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sidebar navigation">
          <button
            type="button"
            className={`nav-item ${activeSection === "overview" ? "is-active" : ""}`}
            onClick={() => scrollToSection("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === "issues" ? "is-active" : ""}`}
            onClick={() => scrollToSection("issues")}
          >
            My issues
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === "notifications" ? "is-active" : ""}`}
            onClick={() => scrollToSection("notifications")}
          >
            Notifications
          </button>
        </nav>

        <div className="profile-card">
          <p className="small-label">Signed in as</p>
          <strong>{userProfile.name}</strong>
          <span>Student</span>
        </div>
      </aside>

      <main className="main-panel">
        <header ref={overviewRef} className="topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Hello, {userProfile.name}</h1>
          </div>
          <div className="topbar-badge">Issue tracker</div>
        </header>

        <section className="stat-grid">
          {summaryStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </section>

        <div className="content-grid">
          <section className="panel-block issue-form-panel">
            <div className="panel-header">
              <h2>Submit a new issue</h2>
              <span className="panel-pill">Quick form</span>
            </div>

            <form className="issue-form" onSubmit={HandelSubmit}>
              <div className="field-group">
                <label htmlFor="title">Issue title</label>
                <input
                  id="title"
                  type="text"
                  onChange={HandelChange}
                  value={issue.title}
                  placeholder="Example: Broken projector in room 204"
                />
              </div>

              <div className="field-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  onChange={HandelChange}
                  value={issue.description}
                  placeholder="Add details about the issue, impact, and urgency."
                />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    type="text"
                    onChange={HandelChange}
                    value={issue.category}
                    placeholder="Maintenance"
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    type="text"
                    onChange={HandelChange}
                    value={issue.location}
                    placeholder="Academic block A"
                  />
                </div>
              </div>

              {submitMessage && (
                <div className="form-message form-message--success">
                  {submitMessage}
                </div>
              )}
              {issueError && (
                <div className="form-message form-message--error">
                  {issueError}
                </div>
              )}

              <button type="submit" className="primary-btn">
                Submit issue
              </button>
            </form>
          </section>

          <aside
            ref={notificationRef}
            className="panel-block notification-panel"
          >
            <div className="panel-header">
              <h2>Notifications</h2>
              <span className="panel-pill">3 new</span>
            </div>

            <div className="notification-list">
              <div className="notification-item">
                <span className="dot dot-success"></span>
                <div>
                  <strong>Issue resolved</strong>
                  <p>Library Wi-Fi request was marked resolved.</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="dot dot-warning"></span>
                <div>
                  <strong>Status update</strong>
                  <p>Classroom projector is now in progress.</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="dot dot-info"></span>
                <div>
                  <strong>Comment added</strong>
                  <p>Admin left a new reply on your request.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section ref={issueListRef} className="panel-block issue-list-panel">
          <div className="panel-header">
            <h2>My issues</h2>
            <span className="panel-pill">{userIssues.length} records</span>
          </div>

          {loading ? (
            <div className="loading-panel">Loading your issues...</div>
          ) : userIssues.length === 0 ? (
            <div className="empty-state">
              <h3>No issues yet</h3>
              <p>
                Submit your first report to see it appear here with updates and
                comments.
              </p>
            </div>
          ) : (
            <div className="issue-list">
              {userIssues.map((element, index) => (
                <article className="issue-card" key={index}>
                  <div className="issue-card__top">
                    <div>
                      <p className="issue-meta">
                        {element.category || "General"}
                      </p>
                      <h3>{element.title}</h3>
                    </div>
                    <span
                      className={`status-badge status-${(element.status || "pending").toLowerCase().replace(/\s+/g, "")}`}
                    >
                      {element.status || "Pending"}
                    </span>
                  </div>

                  <p className="issue-description">{element.description}</p>

                  <div className="issue-details">
                    <span>
                      📍 {element.location || "Location not specified"}
                    </span>
                    <span>🕒 {element.status || "Pending"}</span>
                  </div>

                  {showComment == element.issue_id && (
                    <div className="comment-panel">
                      <div className="comment-panel__header">
                        <h4>Comments</h4>
                        <button
                          type="button"
                          className="inline-link"
                          onClick={() => {
                            SetShowComment(false);
                          }}
                        >
                          Hide
                        </button>
                      </div>

                      <div className="prevcoms">
                        {comments.length > 0 ? (
                          comments.map((commentItem, idx) => (
                            <div className="comment-bubble" key={idx}>
                              <strong>{commentItem.name}:</strong>
                              <span>{commentItem.comment}</span>
                            </div>
                          ))
                        ) : (
                          <p className="empty-comment">
                            There are no comments yet for this issue.
                          </p>
                        )}
                      </div>

                      <form
                        className="comment-form"
                        onSubmit={(event) => {
                          HandelCSubmit(event, element.issue_id);
                          setComment("");
                        }}
                      >
                        <input
                          type="text"
                          id="comment"
                          onChange={HandelTChange}
                          value={comment}
                          placeholder="Add a comment"
                        />
                        <button type="submit" className="secondary-btn">
                          Submit
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="issue-card__footer">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        SetShowComment(element.issue_id);
                        setIssue_id(element.issue_id);
                      }}
                    >
                      View comments
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
