"use client";
import type { AgingResults } from "@/lib/scr/aging";
import type { RequesterInfo, SCRInputs, SCRResults } from "@/types/scr";

function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e5 || abs < 1e-3) return n.toExponential(3);
  return n.toLocaleString("ko-KR", { maximumSignificantDigits: digits });
}

export function ReportSheet({
  req,
  inp,
  res,
  aging,
  agingInputs,
}: {
  req: RequesterInfo;
  inp: SCRInputs;
  res: SCRResults;
  aging?: AgingResults;
  agingInputs?: { fuelSulfurPct: number; dustLoadGNm3: number; minActivityFraction: number };
}) {
  return (
    <article className="report-sheet">
      <h1>탈질촉매 설계 의뢰서</h1>
      <h2>DeNOx Catalyst Design Specification Sheet</h2>

      <div className="report-meta">
        <span>
          <strong>문서번호 :</strong> {req.docNo}
        </span>
        <span>
          <strong>작성일 :</strong> {req.docDate}
        </span>
      </div>

      {/* 1. 의뢰자 */}
      <h3>1. 의뢰자 정보 (Requester)</h3>
      <table>
        <tbody>
          <tr>
            <th>회사명</th>
            <td>{req.companyName || "—"}</td>
            <th>프로젝트명</th>
            <td>{req.projectName || "—"}</td>
          </tr>
          <tr>
            <th>담당자</th>
            <td>{req.contactPerson || "—"}</td>
            <th>설비 구분</th>
            <td>{req.facilityType || "—"}</td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>{req.contactPhone || "—"}</td>
            <th>E-mail</th>
            <td>{req.contactEmail || "—"}</td>
          </tr>
        </tbody>
      </table>

      {/* 2. 입력값 */}
      <h3>2. 설계 입력값 (Design Input)</h3>
      <table>
        <tbody>
          <tr>
            <th>유량 (표준)</th>
            <td className="num">
              {fmt(inp.flowNm3h)} Nm³/h
            </td>
            <th>운전 온도</th>
            <td className="num">{fmt(inp.tempC)} °C</td>
          </tr>
          <tr>
            <th>절대 압력</th>
            <td className="num">{fmt(inp.pressureKpa)} kPa</td>
            <th>입구 NOx</th>
            <td className="num">{fmt(inp.noxInPpm)} ppm</td>
          </tr>
          <tr>
            <th>O₂ 농도</th>
            <td className="num">{fmt(inp.o2VolPct)} vol%</td>
            <th>H₂O 농도</th>
            <td className="num">{fmt(inp.h2oVolPct)} vol%</td>
          </tr>
          <tr>
            <th>NOx 제거 목표</th>
            <td className="num">{fmt(inp.noxRemovalPct)} %</td>
            <th>NH₃ slip 허용</th>
            <td className="num">{fmt(inp.nh3SlipPpm)} ppm</td>
          </tr>
        </tbody>
      </table>

      {/* 3. 촉매 사양 */}
      <h3>3. 촉매 사양 (Catalyst Specification)</h3>
      <table>
        <tbody>
          <tr>
            <th>촉매 형태</th>
            <td>Honeycomb · V₂O₅-WO₃/TiO₂ (압출)</td>
            <th>V₂O₅ 담지량</th>
            <td className="num">{fmt(inp.v2o5WtPct)} wt%</td>
          </tr>
          <tr>
            <th>피치 (pitch)</th>
            <td className="num">{fmt(inp.pitchMm)} mm</td>
            <th>격벽 두께</th>
            <td className="num">{fmt(inp.wallThicknessMm)} mm</td>
          </tr>
          <tr>
            <th>셀 밀도</th>
            <td className="num">{fmt(res.cpsi)} CPSI</td>
            <th>개구율 OFA</th>
            <td className="num">{fmt(res.openFrontalArea * 100)} %</td>
          </tr>
          <tr>
            <th>촉매 활성도 K</th>
            <td className="num">{fmt(inp.activityK)} m/h</td>
            <th>모듈 규격 (W×H×L)</th>
            <td className="num">
              {inp.moduleWidthMm} × {inp.moduleHeightMm} × {inp.moduleLengthMm}{" "}
              mm
            </td>
          </tr>
        </tbody>
      </table>

      {/* 4. 계산 결과 */}
      <h3>4. 계산 결과 (Calculation Results)</h3>
      <table>
        <tbody>
          <tr>
            <th>α (NH₃/NOx 몰비)</th>
            <td className="num">{fmt(res.alpha)}</td>
            <th>NH₃ 주입율</th>
            <td className="num">{fmt(res.nh3RateKgh)} kg/h</td>
          </tr>
          <tr>
            <th>면속도 AV</th>
            <td className="num">{fmt(res.areaVelocity)} m/h</td>
            <th>공간속도 SV</th>
            <td className="num">{fmt(res.spaceVelocity)} h⁻¹</td>
          </tr>
          <tr>
            <th>GHSV</th>
            <td className="num">{fmt(res.ghsv)} h⁻¹</td>
            <th>접근 선속도 LV</th>
            <td className="num">{fmt(res.linearVelocityMs)} m/s</td>
          </tr>
          <tr>
            <th>실 운전 유량</th>
            <td className="num">{fmt(res.actualFlowM3h)} m³/h</td>
            <th>촉매 체적</th>
            <td className="num">{fmt(res.volumeCatalystM3)} m³</td>
          </tr>
          <tr>
            <th>정면 단면적</th>
            <td className="num">{fmt(res.frontalAreaM2)} m²</td>
            <th>촉매 길이</th>
            <td className="num">{fmt(res.catalystLengthM)} m</td>
          </tr>
          <tr>
            <th>총 모듈수</th>
            <td className="num">
              {res.totalModules} EA ({res.modulesPerLayer} EA × {res.numberOfLayers} 층)
            </td>
            <th>압력손실 ΔP</th>
            <td className="num">
              {fmt(res.pressureDropPa)} Pa / {fmt(res.pressureDropMmH2O)} mmH₂O
            </td>
          </tr>
          <tr>
            <th>SO₂→SO₃ 변환율</th>
            <td className="num">{fmt(res.so2ToSo3ConvPct)} %</td>
            <th>유효 제거율 η_eff</th>
            <td className="num">{fmt(res.effectiveRemoval * 100)} %</td>
          </tr>
        </tbody>
      </table>

      {/* 5. 수명 / 열화 */}
      {aging && (
        <>
          <h3>5. 예상 수명 / 열화 (Expected Life &amp; Deactivation)</h3>
          <table>
            <tbody>
              <tr>
                <th>열화 상수 k_d</th>
                <td className="num">{fmt(aging.deactivationRatePerYear)} 1/yr</td>
                <th>예상 수명</th>
                <td className="num">{fmt(aging.estimatedLifeYears)} 년</td>
              </tr>
              <tr>
                <th>K(1년)</th>
                <td className="num">{fmt(aging.kAtYears[0].k)} m/h</td>
                <th>K(3년)</th>
                <td className="num">{fmt(aging.kAtYears[2].k)} m/h</td>
              </tr>
              <tr>
                <th>K(5년)</th>
                <td className="num">{fmt(aging.kAtYears[3].k)} m/h</td>
                <th>K_min / K₀</th>
                <td className="num">
                  {agingInputs ? fmt(agingInputs.minActivityFraction) : "—"}
                </td>
              </tr>
              {agingInputs && (
                <tr>
                  <th>연료 황분</th>
                  <td className="num">{fmt(agingInputs.fuelSulfurPct)} wt%</td>
                  <th>분진 부하</th>
                  <td className="num">{fmt(agingInputs.dustLoadGNm3)} g/Nm³</td>
                </tr>
              )}
              {aging.notes.length > 0 && (
                <tr>
                  <th>열화 유의사항</th>
                  <td colSpan={3}>
                    <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                      {aging.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* 6. 설계 의견 */}
      <h3>{aging ? "6" : "5"}. 설계 의견 (Design Notes)</h3>
      <table>
        <tbody>
          <tr>
            <th>온도창</th>
            <td>{res.temperatureWindowNote}</td>
          </tr>
          <tr>
            <th>설계 여유</th>
            <td>{res.designMarginNote}</td>
          </tr>
          {res.warnings.length > 0 && (
            <tr>
              <th>경고 / 유의사항</th>
              <td>
                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                  {res.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 7. 승인 */}
      <h3>{aging ? "7" : "6"}. 승인 (Approvals)</h3>
      <div className="sign-block">
        <div>
          <div className="sign-title">작성 (Prepared)</div>
        </div>
        <div>
          <div className="sign-title">검토 (Reviewed) — 연구소장</div>
        </div>
        <div>
          <div className="sign-title">승인 (Approved)</div>
        </div>
      </div>

      <div
        style={{
          marginTop: "10pt",
          fontSize: "9pt",
          color: "#555",
          borderTop: "0.5pt solid #999",
          paddingTop: "6pt",
        }}
      >
        본 의뢰서는 V₂O₅-WO₃/TiO₂ 허니컴 SCR 촉매 1차 플러그흐름 근사 및 정사각
        채널 기하 공식에 기반한 계산 결과입니다. 실제 적용 전 현장 조건(피독,
        열화, 분진, SO₃ 응축 등)을 고려한 현업 검토가 필요합니다. · SCR-CALC v0.1
      </div>
    </article>
  );
}
