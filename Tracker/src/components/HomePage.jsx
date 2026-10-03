import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell auth-page">
      <div className="landing-layout">
        <section className="brand-panel">
          <div className="eyebrow">Campus support portal</div>
          <h1>
            Track issues, respond faster, and keep campus services running
            smoothly.
          </h1>
          <p>
            Students can report concerns instantly, while teachers and admins
            can review submissions, provide updates, and monitor progress from
            one clear dashboard.
          </p>

          <div className="cta-row">
            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">✓</span>
              <h3>Issue reporting</h3>
              <p>
                Quickly submit maintenance, academic, and campus service
                requests.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Live updates</h3>
              <p>
                Track every change from submission to resolution in one place.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>Clear communication</h3>
              <p>
                Discuss issues and share updates using comments and replies.
              </p>
            </div>
          </div>
        </section>

        <aside className="info-panel">
          <div className="panel-header">
            <span className="dot dot-green"></span>
            <h2>Today at a glance</h2>
          </div>

          <div className="stat-block">
            <strong>1,284</strong>
            <span>Active campus requests</span>
          </div>

          <div className="stat-block">
            <strong>76%</strong>
            <span>Resolved within SLA</span>
          </div>

          <div className="mini-list">
            <div className="list-item">
              <span className="list-tag tag-warning">Pending</span>
              <p>Water supply inspection</p>
            </div>
            <div className="list-item">
              <span className="list-tag tag-info">In Progress</span>
              <p>Lab equipment repair</p>
            </div>
            <div className="list-item">
              <span className="list-tag tag-success">Resolved</span>
              <p>Lighting issue in library</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
