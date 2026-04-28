import Link from "next/link";

import { HealthStatusCard } from "@/components/health-status-card";
import { gameRoutes, publicRoutes } from "@/features/game/routes";

export default function HomePage() {
  return (
    <main className="site-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">포트폴리오 MVP</p>
          <h1>Vanilla Dream</h1>
          <p className="lead">
            계정 인증, 캐릭터 생성, 직업 선택, 퀘스트 진행, 아카데미 수업까지 하나의 웹 게임
            흐름으로 연결한 패션 커리어 성장 게임 MVP입니다.
          </p>
          <div className="button-row">
            <Link className="button" href="/login">
              로그인하러 가기
            </Link>
            <Link className="button button-secondary" href="/plaza">
              플라자 바로 보기
            </Link>
          </div>
        </div>

        <div className="hero-summary">
          <div className="summary-card">
            <span>프론트엔드</span>
            <strong>Next.js App Router + TypeScript</strong>
          </div>
          <div className="summary-card">
            <span>백엔드</span>
            <strong>Spring Boot REST + JWT</strong>
          </div>
          <div className="summary-card">
            <span>현재 단계</span>
            <strong>step04 퀘스트/수업 진행 루프</strong>
          </div>
        </div>
      </section>

      <HealthStatusCard />

      <section className="route-section">
        <div className="section-heading">
          <p className="eyebrow">공개 화면</p>
          <h2>시작 동선</h2>
        </div>
        <div className="route-grid">
          {publicRoutes.map((route) => (
            <Link key={route.href} className="route-card panel" href={route.href}>
              <strong>{route.label}</strong>
              <p>{route.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="route-section">
        <div className="section-heading">
          <p className="eyebrow">게임 화면</p>
          <h2>현재 플레이 가능한 흐름</h2>
        </div>
        <div className="route-grid">
          {gameRoutes.map((route) => (
            <Link key={route.href} className="route-card panel" href={route.href}>
              <strong>{route.label}</strong>
              <p>{route.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
