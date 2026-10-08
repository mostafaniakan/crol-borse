"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { KNOWLEDGE_BASE_VERSION, LEARNING_TERMS, findLearningTerms, type LearningCategory, type LearningTerm } from "../../lib/learning/knowledge-base";
import { TermHelp } from "../../components/learning/term-help";

const categories: { id?: LearningCategory; label: string }[] = [
  { label: "همه" },
  { id: "fundamental", label: "بنیادی" },
  { id: "technical", label: "تکنیکال" },
  { id: "risk", label: "ریسک" },
  { id: "market", label: "بازار" },
  { id: "data", label: "داده" },
];

function FormulaWithHelp({ formula }: { formula: string }) {
  const parts = formula.split(/(P\/E|EPS|RSI|RS|SMA)/g);
  const ids: Record<string, string> = { "P/E": "pe", EPS: "eps", RSI: "rsi", RS: "rsi", SMA: "sma" };
  return <code>{parts.map((part, index) => ids[part] ? <TermHelp key={`${part}-${index}`} termId={ids[part]} label={part} compact/> : <span key={`${part}-${index}`}>{part}</span>)}</code>;
}

function TermDetail({ term }: { term: LearningTerm }) {
  return <article className="learning-detail"><div className="learning-detail-head"><div><span className="learning-category">{term.category}</span><h2>{term.faName}</h2><p>{term.enName} · {term.aliases.join("، ")}</p></div><span className="learning-badge"><ShieldCheck size={14}/> پایگاه دانش نسخه {KNOWLEDGE_BASE_VERSION}</span></div><section className="learning-block"><h3>توضیح مبتدی</h3><p>{term.beginner}</p></section><section className="learning-block"><h3>توضیح پیشرفته</h3><p>{term.advanced}</p></section>{term.formula && <section className="learning-formula"><h3>فرمول و متغیرها</h3><FormulaWithHelp formula={term.formula}/><small>روی متغیرهای قابل توضیح کلیک کنید.</small></section>}<section className="learning-block"><h3>مثال عددی <span className="example-tag">{term.example.label}</span></h3><p>{term.example.setup}</p><ol>{term.example.steps.map((step) => <li key={step}>{step}</li>)}</ol><strong>{term.example.result}</strong></section><div className="learning-columns"><section className="learning-block"><h3>تفسیر</h3><ul>{term.interpretation.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="learning-block"><h3>محدودیت و خطاهای رایج</h3><ul>{term.limitations.map((item) => <li key={item}>{item}</li>)}</ul></section></div><section className="learning-block learning-ranking"><h3>ارتباط با رتبه بندی ۱۰۰ سهم</h3><p>{term.rankingImpact}</p></section><section className="learning-block"><h3>منابع مطالعه</h3><ul className="learning-sources">{term.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={12}/></a></li>)}</ul></section></article>;
}

export default function LearningAssistantPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LearningCategory>();
  const [selectedId, setSelectedId] = useState(LEARNING_TERMS[0]?.id ?? "");
  const terms = useMemo(() => findLearningTerms(query, category), [query, category]);
  const selected = terms.find((term) => term.id === selectedId) ?? terms[0] ?? LEARNING_TERMS[0];

  return <main className="learning-page" dir="rtl"><header className="learning-header"><Link href="/dashboard" className="learning-back">بازگشت به داشبورد</Link><div className="learning-title-row"><div><span className="learning-kicker"><BookOpen size={15}/> دستیار یادگیری بورس</span><h1>هر اصطلاح را همان جا یاد بگیر</h1><p>تعریف ساده، فرمول، مثال، محدودیت و ارتباط با رتبه بندی در یک پایگاه دانش نسخه بندی شده.</p></div><span className="learning-version">نسخه {KNOWLEDGE_BASE_VERSION}</span></div><div className="learning-search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجوی نام فارسی، انگلیسی یا مخفف..." aria-label="جستجوی اصطلاحات"/></div><div className="learning-categories">{categories.map((item) => <button type="button" key={item.label} className={category === item.id ? "active" : !category && !item.id ? "active" : ""} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div></header><section className="learning-layout"><aside className="learning-list"><div className="learning-list-head"><strong>فرهنگ لغت بورس</strong><span>{terms.length} اصطلاح</span></div>{terms.map((term) => <button type="button" key={term.id} className={selected?.id === term.id ? "selected" : ""} onClick={() => setSelectedId(term.id)}><span><b>{term.faName}</b><small>{term.enName}</small></span><i>?</i></button>)}{!terms.length && <div className="learning-no-results">اصطلاحی با این جستجو پیدا نشد.</div>}</aside><section className="learning-detail-wrap">{selected ? <TermDetail term={selected}/> : <div className="learning-no-results">یک اصطلاح را انتخاب کنید.</div>}</section></section></main>;
}
