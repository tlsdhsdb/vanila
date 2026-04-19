import Link from "next/link";

import { HealthStatusCard } from "@/components/health-status-card";
import { gameRoutes, publicRoutes } from "@/features/game/routes";

export default function HomePage() {
  return (
    <main className="site-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio MVP</p>
          <h1>Vanilla Dream</h1>
          <p className="lead">
            패션 도시에서 커리어를 키우는 웹게임 MVP를 위한 초기 부트스트랩입니다.
            인증, 캐릭터 성장, 미니게임, 상점, 소셜 허브가 들어갈 자리를 먼저 고정했습니다.
          </p>
          <div className="button-row">
            <Link className="button" href="/login">
              로그인 화면
            </Link>
            <Link className="button button-secondary" href="/plaza">
              게임 허브 보기
            </Link>
          </div>
        </div>

        <div className="hero-summary">
          <div className="summary-card">
            <span>Stack</span>
            <strong>Next.js App Router + TypeScript</strong>
          </div>
          <div className="summary-card">
            <span>API</span>
            <strong>REST client ready</strong>
          </div>
          <div className="summary-card">
            <span>Scope</span>
            <strong>step01 bootstrap only</strong>
          </div>
        </div>
      </section>

      <HealthStatusCard />

      <section className="route-section">
        <div className="section-heading">
          <p className="eyebrow">Public routes</p>
          <h2>공개 화면 골격</h2>
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
          <p className="eyebrow">Game routes</p>
          <h2>MVP 화면 맵</h2>
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

