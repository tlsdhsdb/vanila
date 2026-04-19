import Link from "next/link";

import { GameNavigation } from "@/components/game-navigation";

interface RoutePlaceholderPageProps {
  title: string;
  description: string;
  focus: string;
}

export function RoutePlaceholderPage({
  title,
  description,
  focus,
}: RoutePlaceholderPageProps) {
  return (
    <main className="game-layout">
      <aside className="panel side-panel">
        <p className="eyebrow">Vanilla Dream</p>
        <h1>Game MVP Skeleton</h1>
        <p className="muted">
          step01 범위에서는 전체 게임 화면을 연결할 수 있는 라우트와 공통 구조만 제공합니다.
        </p>
        <GameNavigation />
      </aside>

      <section className="panel content-panel">
        <p className="eyebrow">Screen Placeholder</p>
        <h2>{title}</h2>
        <p className="lead">{description}</p>

        <div className="placeholder-grid">
          <article className="placeholder-card">
            <h3>Current focus</h3>
            <p>{focus}</p>
          </article>
          <article className="placeholder-card">
            <h3>Bootstrap notes</h3>
            <ul className="checklist">
              <li>실제 라우트 경로를 먼저 고정했습니다.</li>
              <li>UI는 placeholder 상태로 남겨 두었습니다.</li>
              <li>서버 연동과 비즈니스 로직은 다음 단계에서 연결합니다.</li>
            </ul>
          </article>
        </div>

        <div className="button-row">
          <Link className="button" href="/plaza">
            메인 플라자로 이동
          </Link>
          <Link className="button button-secondary" href="/">
            랜딩으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}

