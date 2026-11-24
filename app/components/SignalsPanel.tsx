"use client";

import { motion } from "motion/react";
import type { IdentifyResult } from "@/lib/signals";
import { shortId } from "@/lib/signals";

type Props = {
  result: IdentifyResult | null;
  loading: boolean;
  onSignalHover: () => void;
  onClose: () => void;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SignalsPanel({ result, loading, onSignalHover, onClose }: Props) {
  const confidence = result?.confidence != null ? Math.max(0, Math.min(1, result.confidence)) : null;
  return (
    <motion.aside
      id="signals-panel"
      className="panel"
      variants={stagger}
      initial="hidden"
      animate={result ? "show" : "hidden"}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
    >
      <button type="button" className="panel-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <motion.div variants={item} className="panel-row">
        <span className="label">Visitor ID</span>
        <span className="mono id">{loading ? "identifying…" : shortId(result?.visitorId ?? null)}</span>
      </motion.div>

      <motion.div variants={item} className="panel-row confidence">
        <span className="label">Confidence</span>
        <span className="confidence-read">
          <span className="mono">{confidence != null ? `${(confidence * 100).toFixed(1)}%` : "—"}</span>
          <span className="confidence-bar" aria-hidden="true">
            <span className="confidence-fill" style={{ width: confidence != null ? `${confidence * 100}%` : "0%" }} />
          </span>
        </span>
      </motion.div>

      {(result?.ipCity || result?.ipCountry) && (
        <motion.div variants={item} className="panel-row">
          <span className="label">Location</span>
          <span className="mono">{[result?.ipCity, result?.ipCountry].filter(Boolean).join(", ")}</span>
        </motion.div>
      )}

      <motion.div variants={item} className="divider" />

      <motion.div variants={item} className="label small-caps">Smart Signals</motion.div>
      <div className="chips">
        {(result?.signals ?? placeholderSignals).map((s) => (
          <motion.div
            key={s.key}
            variants={item}
            className={`chip chip-${s.tone}`}
            onMouseEnter={onSignalHover}
          >
            <span className="dot" />
            <span>{s.label}</span>
            <span className="chip-val mono">
              {s.value === null ? "—" : s.value ? "yes" : "no"}
            </span>
          </motion.div>
        ))}
      </div>

      {result && !result.enriched && (
        <motion.p variants={item} className="note">
          {result.note ?? "Add a secret key for live Smart Signals."}
        </motion.p>
      )}

    </motion.aside>
  );
}

const placeholderSignals = [
  { key: "bot", label: "Automation", value: null, tone: "neutral" as const },
  { key: "incognito", label: "Incognito", value: null, tone: "neutral" as const },
  { key: "vpn", label: "VPN", value: null, tone: "neutral" as const },
  { key: "proxy", label: "Proxy", value: null, tone: "neutral" as const },
  { key: "tampering", label: "Tampering", value: null, tone: "neutral" as const },
];
