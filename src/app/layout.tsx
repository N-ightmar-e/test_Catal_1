import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCR 탈질촉매 설계 계산기 | 박삼식 박사 연구소",
  description:
    "V₂O₅-WO₃/TiO₂ 허니컴 탈질촉매 설계 계산 및 설계 의뢰서 작성 도구.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="no-print border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="text-lg font-bold text-[var(--accent)] tracking-tight">
                SCR-CALC
              </span>
              <span className="text-sm text-[var(--muted)]">
                탈질촉매 설계 계산기
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-[var(--accent)]">
                개요
              </Link>
              <Link href="/methods" className="hover:text-[var(--accent)]">
                설계 방식
              </Link>
              <Link href="/quick" className="hover:text-[var(--accent)]">
                대략 계산
              </Link>
              <Link
                href="/calculator"
                className="hover:text-[var(--accent)] font-medium"
              >
                세부 계산
              </Link>
              <Link href="/data-old" className="hover:text-[var(--accent)]">
                Data_old
              </Link>
              <Link href="/report" className="hover:text-[var(--accent)]">
                설계 의뢰서
              </Link>
              <Link href="/about" className="hover:text-[var(--accent)]">
                수식·참고문헌
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t border-[var(--border)] bg-[var(--surface)] mt-12">
          <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-[var(--muted)] flex justify-between">
            <span>
              SCR-CALC · V₂O₅-WO₃/TiO₂ Honeycomb DeNOx · Build 2026.04.17
            </span>
            <span>
              개인 사용자 전용 · 계산 결과는 참고용이며 최종 설계는 현업 검토
              필요
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
