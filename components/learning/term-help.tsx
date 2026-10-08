"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { getLearningTerm } from "../../lib/learning/knowledge-base";

type TermHelpProps = {
  termId: string;
  label?: string;
  compact?: boolean;
};

export function TermHelp({ termId, label, compact = false }: TermHelpProps) {
  const [open, setOpen] = useState(false);
  const term = getLearningTerm(termId);
  if (!term) return label ? <span>{label}</span> : null;

  return <span className={`term-help ${compact ? "term-help-compact" : ""}`}>
    <span>{label ?? term.faName}</span>
    <button type="button" className="term-help-button" aria-label={`توضیح ${term.faName}`} onClick={() => setOpen((value) => !value)}>?</button>
    {open && <span className="term-help-popover" role="dialog" aria-label={`دستیار یادگیری: ${term.faName}`}>
      <span className="term-help-popover-head"><strong>{term.faName}</strong><button type="button" aria-label="بستن توضیح" onClick={() => setOpen(false)}><X size={13}/></button></span>
      <span className="term-help-en">{term.enName}</span>
      <span className="term-help-level"><b>مبتدی</b>{term.beginner}</span>
      <span className="term-help-level"><b>پیشرفته</b>{term.advanced}</span>
      {term.formula && <span className="term-help-formula"><BookOpen size={12}/><code>{term.formula}</code></span>}
      <span className="term-help-example"><b>مثال {term.example.label}</b>{term.example.result}</span>
      <span className="term-help-footer"><Link href="/learning-assistant">مطالعه کامل در دستیار یادگیری</Link>{term.sources[0] && <a href={term.sources[0].url} target="_blank" rel="noreferrer"><ExternalLink size={11}/> منبع</a>}</span>
    </span>}
  </span>;
}
