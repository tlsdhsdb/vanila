"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";
import {
  fetchCurrentCharacter,
  isCharacterMissingError,
  selectCharacterJob,
} from "@/features/character/character-api";
import { jobLabelMap, jobOptions } from "@/features/character/character-options";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";
import type { CharacterJob, CharacterResponse } from "@/types/api";

export default function JobSelectPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<CharacterJob | null>(null);

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

        if (isMounted) {
          setCharacter(currentCharacter);
          setIsChecking(false);
        }
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

  async function handleJobSelect(job: CharacterJob) {
    setError(null);
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsSubmitting(job);

    try {
      const updatedCharacter = await selectCharacterJob(token, job);
      setCharacter(updatedCharacter);
      router.push("/plaza");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(null);
    }
  }

  return (
    <ProtectedRoute>
      <main className="game-layout">
        <aside className="panel side-panel">
          <p className="eyebrow">Vanilla Dream</p>
          <h1>직업 선택</h1>
          <p className="muted">MVP에서는 첫 직업을 한 번만 선택할 수 있습니다.</p>
          <GameNavigation />
        </aside>

        <section className="panel content-panel">
          <p className="eyebrow">커리어 시작</p>
          <h2>첫 직업을 골라 주세요</h2>

          {isChecking && <p className="lead">현재 캐릭터 상태를 확인하고 있습니다.</p>}

          {!isChecking && character?.job && (
            <div className="placeholder-card">
              <h3>{character.name}의 직업은 이미 선택되어 있습니다.</h3>
              <p>현재 직업: {jobLabelMap[character.job]}</p>
              <div className="button-row">
                <Link className="button" href="/plaza">
                  메인 플라자로 이동
                </Link>
              </div>
            </div>
          )}

          {!isChecking && character && !character.job && (
            <>
              <p className="lead">
                {character.name}의 첫 커리어를 선택해 주세요. 현재 MVP에서는 이 선택을 다시 바꿀 수
                없습니다.
              </p>

              <div className="option-grid">
                {jobOptions.map((job) => (
                  <article key={job.value} className="choice-card">
                    <p className="eyebrow">{job.value}</p>
                    <h3>{job.label}</h3>
                    <p>{job.description}</p>
                    <p className="muted">{job.stats}</p>
                    <button
                      className="button"
                      type="button"
                      disabled={isSubmitting !== null}
                      onClick={() => handleJobSelect(job.value)}
                    >
                      {isSubmitting === job.value ? "선택 중..." : `${job.label} 선택`}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {error && <p className="form-message error">{error}</p>}
        </section>
      </main>
    </ProtectedRoute>
  );
}
