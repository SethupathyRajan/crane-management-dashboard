import { useState, useEffect } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { Filter, ArrowUpDown } from "lucide-react";

function FilterPanel({ data, setFiltered }) {
  const [operator, setOperator] = useState("");
  const [equipment, setEquipment] = useState("");
  const [shift, setShift] = useState("");
  const [sortBy, setSortBy] = useState("");

  const uniqueOps = [...new Set(data.map(d => d["Operator/Driver"]).filter(Boolean))];
  const uniqueEquip = [...new Set(data.map(d => d["Equipment No"]).filter(Boolean))];
  const shifts = ["Morning", "Afternoon", "Night"];

  useEffect(() => {
    let result = [...data];

    if (operator) result = result.filter(r => r["Operator/Driver"] === operator);
    if (equipment) result = result.filter(r => r["Equipment No"] === equipment);
    if (shift) result = result.filter(r => r["Shift"] === shift);

    // compute uptime from Opening/Closing time strings (HH:MM) when requested
    const parseTimeToMinutes = (val) => {
      if (val == null) return null;
      if (typeof val === "number") return Math.round(val * 60); // assume hours -> minutes
      const s = String(val).trim();
      // try to parse HH:MM or H:MM
      const m = s.match(/(\d{1,2}):(\d{2})/);
      if (m) {
        const hh = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10);
        if (Number.isFinite(hh) && Number.isFinite(mm)) return hh * 60 + mm;
      }
      // if value looks like a decimal number (e.g. "4.5" hours)
      const num = parseFloat(s.replace(/[^0-9.\-]/g, ""));
      if (!Number.isNaN(num)) return Math.round(num * 60);
      return null;
    };

    const getUptimeMinutes = (row) => {
      // Try common opening/closing field names
      const openKeys = ["Opening", "Opening Time", "Open Time", "Open", "Start Time", "Start"];
      const closeKeys = ["Closing", "Closing Time", "Close Time", "Close", "End Time", "End"];

      let openVal = null;
      let closeVal = null;
      for (const k of openKeys) {
        if (k in row && row[k] !== "") {
          openVal = row[k];
          break;
        }
      }
      for (const k of closeKeys) {
        if (k in row && row[k] !== "") {
          closeVal = row[k];
          break;
        }
      }

      const openMin = parseTimeToMinutes(openVal);
      const closeMin = parseTimeToMinutes(closeVal);

      if (openMin != null && closeMin != null) {
        let diff = closeMin - openMin;
        if (diff < 0) diff += 24 * 60; // handle overnight (closing after midnight)
        return diff;
      }

      // fallback to numeric Uptime field (assume hours)
      const uptimeField = row["Uptime"];
      if (uptimeField != null && uptimeField !== "") {
        const parsed = parseFloat(String(uptimeField).replace(/[^0-9.\-]/g, ""));
        if (!Number.isNaN(parsed)) return Math.round(parsed * 60);
      }

      return 0;
    };

    if (sortBy === "uptime") {
      result.sort((a, b) => {
        const uptimeA = getUptimeMinutes(a);
        const uptimeB = getUptimeMinutes(b);
        return uptimeB - uptimeA;
      });
    }

    if (sortBy === "productivity") {
      result.sort((a, b) => b["Qty"] - a["Qty"]);
    }

    setFiltered(result);
  }, [operator, equipment, shift, sortBy, data]);

  return (
    <Card className="filter-card card-custom">
      <h5 className="mb-3 d-flex align-items-center">
        <Filter size={18} className="me-2" /> Filters
      </h5>

      {/* Operator Filter */}
      <Form.Select
        className="mb-3"
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
      >
        <option value="">Operator</option>
        {uniqueOps.map(op => <option key={op} value={op}>{op}</option>)}
      </Form.Select>

      {/* Equipment Filter */}
      <Form.Select
        className="mb-3"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
      >
        <option value="">Equipment No</option>
        {uniqueEquip.map(eq => <option key={eq} value={eq}>{eq}</option>)}
      </Form.Select>

      {/* Shift Filter */}
      <Form.Select
        className="mb-3"
        value={shift}
        onChange={(e) => setShift(e.target.value)}
      >
        <option value="">Shift</option>
        {shifts.map(s => <option key={s} value={s}>{s}</option>)}
      </Form.Select>

      {/* Sorting Buttons */}
      <div className="mt-3">
        <Button
          variant="outline-primary"
          className="w-100 mb-2 d-flex align-items-center justify-content-center"
          onClick={() => setSortBy("uptime")}
        >
          <ArrowUpDown size={16} className="me-2" />
          Sort by Uptime
        </Button>

        <Button
          variant="outline-success"
          className="w-100 d-flex align-items-center justify-content-center"
          onClick={() => setSortBy("productivity")}
        >
          <ArrowUpDown size={16} className="me-2" />
          Sort by Productivity
        </Button>
      </div>
    </Card>
  );
}

export default FilterPanel;
