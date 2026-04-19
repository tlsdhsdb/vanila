"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/protected-route";
import {
  createCharacter,
  fetchCurrentCharacter,
  isCharacterMissingError,
} from "@/features/character/character-api";
import {
  facePresetOptions,
  hairColorOptions,
  hairStyleOptions,
  skinToneOptions,
} from "@/features/character/character-options";
import { clearAuthToken, getAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage } from "@/lib/api-client";
import type { FacePreset, HairColor, HairStyle, SkinTone } from "@/types/api";

export default function CharacterCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [skinTone, setSkinTone] = useState<SkinTone>("LIGHT");
  const [hairStyle, setHairStyle] = useState<HairStyle>("BOB");
  const [hairColor, setHairColor] = useState<HairColor>("BROWN");
  const [facePreset, setFacePreset] = useState<FacePreset>("SOFT");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }
    const authToken = token;

    async function checkExistingCharacter() {
      try {
        const character = await fetchCurrentCharacter(authToken);

        if (!isMounted) {
          return;
        }

        router.replace(character.job ? "/plaza" : "/job/select");
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (isCharacterMissingError(caughtError)) {
          setIsChecking(false);
          return;
        }

        clearAuthToken();
        router.replace("/login");
      }
    }

    checkExistingCharacter();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("캐릭터 이름은 2자 이상 입력해 주세요.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      await createCharacter(token, {
        name: name.trim(),
        skinTone,
        hairStyle,
        hairColor,
        facePreset,
      });
      router.push("/job/select");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="auth-page">
        <section className="panel auth-card">
          <p className="eyebrow">Character setup</p>
          <h1>캐릭터 생성</h1>
          <p className="lead">
            Vanilla Dream에 도착한 첫 캐릭터를 만들고, 다음 단계에서 직업을 선택합니다.
          </p>

          {isChecking ? (
            <p className="form-message">캐릭터 상태를 확인하는 중입니다.</p>
          ) : (
            <form className="form-stack" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>이름</span>
                <input
                  className="input"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Lina"
                  minLength={2}
                  maxLength={20}
                  required
                />
              </label>

              <label className="form-field">
                <span>피부 톤</span>
                <select
                  className="input"
                  value={skinTone}
                  onChange={(event) => setSkinTone(event.target.value as SkinTone)}
                >
                  {skinToneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>헤어 스타일</span>
                <select
                  className="input"
                  value={hairStyle}
                  onChange={(event) => setHairStyle(event.target.value as HairStyle)}
                >
                  {hairStyleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>헤어 컬러</span>
                <select
                  className="input"
                  value={hairColor}
                  onChange={(event) => setHairColor(event.target.value as HairColor)}
                >
                  {hairColorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>얼굴 프리셋</span>
                <select
                  className="input"
                  value={facePreset}
                  onChange={(event) => setFacePreset(event.target.value as FacePreset)}
                >
                  {facePresetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {error && <p className="form-message error">{error}</p>}

              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "캐릭터 생성"}
              </button>
            </form>
          )}

          <div className="inline-links">
            <Link href="/plaza">메인 플라자로 이동</Link>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
