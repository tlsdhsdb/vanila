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
          <h1>MVP 준비 화면</h1>
          <p className="muted">
            현재 단계에서는 핵심 진행 루프만 연결되어 있으며, 이 화면은 다음 단계 구현을 위한 자리입니다.
          </p>
          <GameNavigation />
        </aside>

        <section className="panel content-panel">
          <p className="eyebrow">준비 중 화면</p>
          <h2>{title}</h2>
          <p className="lead">{description}</p>

          <div className="placeholder-grid">
            <article className="placeholder-card">
              <h3>현재 초점</h3>
              <p>{focus}</p>
            </article>
            <article className="placeholder-card">
              <h3>인증 안내</h3>
              <ul className="checklist">
                <li>이 화면은 로그인된 상태에서만 접근할 수 있습니다.</li>
                <li>현재 단계에서는 실제 비즈니스 로직이 아직 연결되지 않았습니다.</li>
                <li>인증이 만료되면 로그인 화면으로 다시 이동합니다.</li>
              </ul>
            </article>
          </div>

          <div className="button-row">
            <Link className="button" href="/plaza">
              메인 플라자로 이동
            </Link>
            <Link className="button button-secondary" href="/">
              첫 화면으로 돌아가기
            </Link>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
