import { Card, Button } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";

function DetailsView({ row, onBack }) {
  return (
    <Card className="card-custom details-card">
      <Button
        variant="outline-secondary"
        className="mb-3 d-flex align-items-center"
        onClick={onBack}
      >
        <ArrowLeft size={16} className="me-2" />
        Back
      </Button>

      <h4 className="mb-3">Operator Record Details</h4>

      {/* Image Field */}
      {row.Image && (
        <div className="mb-3">
          <img
            src={row.Image}
            alt="Record Visual"
            className="details-image"
          />
        </div>
      )}

      {/* Data Fields */}
      {Object.entries(row).map(([key, value]) => (
        key !== "Image" && (
          <p key={key}><strong>{key}:</strong> {value}</p>
        )
      ))}
    </Card>
  );
}

export default DetailsView;
