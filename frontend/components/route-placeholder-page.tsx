import Link from "next/link";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";

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
    <ProtectedRoute>
      <main className="game-layout">
        <aside className="panel side-panel">
          <p className="eyebrow">Vanilla Dream</p>
          <h1>Game MVP Skeleton</h1>
          <p className="muted">
            인증된 플레이어만 접근하는 MVP 화면 골격입니다.
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
              <h3>Auth notes</h3>
              <ul className="checklist">
                <li>이 화면은 저장된 토큰으로 /api/auth/me 확인 후 표시됩니다.</li>
                <li>게임 비즈니스 로직은 아직 연결하지 않았습니다.</li>
                <li>인증 실패 시 로그인 화면으로 돌아갑니다.</li>
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
    </ProtectedRoute>
  );
}
