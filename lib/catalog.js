export const CLASS_META = {
  1: {
    kicker: "1xx",
    title: "Informasi",
    lede: "Request sudah diterima. Proses masih berlanjut, dan response akhir menyusul.",
  },
  2: {
    kicker: "2xx",
    title: "Sukses",
    lede: "Request berhasil diterima, dipahami, dan diproses.",
  },
  3: {
    kicker: "3xx",
    title: "Pengalihan",
    lede: "Client perlu langkah tambahan, biasanya mengikuti URL di header Location.",
  },
  4: {
    kicker: "4xx",
    title: "Error klien",
    lede: "Request bermasalah atau tidak diizinkan. Nomor seperti 419, 444, dan 499 bukan bagian dari kelas resmi ini.",
  },
  5: {
    kicker: "5xx",
    title: "Error server",
    lede: "Server gagal memenuhi request yang tampak valid. Nomor 520–530 milik Cloudflare ada di luar registri.",
  },
  x: {
    kicker: "Ekstensi",
    title: "Di luar registri",
    lede: "Dipakai nginx, Cloudflare, Laravel, dan layanan lain. HTTP tidak mewajibkannya, tetapi angka ini sering muncul di log.",
  },
};

export const TAG_LABEL = {
  temporary: "Sementara",
  deprecated: "Usang",
  unused: "Tidak dipakai",
  unofficial: "Tidak resmi",
};

export const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "1", label: "1xx" },
  { id: "2", label: "2xx" },
  { id: "3", label: "3xx" },
  { id: "4", label: "4xx" },
  { id: "5", label: "5xx" },
  { id: "unofficial", label: "Tidak resmi" },
];

export const PAIRS = [
  {
    a: 401,
    b: 403,
    text: "401: identitas belum diterima. Login yang benar bisa menolong. 403: server menolak meskipun sudah tahu siapa yang meminta.",
  },
  {
    a: 404,
    b: 410,
    text: "404: tidak ditemukan, atau tidak diakui. 410: dulu ada, lalu dihapus dan tidak akan kembali.",
  },
  {
    a: 301,
    b: 308,
    text: "Keduanya pindah permanen. 301 sering diikuti sebagai GET. 308 mempertahankan method dan body.",
  },
  {
    a: 302,
    b: 307,
    text: "Keduanya pindah sementara. 302 sering berubah jadi GET. 307 mempertahankan method dan body.",
  },
  {
    a: 400,
    b: 422,
    text: "400: request-nya rusak atau tidak bisa dibaca. 422: formatnya valid, isinya ditolak, misalnya gagal validasi.",
  },
  {
    a: 429,
    b: 503,
    text: "429: client ini yang kebanyakan request. 503: layanannya sendiri yang sedang tidak sanggup.",
  },
  {
    a: 502,
    b: 504,
    text: "502: gateway menerima jawaban yang tidak valid. 504: gateway kehabisan waktu menunggu jawaban.",
  },
];
