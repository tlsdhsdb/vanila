"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginAccount } from "@/features/auth/auth-api";
import { saveAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.includes("@") || password.length === 0) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginAccount({ email, password });
      saveAuthToken(response.accessToken);
      router.push("/plaza");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="panel auth-card">
        <p className="eyebrow">Public screen</p>
        <h1>로그인</h1>
        <p className="lead">Vanilla Dream 계정으로 접속해 보호된 게임 화면으로 이동합니다.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>이메일</span>
            <input
              className="input"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="form-field">
            <span>비밀번호</span>
            <input
              className="input"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              required
            />
          </label>

          {error && <p className="form-message error">{error}</p>}

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="inline-links">
          <Link href="/signup">회원가입으로 이동</Link>
          <Link href="/">랜딩으로 돌아가기</Link>
        </div>
      </section>
    </main>
  );
}

