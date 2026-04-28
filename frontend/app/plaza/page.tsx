"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { fetchCurrentCharacter, isCharacterMissingError } from "@/features/character/character-api";
import { jobLabelMap } from "@/features/character/character-options";
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";
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

        if (isAuthenticationError(caughtError)) {
          clearAuthToken();
          router.replace("/login");
          return;
        }

        setError(getApiErrorMessage(caughtError));
        setIsChecking(false);
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
          <h1>메인 플라자</h1>
          <p className="muted">
            캐릭터 생성과 직업 선택을 마친 뒤, 다음 진행 루프로 이어지는 중심 허브입니다.
          </p>
          <GameNavigation />
        </aside>

        <section className="panel content-panel">
          <p className="eyebrow">메인 허브</p>
          <h2>다음 진행을 선택해 주세요</h2>

          {isChecking && <p className="lead">플라자 진입 조건을 확인하고 있습니다.</p>}

          {error && <p className="form-message error">{error}</p>}

          {character && (
            <>
              <p className="lead">
                {character.name}님이 메인 플라자에 도착했습니다. 이제 퀘스트와 아카데미 수업으로
                성장 루프를 진행할 수 있습니다.
              </p>

              <div className="placeholder-grid">
                <article className="placeholder-card">
                  <h3>현재 캐릭터</h3>
                  <dl className="meta-list">
                    <div>
                      <dt>직업</dt>
                      <dd>{character.job ? jobLabelMap[character.job] : "-"}</dd>
                    </div>
                    <div>
                      <dt>레벨</dt>
                      <dd>{character.level}</dd>
                    </div>
                    <div>
                      <dt>비즈</dt>
                      <dd>{character.beads}</dd>
                    </div>
                    <div>
                      <dt>칭호</dt>
                      <dd>{character.title}</dd>
                    </div>
                  </dl>
                </article>

                <article className="placeholder-card">
                  <h3>step04 진행 상태</h3>
                  <ul className="checklist">
                    <li>캐릭터가 없으면 캐릭터 생성 화면으로 이동합니다.</li>
                    <li>직업이 없으면 직업 선택 화면으로 이동합니다.</li>
                    <li>퀘스트와 아카데미 수업이 현재 단계에서 플레이 가능합니다.</li>
                    <li>미니게임, 상점, 인벤토리, 승급은 다음 단계에서 이어집니다.</li>
                  </ul>
                </article>
              </div>

              <div className="button-row">
                <Link className="button button-secondary" href="/profile">
                  프로필 보기
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
