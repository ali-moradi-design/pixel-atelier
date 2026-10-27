"use client";

import { Button } from "pixelbits/button";
import { Sheet } from "pixelbits/dialog";
import { DropdownItem, DropdownMenu, DropdownSeparator } from "pixelbits/dropdown-menu";
import { Pagination } from "pixelbits/pagination";
import { Select } from "pixelbits/select";
import { toast } from "pixelbits/toast";
import { useState } from "react";

export function FaInteractive() {
  const [page, setPage] = useState(2);
  return (
    <div className="grid gap-5">
      <Select
        aria-label="چارچوب"
        options={[
          { value: "next", label: "نکست" },
          { value: "astro", label: "آسترو" },
          { value: "vite", label: "ویت" },
        ]}
        defaultValue="next"
      />
      <div className="flex flex-wrap gap-3">
        <DropdownMenu trigger={<Button size="sm">حساب کاربری</Button>}>
          <DropdownItem shortcut="⌘ ,">تنظیمات</DropdownItem>
          <DropdownItem>نمایه</DropdownItem>
          <DropdownSeparator />
          <DropdownItem variant="danger">خروج</DropdownItem>
        </DropdownMenu>
        <Sheet
          side="start"
          trigger={<Button size="sm">فیلترها</Button>}
          title="فیلترها"
          description="این پنل از سمت شروع (راست) باز می‌شود."
        />
        <Button
          size="sm"
          onClick={() =>
            toast({
              title: "ذخیره شد",
              description: "تغییرات شما ثبت شد.",
              variant: "success",
            })
          }
        >
          نمایش اعلان
        </Button>
      </div>
      <Pagination page={page} count={9} onPageChange={setPage} aria-label="صفحه‌بندی" />
    </div>
  );
}
