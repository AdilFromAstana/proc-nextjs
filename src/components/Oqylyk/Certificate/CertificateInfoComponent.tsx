import React from "react";
import { Check, X } from "lucide-react";

interface Student {
  user: {
    getFullName: () => string;
  };
}

interface UserCertificate {
  is_active: number | null;
  certificate_number: string;
  issued_at?: string; // Сделано опциональным
  getIssuedAtDate: () => string;
  meta?: Array<{
    field: string;
    value: string;
  }>;
  placeholders?: any[];
}

interface CertificateInfoComponentProps {
  student: Student;
  certificate: UserCertificate;
}

const CertificateInfoComponent: React.FC<CertificateInfoComponentProps> = ({
  student,
  certificate,
}) => {
  return (
    <div className="report-certificate-info">
      {/* STATUS */}
      <div className="report-certificate-item">
        <div className="report-certificate-field">
          <span>Статус</span>
        </div>
        <div className="report-certificate-value">
          {/* ACTIVE STATUS */}
          {(certificate.is_active === null || certificate.is_active === 1) && (
            <div className="report-certificate-status certificate-active-status">
              <div className="certificate-status-label">Действителен</div>
              <div className="certificate-status-icon">
                <Check size={16} />
              </div>
            </div>
          )}

          {/* REVOKED STATUS */}
          {certificate.is_active === 0 && (
            <div className="report-certificate-status certificate-revoked-status">
              <div className="certificate-status-label">Отозван</div>
              <div className="certificate-status-icon">
                <X size={16} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NUMBER */}
      {certificate.certificate_number && (
        <div className="report-certificate-item">
          <div className="report-certificate-field">
            <span>Номер</span>
          </div>
          <div className="report-certificate-value">
            №{certificate.certificate_number}
          </div>
        </div>
      )}

      {/* OWNER */}
      {student && student.user && (
        <div className="report-certificate-item">
          <div className="report-certificate-field">
            <span>Кому выдан</span>
          </div>
          <div className="report-certificate-value">
            {student.user.getFullName()}
          </div>
        </div>
      )}

      {/* META */}
      {certificate.meta &&
        certificate.meta.length > 0 &&
        certificate.meta.map((meta, index) => (
          <div
            key={`certificate-meta-${index}`}
            className="report-certificate-item"
          >
            <div className="report-certificate-field">
              <span>{meta.field}</span>
            </div>
            <div className="report-certificate-value">{meta.value}</div>
          </div>
        ))}

      {/* ISSUED AT */}
      {certificate.issued_at && (
        <div className="report-certificate-item">
          <div className="report-certificate-field">
            <span>Дата выдачи</span>
          </div>
          <div className="report-certificate-value">
            {certificate.getIssuedAtDate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateInfoComponent;
