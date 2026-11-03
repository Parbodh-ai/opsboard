
import { useState } from 'react'
import './App.css'

const tasks = [
  { id: 'TSK-101', title: 'Configure AWS staging environment', owner: 'Aman Sharma', priority: 'High', status: 'In Progress' },
  { id: 'TSK-102', title: 'Review server backup policy', owner: 'Priya Singh', priority: 'Medium', status: 'Pending' },
  { id: 'TSK-103', title: 'Update application dependencies', owner: 'Rahul Verma', priority: 'Low', status: 'Completed' },
  { id: 'TSK-104', title: 'Investigate API response latency', owner: 'Aman Sharma', priority: 'High', status: 'In Progress' },
]

const incidents = [
  { id: 'INC-201', title: 'Production API latency', severity: 'Critical', status: 'Investigating', time: '12 min ago' },
  { id: 'INC-202', title: 'Database backup delayed', severity: 'Medium', status: 'Open', time: '35 min ago' },
  { id: 'INC-203', title: 'Email notification failure', severity: 'Low', status: 'Resolved', time: '2 hours ago' },
]

const activities = [
  { initials: 'AS', name: 'Aman Sharma', action: 'created a new task', target: 'Configure AWS staging', time: '10 min ago' },
  { initials: 'PS', name: 'Priya Singh', action: 'resolved an incident', target: 'Email notification failure', time: '25 min ago' },
  { initials: 'RV', name: 'Rahul Verma', action: 'completed a task', target: 'Update dependencies', time: '1 hour ago' },
]

const navigation = [
  { name: 'Overview', icon: '▦' },
  { name: 'My Tasks', icon: '✓' },
  { name: 'Incidents', icon: '⚠' },
  { name: 'Team Activity', icon: '◷' },
]

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">O</div>
        <div>
          <strong>OpsBoard</strong>
          <span>Operations workspace</span>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav>
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? 'active' : ''}`}
            onClick={() => onNavigate(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-avatar">PA</div>
        <div>
          <strong>Parbodh</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  )
}

function StatCard({ label, value, detail, icon, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  )
}

function StatusBadge({ value }) {
  const style = value.toLowerCase().replaceAll(' ', '-')

  return <span className={`badge badge-${style}`}>{value}</span>
}

function DashboardContent() {
  return (
    <>
      <section className="stats-grid">
        <StatCard label="Total Tasks" value="48" detail="12 tasks in progress" icon="✓" color="blue" />
        <StatCard label="Open Incidents" value="08" detail="2 require urgent attention" icon="!" color="red" />
        <StatCard label="Completed Tasks" value="32" detail="This month" icon="↗" color="green" />
        <StatCard label="Team Members" value="12" detail="Across 3 departments" icon="◉" color="purple" />
      </section>

      <section className="content-grid">
        <article className="panel tasks-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Tasks</h2>
              <p>Track your team's latest work</p>
            </div>
            <button className="text-button">View all →</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TASK</th>
                  <th>ASSIGNEE</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <strong>{task.title}</strong>
                      <small>{task.id}</small>
                    </td>
                    <td>{task.owner}</td>
                    <td><StatusBadge value={task.priority} /></td>
                    <td><StatusBadge value={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel incidents-panel">
          <div className="panel-header">
            <div>
              <h2>Active Incidents</h2>
              <p>Issues requiring attention</p>
            </div>
            <span className="incident-count">3</span>
          </div>

          <div className="incident-list">
            {incidents.map((incident) => (
              <div className="incident-item" key={incident.id}>
                <div className="incident-heading">
                  <strong>{incident.title}</strong>
                  <StatusBadge value={incident.severity} />
                </div>
                <div className="incident-meta">
                  <span>{incident.id} · {incident.time}</span>
                  <span>{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest updates from your team</p>
          </div>
          <button className="text-button">View history →</button>
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity.name}>
              <div className="user-avatar small">{activity.initials}</div>
              <div className="activity-description">
                <strong>{activity.name}</strong>
                <span>{activity.action} <b>{activity.target}</b></span>
              </div>
              <time>{activity.time}</time>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function App() {
  const [active, setActive] = useState('Overview')

  return (
    <div className="app-layout">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / {active}</span>
            <h1>{active === 'Overview' ? 'Dashboard Overview' : active}</h1>
          </div>
          <div className="topbar-right">
            <span className="today-label">Operations workspace</span>
            <div className="user-avatar">PA</div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-section">
            <div>
              <h2>Good morning, Parbodh 👋</h2>
              <p>Here's what's happening across your operations today.</p>
            </div>
            <button className="primary-button">+ Create new</button>
          </div>

          {active === 'Overview' ? (
            <DashboardContent />
          ) : (
            <section className="panel empty-section">
              <h2>{active}</h2>
              <p>This section is planned for the next implementation milestone.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
