import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="panel auth-card">
        <p className="eyebrow">Public screen</p>
        <h1>로그인</h1>
        <p className="lead">step02 인증 구현에서 실제 로그인 API와 연결될 화면 골격입니다.</p>

        <form className="form-stack">
          <label className="form-field">
            <span>이메일</span>
            <input className="input" name="email" type="email" placeholder="you@example.com" />
          </label>
          <label className="form-field">
            <span>비밀번호</span>
            <input className="input" name="password" type="password" placeholder="password" />
          </label>
          <button className="button" type="button">
            로그인
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

