"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CLASS_META, FILTERS, PAIRS, TAG_LABEL } from "@/lib/catalog";
import { STATUSES } from "@/lib/statuses";

function classOf(item) {
  return Math.floor(item.code / 100);
}

function knownFilter(value) {
  return value === "unofficial" || /^[1-5]$/.test(value || "");
}

function countFor(filter) {
  if (filter === "all") return STATUSES.length;
  if (filter === "unofficial") return STATUSES.filter((item) => !item.official).length;
  return STATUSES.filter((item) => item.official && classOf(item) === Number(filter)).length;
}

function haystack(item) {
  return [
    item.code,
    item.name,
    item.summary,
    item.detail,
    item.when,
    item.note,
    item.spec,
    item.specFull,
    ...(item.aliases || []),
    ...(item.keywords || []),
    ...(item.tags || []).map((tag) => TAG_LABEL[tag] || tag),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matches(item, query) {
  if (!query) return true;
  const hay = haystack(item);
  return query.split(/\s+/).every((part) => hay.includes(part));
}

function pool(filter) {
  if (filter === "unofficial") return STATUSES.filter((item) => !item.official);
  if (filter === "all") return STATUSES;
  const n = Number(filter);
  return STATUSES.filter((item) => item.official && classOf(item) === n);
}

function groupsFrom(items, filter) {
  if (filter === "unofficial") return [{ key: "x", items }];
  if (filter !== "all") return [{ key: filter, items }];

  const groups = [1, 2, 3, 4, 5]
    .map((n) => ({
      key: String(n),
      items: items.filter((item) => item.official && classOf(item) === n),
    }))
    .filter((group) => group.items.length);

  const extra = items.filter((item) => !item.official);
  if (extra.length) groups.push({ key: "x", items: extra });
  return groups;
}

export function StatusApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const neighborRef = useRef(() => {});

  const filter = knownFilter(searchParams.get("kelas")) ? searchParams.get("kelas") : "all";
  const selectedCode = Number(searchParams.get("kode"));
  const selected = STATUSES.find((item) => item.code === selectedCode) ?? null;
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [copyLabel, setCopyLabel] = useState("Salin status line");

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return pool(filter).filter((item) => matches(item, query));
  }, [q, filter]);

  const groups = useMemo(() => groupsFrom(visible, filter), [visible, filter]);

  function writeUrl(patch = {}) {
    const nextQ = patch.q !== undefined ? patch.q : q;
    const nextFilter = patch.filter !== undefined ? patch.filter : filter;
    const nextKode = patch.kode !== undefined ? patch.kode : searchParams.get("kode");
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextFilter !== "all") params.set("kelas", nextFilter);
    if (nextKode) params.set("kode", String(nextKode));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function openDetail(code) {
    writeUrl({ kode: code });
  }

  function neighbor(step) {
    if (!selected) return;
    const items = visible.some((item) => item.code === selected.code) ? visible : STATUSES;
    const index = items.findIndex((item) => item.code === selected.code);
    const next = items[index + step];
    if (next) openDetail(next.code);
  }

  neighborRef.current = neighbor;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    setCopyLabel("Salin status line");
    dialogRef.current?.querySelector("article")?.scrollTo(0, 0);
  }, [selectedCode]);

  useEffect(() => {
    function onKey(event) {
      const typing = document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
      const dialogOpen = dialogRef.current?.open;
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !typing && !dialogOpen) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (!dialogOpen) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        neighborRef.current(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        neighborRef.current(-1);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const query = q.trim();
  const resultText = !query
    ? `${visible.length} kode ditampilkan.`
    : visible.length
      ? `${visible.length} kode cocok dengan “${query}”.`
      : "Tidak ada yang cocok.";

  const sequence = selected && visible.some((item) => item.code === selected.code) ? visible : STATUSES;
  const selectedIndex = selected ? sequence.findIndex((item) => item.code === selected.code) : -1;

  async function copyLine() {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(`HTTP/1.1 ${selected.code} ${selected.name}`);
      setCopyLabel("Tersalin");
    } catch {
      setCopyLabel("Tidak tersalin");
    }
    window.setTimeout(() => setCopyLabel("Salin status line"), 1400);
  }

  return (
    <>
      <a className="skip" href="#list">Langsung ke daftar</a>
      <div className="wrap">
        <header className="mast">
          <p className="kicker">Referensi</p>
          <h1>Status HTTP</h1>
          <p className="lede">
            Tiga digit yang dikirim server untuk memberitahu hasil sebuah request. Angka pertamanya menentukan kelasnya. Tekan <kbd>/</kbd> untuk mencari.
          </p>
        </header>

        <div className="toolbar">
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              if (visible[0]) openDetail(visible[0].code);
            }}
          >
            <label className="search">
              <span className="vh">Cari kode status</span>
              <input
                ref={inputRef}
                type="search"
                value={q}
                placeholder="Cari kode atau nama, misalnya 404"
                autoComplete="off"
                spellCheck="false"
                enterKeyHint="search"
                onChange={(event) => {
                  const value = event.target.value;
                  setQ(value);
                  writeUrl({ q: value });
                }}
              />
            </label>
          </form>
          <div className="filters" role="group" aria-label="Filter kelas">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? "chip is-active" : "chip"}
                data-filter={item.id}
                aria-pressed={filter === item.id}
                onClick={() => writeUrl({ filter: item.id })}
              >
                {item.id !== "all" ? <span className="dot" /> : null}
                {item.label} <span className="count">{countFor(item.id)}</span>
              </button>
            ))}
          </div>
          <p id="result-meta" aria-live="polite">{resultText}</p>
        </div>

        <main id="list">
          {visible.length === 0 ? (
            <div className="empty">
              <p>Tidak ada kode yang cocok dengan “{query}”.</p>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  writeUrl({ q: "" });
                  inputRef.current?.focus();
                }}
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            groups.map((group) => {
              const meta = CLASS_META[group.key];
              return (
                <section key={group.key} className="group" data-class={group.key}>
                  <header className="group-head">
                    <p className="kicker">{meta.kicker} · {group.items.length} kode</p>
                    <h2>{meta.title}</h2>
                    <p>{meta.lede}</p>
                  </header>
                  {group.items.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className="row"
                      onClick={() => openDetail(item.code)}
                    >
                      <span className="code">{item.code}</span>
                      <span className="name-cell">
                        <span className="name">{item.name}</span>
                        {(item.tags || []).map((tag) => (
                          <span key={tag} className="badge">{TAG_LABEL[tag] || tag}</span>
                        ))}
                      </span>
                      <span className="summary">{item.summary}</span>
                      <span className="meta">{item.spec}</span>
                    </button>
                  ))}
                </section>
              );
            })
          )}
        </main>

        <section className="compare" aria-labelledby="compare-title">
          <h2 id="compare-title">Yang sering tertukar</h2>
          <p>Pasangan yang artinya dekat, tetapi tidak sama.</p>
          <div className="compare-grid">
            {PAIRS.map((pair) => (
              <article key={`${pair.a}-${pair.b}`}>
                <h3>
                  <button type="button" className="code-btn" onClick={() => openDetail(pair.a)}>{pair.a}</button>
                  {" dan "}
                  <button type="button" className="code-btn" onClick={() => openDetail(pair.b)}>{pair.b}</button>
                </h3>
                <p>{pair.text}</p>
              </article>
            ))}
          </div>
        </section>

        <footer>
          <p>
            Kode resmi mengikuti{" "}
            <a href="https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml">registri IANA</a>
            {" "}dan{" "}
            <a href="https://www.rfc-editor.org/rfc/rfc9110#name-status-codes">RFC 9110</a>
            . Nama status dibiarkan dalam bahasa Inggris karena teks itulah yang muncul di status line. Nomor yang tidak ada di daftar ini belum diberikan, misalnya 105–199.
          </p>
        </footer>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="d-name"
        onClose={() => {
          if (searchParams.get("kode")) writeUrl({ kode: null });
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        {selected ? (
          <article data-klass={classOf(selected)}>
            <div className="stripe" />
            <div className="dialog-body">
              <div className="dialog-top">
                <p id="d-class">
                  {selected.official
                    ? `${classOf(selected)}xx · ${CLASS_META[classOf(selected)].title}`
                    : `Tidak resmi · ${classOf(selected)}xx`}
                </p>
                <button type="button" id="d-close" onClick={() => dialogRef.current?.close()}>Tutup</button>
              </div>
              <p id="d-code">{selected.code}</p>
              <h2 id="d-name">{selected.name}</h2>
              {selected.aliases?.length ? (
                <p id="d-aliases">Juga dikenal sebagai {selected.aliases.join(", ")}.</p>
              ) : null}
              <p id="d-line">HTTP/1.1 {selected.code} {selected.name}</p>
              <p id="d-summary">{selected.summary}</p>
              <h3>Artinya</h3>
              <p id="d-detail">{selected.detail}</p>
              <h3>Kapan muncul</h3>
              <p id="d-when">{selected.when}</p>
              {selected.note ? <p id="d-note">{selected.note}</p> : null}
              <p className="dialog-source">
                Sumber{" "}
                {selected.href ? (
                  <a href={selected.href} target="_blank" rel="noopener noreferrer">
                    {selected.specFull || selected.spec}
                  </a>
                ) : (
                  <span>{selected.specFull || selected.spec}</span>
                )}
              </p>
              <div className="dialog-actions">
                <button type="button" onClick={() => neighbor(-1)} disabled={selectedIndex <= 0}>Sebelumnya</button>
                <button type="button" onClick={copyLine}>{copyLabel}</button>
                <button type="button" onClick={() => neighbor(1)} disabled={selectedIndex === -1 || selectedIndex >= sequence.length - 1}>Berikutnya</button>
              </div>
            </div>
          </article>
        ) : null}
      </dialog>
    </>
  );
}
