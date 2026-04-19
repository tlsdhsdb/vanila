"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { signupAccount } from "@/features/auth/auth-api";
import { saveAuthToken } from "@/features/auth/auth-storage";
import { getApiErrorMessage } from "@/lib/api-client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signupAccount({ email, username, password });
      saveAuthToken(response.accessToken);
      router.push("/character/create");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function validateForm() {
    if (!email.includes("@")) {
      return "올바른 이메일을 입력해 주세요.";
    }

    if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
      return "username은 3~20자의 영문, 숫자, 밑줄만 사용할 수 있습니다.";
    }

    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }

    if (password !== passwordConfirm) {
      return "비밀번호 확인이 일치하지 않습니다.";
    }

    return null;
  }

  return (
    <main className="auth-page">
      <section className="panel auth-card">
        <p className="eyebrow">Public screen</p>
        <h1>회원가입</h1>
        <p className="lead">계정을 만든 뒤 캐릭터 생성 화면으로 이동합니다.</p>

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
            <span>Username</span>
            <input
              className="input"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="vanilla_player"
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
          <label className="form-field">
            <span>비밀번호 확인</span>
            <input
              className="input"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="password"
              required
            />
          </label>

          {error && <p className="form-message error">{error}</p>}

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="inline-links">
          <Link href="/login">로그인으로 이동</Link>
          <Link href="/">랜딩으로 돌아가기</Link>
        </div>
      </section>
    </main>
  );
}

