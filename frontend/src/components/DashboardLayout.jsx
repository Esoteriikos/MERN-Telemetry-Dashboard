import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
  return (
    <main className="dashboard-layout">
      <div className="dashboard-content">
        {children}
      </div>
    </main>
  )
}

export default DashboardLayout
