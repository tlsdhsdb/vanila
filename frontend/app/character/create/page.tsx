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
import { getApiErrorMessage, isAuthenticationError } from "@/lib/api-client";
import type { FacePreset, HairColor, HairStyle, SkinTone } from "@/types/api";

export default function CharacterCreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [skinTone, setSkinTone] = useState<SkinTone>("LIGHT");
  const [hairStyle, setHairStyle] = useState<HairStyle>("BOB");
  const [hairColor, setHairColor] = useState<HairColor>("BROWN");
  const [facePreset, setFacePreset] = useState<FacePreset>("SOFT");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

        if (isAuthenticationError(caughtError)) {
          clearAuthToken();
          router.replace("/login");
          return;
        }

        setLoadError(getApiErrorMessage(caughtError));
        setIsChecking(false);
      }
    }

    checkExistingCharacter();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (name.trim().length < 2) {
      setSubmitError("캐릭터 이름은 2자 이상 입력해 주세요.");
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
      setSubmitError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="auth-page">
        <section className="panel auth-card">
          <p className="eyebrow">캐릭터 설정</p>
          <h1>캐릭터 생성</h1>
          <p className="lead">
            첫 캐릭터를 만들고, 다음 단계에서 직업을 선택해 본격적인 진행을 시작합니다.
          </p>

          {isChecking ? (
            <p className="form-message">이미 생성된 캐릭터가 있는지 확인하고 있습니다.</p>
          ) : loadError ? (
            <p className="form-message error">{loadError}</p>
          ) : (
            <form className="form-stack" onSubmit={handleSubmit}>
              <label className="form-field">
                <span>이름</span>
                <input
                  className="input"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="리나"
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

              {submitError && <p className="form-message error">{submitError}</p>}

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
