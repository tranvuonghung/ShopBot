import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../Compoment/Sidebar/Sidebar";

function Dashboard() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h1 className="h3 fw-bold mb-2">Tong quan</h1>
        <p className="text-secondary mb-4">Xem nhanh tinh hinh cua cua hang.</p>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-secondary small">Doanh thu hom nay</div>
                <div className="h4 fw-bold mb-0">1.250.000 VND</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-secondary small">Don hang</div>
                <div className="h4 fw-bold mb-0">12</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="text-secondary small">Mon dang ban</div>
                <div className="h4 fw-bold mb-0">24</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
