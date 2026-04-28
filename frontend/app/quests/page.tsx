"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { GameNavigation } from "@/components/game-navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { fetchCurrentCharacter, isCharacterMissingError } from "@/features/character/character-api";
import { claimQuestReward, fetchAllQuests } from "@/features/quests/quest-api";
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";
import type { CharacterResponse, QuestProgressOverviewResponse, QuestResponse } from "@/types/api";

const questStatusLabel: Record<QuestResponse["status"], string> = {
  LOCKED: "잠김",
  ACTIVE: "진행 중",
  COMPLETED: "보상 대기",
  CLAIMED: "수령 완료",
};

function buildQuestProgressOverview(
  character: CharacterResponse,
  quests: QuestResponse[],
): QuestProgressOverviewResponse {
  return {
    totalCount: quests.length,
    activeCount: quests.filter((quest) => quest.status === "ACTIVE").length,
    completedCount: quests.filter((quest) => quest.status === "COMPLETED").length,
    claimedCount: quests.filter((quest) => quest.status === "CLAIMED").length,
    lockedCount: quests.filter((quest) => quest.status === "LOCKED").length,
    currentLevel: character.level,
    currentExp: character.exp,
  };
}

function selectVisibleQuests(quests: QuestResponse[]) {
  return quests.filter((quest) => quest.status === "ACTIVE" || quest.status === "COMPLETED");
}

export default function QuestsPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [activeQuests, setActiveQuests] = useState<QuestResponse[]>([]);
  const [allQuests, setAllQuests] = useState<QuestResponse[]>([]);
  const [progress, setProgress] = useState<QuestProgressOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingQuestId, setClaimingQuestId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadQuests() {
      const token = getAuthToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [currentCharacter, nextAllQuests] = await Promise.all([
          fetchCurrentCharacter(token),
          fetchAllQuests(token),
        ]);

        if (!isMounted) {
          return;
        }

        if (!currentCharacter.job) {
          router.replace("/job/select");
          return;
        }

        setCharacter(currentCharacter);
        setAllQuests(nextAllQuests);
        setActiveQuests(selectVisibleQuests(nextAllQuests));
        setProgress(buildQuestProgressOverview(currentCharacter, nextAllQuests));
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

    loadQuests();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleClaim(questId: number) {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setClaimingQuestId(questId);
    setFeedback(null);
    setError(null);

    try {
      const result = await claimQuestReward(token, questId);
      const nextAllQuests = await fetchAllQuests(token);

      setCharacter(result.character);
      setAllQuests(nextAllQuests);
      setActiveQuests(selectVisibleQuests(nextAllQuests));
      setProgress(buildQuestProgressOverview(result.character, nextAllQuests));
      setFeedback(
        `${result.quest.title} 보상을 수령했습니다. 비즈 +${result.rewardBeads}, EXP +${result.rewardExp}${
          result.rewardTitle ? `, 칭호 "${result.rewardTitle}" 획득` : ""
        }`,
      );
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setClaimingQuestId(null);
    }
  }

  const completedHistory = allQuests.filter((quest) => quest.status === "CLAIMED");

  return (
    <ProtectedRoute>
      <main className="game-layout">
        <aside className="panel side-panel">
          <p className="eyebrow">Vanilla Dream</p>
          <h1>퀘스트 저널</h1>
          <p className="muted">활성 퀘스트, 보상 수령 상태, 전체 진행도를 확인할 수 있습니다.</p>
          <GameNavigation />
        </aside>

        <section className="panel content-panel">
          <p className="eyebrow">진행 기록</p>
          <h2>퀘스트 현황</h2>

          {isLoading && <p className="lead">현재 퀘스트 진행 상태를 불러오고 있습니다.</p>}
          {error && <p className="form-message error">{error}</p>}
          {feedback && <p className="form-message">{feedback}</p>}

          {character && progress && (
            <>
              <div className="summary-grid">
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
                <article className="summary-card">
                  <span>수령 완료</span>
                  <strong>{progress.claimedCount}</strong>
                </article>
              </div>

              <div className="detail-card">
                <header>
                  <div>
                    <h3>진행 요약</h3>
                    <p className="muted">{character.name}님의 현재 퀘스트 분포입니다.</p>
                  </div>
                </header>
                <div className="tag-list">
                  <span className="tag-pill">진행 중 {progress.activeCount}</span>
                  <span className="tag-pill">보상 대기 {progress.completedCount}</span>
                  <span className="tag-pill">잠김 {progress.lockedCount}</span>
                  <span className="tag-pill">전체 {progress.totalCount}</span>
                </div>
              </div>

              <div className="section-stack">
                <div className="detail-card">
                  <header>
                    <div>
                      <h3>활성 / 보상 대기 퀘스트</h3>
                      <p className="muted">지금 바로 진행하거나 보상을 받을 수 있는 퀘스트입니다.</p>
                    </div>
                  </header>

                  <div className="detail-stack">
                    {activeQuests.map((quest) => (
                      <article key={quest.id} className="detail-card nested">
                        <header>
                          <div>
                            <h3>{quest.title}</h3>
                            <p className="muted">{quest.description}</p>
                          </div>
                          <span className={`status-badge ${quest.status.toLowerCase()}`}>
                            {questStatusLabel[quest.status]}
                          </span>
                        </header>

                        <div className="split-inline">
                          <p className="muted">
                            진행도 {Math.min(quest.progressCount, quest.requiredCount)} / {quest.requiredCount}
                          </p>
                          <p className="muted">
                            보상: 비즈 +{quest.rewardBeads}, EXP +{quest.rewardExp}
                          </p>
                        </div>

                        {quest.claimable && (
                          <button
                            className="button"
                            type="button"
                            disabled={claimingQuestId !== null}
                            onClick={() => handleClaim(quest.id)}
                          >
                            {claimingQuestId === quest.id ? "수령 중..." : "보상 받기"}
                          </button>
                        )}
                      </article>
                    ))}

                    {activeQuests.length === 0 && (
                      <p className="muted">현재 진행 중인 퀘스트가 없습니다.</p>
                    )}
                  </div>
                </div>

                <div className="detail-card">
                  <header>
                    <div>
                      <h3>수령 완료 기록</h3>
                      <p className="muted">이미 완료하고 보상까지 받은 퀘스트 목록입니다.</p>
                    </div>
                  </header>

                  <div className="detail-stack">
                    {completedHistory.map((quest) => (
                      <article key={quest.id} className="detail-card nested">
                        <header>
                          <div>
                            <h3>{quest.title}</h3>
                            <p className="muted">{quest.description}</p>
                          </div>
                          <span className="status-badge claimed">{questStatusLabel[quest.status]}</span>
                        </header>
                        <p className="muted">보상: 비즈 +{quest.rewardBeads}, EXP +{quest.rewardExp}</p>
                      </article>
                    ))}

                    {completedHistory.length === 0 && (
                      <p className="muted">아직 보상을 모두 수령한 퀘스트는 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
