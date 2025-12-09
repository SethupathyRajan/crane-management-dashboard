import { useEffect, useState } from "react";
import { Container, Table, Form, Row, Col } from "react-bootstrap";
import { fetchData } from "./api";

function Dashboard() {
  const [data, setData] = useState([]);       // always array
  const [filtered, setFiltered] = useState([]);

  const [operatorFilter, setOperatorFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");

  // Load Data Initially
  useEffect(() => {
    const load = async () => {
      try {
        const d = await fetchData();
        setData(d || []);         // ensure fallback
        setFiltered(d || []);
      } catch (err) {
        console.error("API Error:", err);
        setData([]);
        setFiltered([]);
      }
    };
    load();
  }, []);

  // Apply Filters (runs when filters OR data change)
  useEffect(() => {
    if (!data.length) return;  // nothing to filter

    let result = [...data];

    if (operatorFilter) {
      result = result.filter(
        (item) => item["Operator/Driver"] === operatorFilter
      );
    }

    if (equipmentFilter) {
      result = result.filter(
        (item) => item["Equipment No"] === equipmentFilter
      );
    }

    setFiltered(result);
  }, [operatorFilter, equipmentFilter, data]);


  // Extract unique dropdown values safely
  const uniqueOperators = [...new Set(data.map(d => d["Operator/Driver"]).filter(Boolean))];
  const uniqueEquipments = [...new Set(data.map(d => d["Equipment No"]).filter(Boolean))];

  return (
    <Container className="mt-4">

      <h2 className="mb-4">Crane Operational Dashboard</h2>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select value={operatorFilter} onChange={(e) => setOperatorFilter(e.target.value)}>
            <option value="">Filter by Operator</option>
            {uniqueOperators.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
            <option value="">Filter by Equipment</option>
            {uniqueEquipments.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Data Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))
            }
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value !== "" ? value : "-"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={data[0] ? Object.keys(data[0]).length : 1} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default Dashboard;
