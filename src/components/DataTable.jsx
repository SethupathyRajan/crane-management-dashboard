import { Table, Card } from "react-bootstrap";

function DataTable({ data, onRowClick }) {
  // exclude image and serial number columns from display
  const excluded = ["image", "Sl.No", "slno", "sl_no", "sl"];
  const availableKeys = data[0]
    ? Object.keys(data[0]).filter((k) => !excluded.includes(k.toLowerCase()))
    : [];

  // Desired display order and possible synonyms for each column
  const desiredOrder = [
    { label: "Sl.No", keys: ["Sl.No", "SL No", "SL_No", "SlNo", "Sl No"] },
    { label: "Date", keys: ["Date", "date"] },
    { label: "Operator", keys: ["Operator", "Operator/Driver", "Operator Name", "Operator/Driver Name"] },
    { label: "Emp Code", keys: ["Emp Code", "EmpCode", "Employee Code", "Emp ID", "Emp_ID"] },
    { label: "Shift", keys: ["Shift"] },
    { label: "Equipment", keys: ["Equipment", "Equipment No", "Equipment No.", "Equipment_No"] },
    { label: "Material", keys: ["Material", "Material Name"] },
    { label: "Qty", keys: ["Qty", "Quantity"] },
    { label: "UOM", keys: ["UOM", "Unit", "Unit of Measure", "UoM"] },
    { label: "Time In", keys: ["Time In", "Time In (HH:MM)", "TimeIn", "Time_In"] },
    { label: "Time Out", keys: ["Time Out", "Time Out (HH:MM)", "TimeOut", "Time_Out"] },
    { label: "Opening", keys: ["Opening", "Opening Time", "Open", "Open Time"] },
    { label: "Closing", keys: ["Closing", "Closing Time", "Close", "Close Time"] },
  ];

  // Map lowercase available keys to actual keys for case-insensitive lookup
  const keyMap = {};
  availableKeys.forEach((k) => (keyMap[k.toLowerCase()] = k));

  const orderedColumns = [];
  const headerLabels = {};

  // pick keys in desired order if they exist in data
  desiredOrder.forEach((entry) => {
    for (const candidate of entry.keys) {
      const found = keyMap[candidate.toLowerCase()];
      if (found && !orderedColumns.includes(found)) {
        orderedColumns.push(found);
        headerLabels[found] = entry.label;
        break;
      }
    }
  });

  // append any remaining keys not in the ordered list
  availableKeys.forEach((k) => {
    if (!orderedColumns.includes(k)) {
      orderedColumns.push(k);
      headerLabels[k] = k;
    }
  });

  return (
    <Card className="card-custom">
      <h5 className="mb-3">Operational Records</h5>

      <Table hover bordered responsive className="office-table">
        <thead className="table-light">
          <tr>
            {orderedColumns.length > 0 ? (
              orderedColumns.map((key) => <th key={key}>{headerLabels[key] || key}</th>)
            ) : (
              <th>No data</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={orderedColumns.length || 1} className="text-center py-4">
                No records to display
              </td>
            </tr>
          )}

          {data.map((row, index) => (
            <tr
              key={index}
              className="table-row"
              onClick={() => onRowClick(row)}
              style={{ cursor: "pointer" }}
            >
              {orderedColumns.map((col, i) => (
                <td key={i}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default DataTable;
