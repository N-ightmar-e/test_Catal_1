"use client";
import { useRef } from "react";
import { DEFAULT_SCR_INPUTS } from "@/lib/scr/constants";
import type { SCRInputs } from "@/types/scr";

interface CaseJSON {
  app: "scr-calculator";
  version: 1;
  savedAt: string;
  label?: string;
  inputs: SCRInputs;
}

/**
 * Save the current inputs as a timestamped JSON file.
 * Load inputs by selecting a previously saved .json file.
 */
export function CaseIO({
  inputs,
  onLoad,
}: {
  inputs: SCRInputs;
  onLoad: (next: SCRInputs) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function saveJson() {
    const label =
      typeof window !== "undefined"
        ? window.prompt("케이스 라벨 (선택, 파일명에 포함됩니다):", "")
        : "";
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const payload: CaseJSON = {
      app: "scr-calculator",
      version: 1,
      savedAt: now.toISOString(),
      label: label ?? undefined,
      inputs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const labelSuffix = label ? `-${label.replace(/\s+/g, "_")}` : "";
    a.href = url;
    a.download = `scr-case-${ts}${labelSuffix}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function pickFile() {
    fileInputRef.current?.click();
  }

  async function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text) as Partial<CaseJSON>;
      if (parsed.app !== "scr-calculator" || typeof parsed.inputs !== "object") {
        alert("올바른 SCR-CALC 케이스 파일이 아닙니다.");
        return;
      }
      // Merge defaults with loaded data for forward compatibility
      onLoad({ ...DEFAULT_SCR_INPUTS, ...(parsed.inputs as SCRInputs) });
    } catch (err) {
      console.error(err);
      alert(`파일을 읽을 수 없습니다: ${(err as Error).message}`);
    } finally {
      // Clear so the same file can be re-selected
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={saveJson}
        className="border border-[var(--border-strong)] px-3 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
        title="현재 입력값을 JSON 파일로 저장"
      >
        케이스 저장 (JSON)
      </button>
      <button
        type="button"
        onClick={pickFile}
        className="border border-[var(--border-strong)] px-3 py-2 text-sm rounded-sm hover:bg-[var(--accent-soft)]"
        title="저장한 JSON 케이스 불러오기"
      >
        케이스 불러오기
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={loadFile}
      />
    </div>
  );
}
