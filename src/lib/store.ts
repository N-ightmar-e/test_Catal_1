/**
 * Lightweight client-side persistence for the active SCR design case.
 * Uses localStorage. No server needed.
 */
"use client";
import type { RequesterInfo, SCRInputs } from "@/types/scr";
import { DEFAULT_SCR_INPUTS } from "./scr/constants";

const KEY_INPUTS = "scr.inputs.v1";
const KEY_REQ = "scr.requester.v1";

export function loadInputs(): SCRInputs {
  if (typeof window === "undefined") return DEFAULT_SCR_INPUTS;
  try {
    const raw = window.localStorage.getItem(KEY_INPUTS);
    if (!raw) return DEFAULT_SCR_INPUTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SCR_INPUTS, ...parsed };
  } catch {
    return DEFAULT_SCR_INPUTS;
  }
}

export function saveInputs(v: SCRInputs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_INPUTS, JSON.stringify(v));
  } catch {
    /* ignore quota */
  }
}

const DEFAULT_REQ: RequesterInfo = {
  docNo: `SCR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`,
  docDate: new Date().toISOString().slice(0, 10),
  companyName: "주식회사 나노",
  contactPerson: "박삼식 연구소장",
  contactPhone: "",
  contactEmail: "",
  facilityType: "화력발전소 / 산업용 보일러",
  projectName: "",
};

export function loadRequester(): RequesterInfo {
  if (typeof window === "undefined") return DEFAULT_REQ;
  try {
    const raw = window.localStorage.getItem(KEY_REQ);
    if (!raw) return DEFAULT_REQ;
    return { ...DEFAULT_REQ, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REQ;
  }
}

export function saveRequester(v: RequesterInfo) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_REQ, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}
