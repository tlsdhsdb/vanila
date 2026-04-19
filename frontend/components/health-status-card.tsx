"use client";

import { API_BASE_URL } from "@/lib/config";
import { useApiHealth } from "@/hooks/use-api-health";

export function HealthStatusCard() {
  const { data, error, isLoading } = useApiHealth();

  return (
    <section className="panel">
      <div className="status-header">
        <div>
          <p className="eyebrow">Backend health</p>
          <h2>API 연결 확인</h2>
        </div>
        <span className={`status-pill ${data ? "online" : error ? "offline" : "pending"}`}>
          {data ? "Online" : error ? "Offline" : "Checking"}
        </span>
      </div>
      <p className="muted">기본 연결 주소: {API_BASE_URL}</p>
      {isLoading && <p className="muted">health endpoint를 확인하는 중입니다.</p>}
      {data && (
        <dl className="meta-list">
          <div>
            <dt>Status</dt>
            <dd>{data.status}</dd>
          </div>
          <div>
            <dt>Application</dt>
            <dd>{data.application}</dd>
          </div>
          <div>
            <dt>Timestamp</dt>
            <dd>{new Date(data.timestamp).toLocaleString("ko-KR")}</dd>
          </div>
        </dl>
      )}
      {error && (
        <p className="error-text">
          백엔드가 아직 실행 중이 아니거나 환경 변수가 맞지 않습니다. ({error})
        </p>
      )}
    </section>
  );
}

