"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { fetchJobClasses, takeJobClass } from "@/features/academy/academy-api";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { fetchCurrentCharacter, isCharacterMissingError } from "@/features/character/character-api";
import { jobLabelMap, statLabelMap } from "@/features/character/character-options";
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";
import type { CharacterResponse, JobClassResponse, TakeJobClassResponse } from "@/types/api";

export default function AcademyPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [jobClasses, setJobClasses] = useState<JobClassResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [takingClassId, setTakingClassId] = useState<number | null>(null);
  const [recentClassResult, setRecentClassResult] = useState<TakeJobClassResponse | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAcademy() {
      const token = getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentCharacter = await fetchCurrentCharacter(token);

        if (!isMounted) {
          return;
        }

        if (!currentCharacter.job) {
          router.replace("/job/select");
          return;
        }

        const classes = await fetchJobClasses(token);

        if (!isMounted) {
          return;
        }

        setCharacter(currentCharacter);
        setJobClasses(classes);
        setIsLoading(false);
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
        setIsLoading(false);
      }
    }

    loadAcademy();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleTakeClass(classId: number) {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setFeedback(null);
    setError(null);
    setTakingClassId(classId);

    try {
      const result = await takeJobClass(token, classId);
      const refreshedClasses = await fetchJobClasses(token);

      setCharacter(result.character);
      setJobClasses(refreshedClasses);
      setRecentClassResult(result);
      setIsResultDialogOpen(true);
      setFeedback(`${result.jobClass.name} 수강이 완료되었습니다. EXP +${result.rewardExp}, 비즈 -${result.spentBeads}`);
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setTakingClassId(null);
    }
  }

  return (
    <ProtectedRoute>
      <>
        <main className="game-layout">
          <aside className="panel side-panel">
            <p className="eyebrow">Vanilla Dream</p>
            <h1>아카데미</h1>
            <p className="muted">직업 수업을 듣고 EXP를 쌓아 현재 직업에 맞는 스탯을 성장시킬 수 있습니다.</p>
            <GameNavigation />
          </aside>

          <section className="panel content-panel">
            <p className="eyebrow">커리어 성장</p>
            <h2>직업 수업</h2>

            {isLoading && <p className="lead">수강 가능한 수업과 현재 상태를 불러오고 있습니다.</p>}
            {error && <p className="form-message error">{error}</p>}
            {feedback && <p className="form-message">{feedback}</p>}

            {character && (
              <>
                <div className="summary-grid">
                  <article className="summary-card">
                    <span>직업</span>
                    <strong>{character.job ? jobLabelMap[character.job] : "-"}</strong>
                  </article>
                  <article className="summary-card">
                    <span>레벨</span>
                    <strong>{character.level}</strong>
                  </article>
                  <article className="summary-card">
                    <span>EXP</span>
                    <strong>{character.exp}</strong>
                  </article>
                  <article className="summary-card">
                    <span>비즈</span>
                    <strong>{character.beads}</strong>
                  </article>
                </div>

                <div className="detail-card">
                  <header>
                    <div>
                      <h3>현재 직업 스탯</h3>
                      <p className="muted">수업을 들으면 {character.name}의 직업 스탯에 즉시 반영됩니다.</p>
                    </div>
                  </header>
                  <div className="tag-list">
                    {character.stats.map((stat) => (
                      <span key={stat.statType} className="tag-pill">
                        {statLabelMap[stat.statType]} {stat.value}
                      </span>
                    ))}
                  </div>
                </div>

                {recentClassResult && (
                  <div className="detail-card">
                    <header>
                      <div>
                        <h3>최근 수강 완료</h3>
                        <p className="muted">가장 최근에 처리된 수업 결과입니다.</p>
                      </div>
                    </header>
                    <div className="tag-list">
                      <span className="tag-pill">{recentClassResult.jobClass.name}</span>
                      <span className="tag-pill">EXP +{recentClassResult.rewardExp}</span>
                      <span className="tag-pill">비즈 -{recentClassResult.spentBeads}</span>
                      <span className="tag-pill">현재 레벨 {recentClassResult.currentLevel}</span>
                    </div>
                  </div>
                )}

                <div className="section-stack">
                  {jobClasses.map((jobClass) => {
                    const canAfford = character.beads >= jobClass.costBeads;
                    const disabled = takingClassId !== null || !jobClass.available || !canAfford;

                    return (
                      <article key={jobClass.id} className="detail-card">
                        <header>
                          <div>
                            <h3>{jobClass.name}</h3>
                            <p className="muted">
                              개방 레벨 {jobClass.unlockLevel} / 보상 EXP {jobClass.rewardExp}
                            </p>
                          </div>
                          <span className={`status-badge ${jobClass.available ? "active" : "locked"}`}>
                            {jobClass.available ? "수강 가능" : "잠김"}
                          </span>
                        </header>

                        <div className="tag-list">
                          {jobClass.statRewards.map((reward) => (
                            <span key={reward.statType} className="tag-pill">
                              {statLabelMap[reward.statType]} +{reward.rewardAmount}
                            </span>
                          ))}
                        </div>

                        <div className="split-inline">
                          <p className="muted">
                            수강 비용: {jobClass.costBeads} 비즈
                            {!canAfford ? " / 현재 비즈가 부족합니다." : ""}
                          </p>
                          <button
                            className="button"
                            type="button"
                            disabled={disabled}
                            onClick={() => handleTakeClass(jobClass.id)}
                          >
                            {takingClassId === jobClass.id ? "수강 처리 중..." : "수업 듣기"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </main>

        {isResultDialogOpen && recentClassResult && (
          <div className="overlay-backdrop" role="presentation" onClick={() => setIsResultDialogOpen(false)}>
            <section
              aria-labelledby="class-result-title"
              aria-modal="true"
              className="panel dialog-card"
              role="dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="eyebrow">수강 완료</p>
              <h2 id="class-result-title">{recentClassResult.jobClass.name}</h2>
              <p className="lead">수업 결과가 즉시 반영되었습니다.</p>

              <div className="reward-list">
                <div className="reward-row">
                  <span>차감 비즈</span>
                  <strong>-{recentClassResult.spentBeads}</strong>
                </div>
                <div className="reward-row">
                  <span>획득 EXP</span>
                  <strong>+{recentClassResult.rewardExp}</strong>
                </div>
                <div className="reward-row">
                  <span>현재 레벨</span>
                  <strong>{recentClassResult.currentLevel}</strong>
                </div>
                {recentClassResult.leveledUp && (
                  <div className="reward-row">
                    <span>레벨 업</span>
                    <strong>
                      {recentClassResult.previousLevel} → {recentClassResult.currentLevel}
                    </strong>
                  </div>
                )}
              </div>

              <div className="tag-list">
                {recentClassResult.jobClass.statRewards.map((reward) => (
                  <span key={reward.statType} className="tag-pill">
                    {statLabelMap[reward.statType]} +{reward.rewardAmount}
                  </span>
                ))}
              </div>

              <div className="button-row">
                <button className="button" type="button" onClick={() => setIsResultDialogOpen(false)}>
                  확인
                </button>
              </div>
            </section>
          </div>
        )}
      </>
    </ProtectedRoute>
  );
}
