import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function TeacherPge() {
  const location = useLocation();
  const teacherProfile = location.state || { name: "Admin" };
  const overviewRef = useRef(null);
  const issueListRef = useRef(null);
  const notificationRef = useRef(null);
  const [showComment, SetShowComment] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [issue_id, setIssue_id] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const HandelTChange = (event) => {
    const text = event.target.value;
    setComment(text);
  };

  useEffect(() => {
    const FetchComments = async () => {
      if (!issue_id) return;

      const api = `http://localhost:3000/api/teach/issues/${issue_id}/comments`;
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

  const HandelCSubmit = async (event, issue_id) => {
    event.preventDefault();

    try {
      const api = `http://localhost:3000/api/teach/issues/${issue_id}/comments/add`;
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

  const [issues, setissues] = useState([
    {
      name: "",
      role: "",
      title: "",
      category: "",
      description: "",
      location: "",
      status: "",
    },
  ]);

  useEffect(() => {
    const getisseus = async () => {
      const api = `http://localhost:3000/api/teach/issues`;
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const response = await fetch(api, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        });

        const responsedata = await response.json();

        if (response.ok) {
          setissues(responsedata.data || []);
          console.log(responsedata.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getisseus();
  }, []);

  const [status, setstatus] = useState("");
  const [sissue_id, setsIssue_id] = useState("");

  useEffect(() => {
    if (!sissue_id) return;
    const setStatus = async () => {
      const api = `http://localhost:3000/api/teach/issues/${sissue_id}/status`;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(api, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            status: status,
          }),
        });

        const responsedata = await response.json();

        if (response.ok) {
          console.log(responsedata);
        }
      } catch (err) {
        console.log(err);
      }
    };

    setStatus();
  }, [status, sissue_id]);

  const summaryStats = [
    {
      label: "Pending",
      value: issues.filter((item) => !item.status || item.status === "Pending")
        .length,
    },
    {
      label: "In progress",
      value: issues.filter(
        (item) => item.status === "inprogress" || item.status === "In Progress",
      ).length,
    },
    {
      label: "Resolved",
      value: issues.filter((item) => item.status === "Resolved").length,
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
          <div className="brand-mark">A</div>
          <div>
            <p className="eyebrow">Admin workspace</p>
            <h2>Campus desk</h2>
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
            Issue queue
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === "notifications" ? "is-active" : ""}`}
            onClick={() => scrollToSection("notifications")}
          >
            Reports
          </button>
        </nav>

        <div className="profile-card">
          <p className="small-label">Signed in as</p>
          <strong>{teacherProfile.name}</strong>
          <span>Teacher</span>
        </div>
      </aside>

      <main className="main-panel">
        <header ref={overviewRef} className="topbar">
          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>Welcome back, {teacherProfile.name}</h1>
          </div>
          <div className="topbar-badge">Admin view</div>
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
          <aside
            ref={notificationRef}
            className="panel-block notification-panel"
          >
            <div className="panel-header">
              <h2>Notifications</h2>
              <span className="panel-pill">Live</span>
            </div>

            <div className="notification-list">
              <div className="notification-item">
                <span className="dot dot-warning"></span>
                <div>
                  <strong>Pending review</strong>
                  <p>4 new student issues need attention.</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="dot dot-info"></span>
                <div>
                  <strong>Reply posted</strong>
                  <p>Administrator comment was added to a service request.</p>
                </div>
              </div>
              <div className="notification-item">
                <span className="dot dot-success"></span>
                <div>
                  <strong>Resolved</strong>
                  <p>2 issues were marked complete today.</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="panel-block issue-form-panel">
            <div className="panel-header">
              <h2>Issue queue</h2>
              <span className="panel-pill">Monitoring</span>
            </div>
            <p className="queue-copy">
              Review each submission, check progress, and update the status as
              work advances.
            </p>
          </section>
        </div>

        <section ref={issueListRef} className="panel-block issue-list-panel">
          <div className="panel-header">
            <h2>Student issues</h2>
            <span className="panel-pill">{issues.length} total</span>
          </div>

          {loading ? (
            <div className="loading-panel">Loading issue queue...</div>
          ) : issues.length === 0 ? (
            <div className="empty-state">
              <h3>No issues available</h3>
              <p>There are no student submissions to review right now.</p>
            </div>
          ) : (
            <div className="issue-list">
              {issues.map((element, index) => (
                <article className="issue-card" key={index}>
                  <div className="issue-card__top">
                    <div>
                      <p className="issue-meta">{element.name || "Student"}</p>
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
                    <span>📁 {element.category || "General"}</span>
                    <span>📍 {element.location || "Not specified"}</span>
                  </div>

                  <div className="status-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setstatus("Pending");
                        setsIssue_id(element.issue_id);
                      }}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setstatus("inprogress");
                        setsIssue_id(element.issue_id);
                      }}
                    >
                      In progress
                    </button>
                    <button
                      type="button"
                      className="primary-btn small-btn"
                      onClick={() => {
                        setstatus("Resolved");
                        setsIssue_id(element.issue_id);
                      }}
                    >
                      Resolved
                    </button>
                  </div>

                  {showComment == element.issue_id && (
                    <div className="comment-panel">
                      <div className="comment-panel__header">
                        <h4>Discussion</h4>
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
                            No comments yet for this issue.
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
                          placeholder="Reply to student"
                        />
                        <button type="submit" className="secondary-btn">
                          Send
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
