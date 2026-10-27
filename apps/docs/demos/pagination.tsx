"use client";
import { Pagination } from "pixelbits/pagination";
import { useState } from "react";

export default function Demo() {
  const [page, setPage] = useState(4);
  return <Pagination page={page} count={12} onPageChange={setPage} />;
}
