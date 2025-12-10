import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { fetchData } from "../api";
import FilterPanel from "../components/FilterPanel";
import DataTable from "../components/DataTable";
import DetailsView from "../components/DetailsView";
import "./Layout.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData().then(d => {
      setData(d);
      setFiltered(d);
    });
  }, []);

  return (
    <Container fluid className="p-4 dashboard-container">
      {!selectedRow ? (
        <Row>
          {/* Left Filter Panel */}
          <Col md={3}>
            <FilterPanel data={data} setFiltered={setFiltered} />
          </Col>

          {/* Right Table */}
          <Col md={9}>
            <DataTable data={filtered} onRowClick={setSelectedRow} />
          </Col>
        </Row>
      ) : (
        <div className="d-flex justify-content-center align-items-start py-4">
          <DetailsView row={selectedRow} onBack={() => setSelectedRow(null)} />
        </div>
      )}
    </Container>
  );
}

export default Dashboard;
