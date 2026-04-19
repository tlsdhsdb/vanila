import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="panel auth-card">
        <p className="eyebrow">Public screen</p>
        <h1>회원가입</h1>
        <p className="lead">초기 계정 생성 폼 자리만 먼저 마련하고 검증 로직은 다음 단계로 넘깁니다.</p>

        <form className="form-stack">
          <label className="form-field">
            <span>이메일</span>
            <input className="input" name="email" type="email" placeholder="you@example.com" />
          </label>
          <label className="form-field">
            <span>비밀번호</span>
            <input className="input" name="password" type="password" placeholder="password" />
          </label>
          <label className="form-field">
            <span>비밀번호 확인</span>
            <input
              className="input"
              name="passwordConfirm"
              type="password"
              placeholder="password"
            />
          </label>
          <button className="button" type="button">
            회원가입
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

