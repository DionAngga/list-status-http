import { Suspense } from "react";
import { StatusApp } from "@/components/StatusApp";

export default function Page() {
  return (
    <Suspense fallback={<div className="wrap"><p className="lede">Memuat daftar…</p></div>}>
      <StatusApp />
    </Suspense>
  );
}
