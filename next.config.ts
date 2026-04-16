import type { NextConfig } from "next";

/**
 * GitHub Pages (repo-site) 배포용 설정.
 * URL: https://<user>.github.io/test_Catal_1/
 *
 *  · output: 'export'       → `next build` 시 `out/` 에 정적 HTML 생성
 *  · trailingSlash: true    → /calculator/index.html 형태로 발행 (Pages 호환)
 *  · images.unoptimized     → 정적 export는 기본 loader 불가
 *  · basePath/assetPrefix   → 서브패스 /test_Catal_1 에서 asset 경로 해결
 *
 * CI에서 NEXT_PUBLIC_BASE_PATH 환경변수로 basePath를 주입합니다.
 */
const repo = "test_Catal_1";
const isProd = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : "",
  },
};

export default nextConfig;
