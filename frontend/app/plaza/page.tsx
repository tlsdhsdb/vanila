"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { fetchCurrentCharacter, isCharacterMissingError } from "@/features/character/character-api";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage } from "@/lib/api-client";
import type { CharacterResponse } from "@/types/api";

export default function PlazaPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }
    const authToken = token;

    async function loadCharacter() {
      try {
        const currentCharacter = await fetchCurrentCharacter(authToken);

        if (!isMounted) {
          return;
        }

        if (!currentCharacter.job) {
          router.replace("/job/select");
          return;
        }

        setCharacter(currentCharacter);
        setIsChecking(false);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (isCharacterMissingError(caughtError)) {
          router.replace("/character/create");
          return;
        }

        clearAuthToken();
        setError(getApiErrorMessage(caughtError));
        router.replace("/login");
      }
    }

    loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <ProtectedRoute>
      <main className="game-layout">
        <aside className="panel side-panel">
          <p className="eyebrow">Vanilla Dream</p>
          <h1>Main Plaza</h1>
          <p className="muted">캐릭터와 직업 선택을 마친 플레이어가 도착하는 허브입니다.</p>
          <GameNavigation />
        </aside>

        <section className="panel content-panel">
          <p className="eyebrow">Main Plaza</p>
          <h2>메인 플라자</h2>

          {isChecking && <p className="lead">플라자 입장 조건을 확인하는 중입니다.</p>}

          {error && <p className="form-message error">{error}</p>}

          {character && (
            <>
              <p className="lead">
                {character.name}님, Vanilla Dream의 메인 플라자에 오신 것을 환영합니다.
              </p>

              <div className="placeholder-grid">
                <article className="placeholder-card">
                  <h3>현재 캐릭터</h3>
                  <dl className="meta-list">
                    <div>
                      <dt>직업</dt>
                      <dd>{character.job}</dd>
                    </div>
                    <div>
                      <dt>레벨</dt>
                      <dd>{character.level}</dd>
                    </div>
                    <div>
                      <dt>Beads</dt>
                      <dd>{character.beads}</dd>
                    </div>
                    <div>
                      <dt>칭호</dt>
                      <dd>{character.title}</dd>
                    </div>
                  </dl>
                </article>

                <article className="placeholder-card">
                  <h3>Step03 연결 상태</h3>
                  <ul className="checklist">
                    <li>캐릭터가 없으면 캐릭터 생성 페이지로 이동합니다.</li>
                    <li>직업을 고르지 않았으면 직업 선택 페이지로 이동합니다.</li>
                    <li>스탯, 퀘스트, 상점 기능은 아직 구현하지 않았습니다.</li>
                  </ul>
                </article>
              </div>

              <div className="button-row">
                <Link className="button button-secondary" href="/profile">
                  내 방 / 프로필 보기
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
