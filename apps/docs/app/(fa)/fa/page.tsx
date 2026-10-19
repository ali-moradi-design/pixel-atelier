import NextLink from "next/link";
import { Accordion, AccordionItem } from "pixel-atelier/accordion";
import { Badge } from "pixel-atelier/badge";
import { Breadcrumb } from "pixel-atelier/breadcrumb";
import { Button } from "pixel-atelier/button";
import { Card } from "pixel-atelier/card";
import { Checkbox } from "pixel-atelier/checkbox";
import { Field } from "pixel-atelier/field";
import { Input } from "pixel-atelier/input";
import { Marquee } from "pixel-atelier/marquee";
import { Progress } from "pixel-atelier/progress";
import { Radio, RadioGroup } from "pixel-atelier/radio";
import { Slider } from "pixel-atelier/slider";
import { Switch } from "pixel-atelier/switch";
import { Tab, TabList, TabPanel, Tabs } from "pixel-atelier/tabs";
import { TextScramble } from "pixel-atelier/text-scramble";
import { Logo } from "@/components/logo";
import { FaInteractive } from "./interactive";

export default function Persian() {
  return (
    <main className="mx-auto grid max-w-5xl gap-14 px-4 py-10 sm:px-6">
      <header className="flex items-center justify-between">
        <NextLink href="/" className="outline-none">
          <Logo />
        </NextLink>
        <Button asChild size="sm" variant="ghost">
          <NextLink href="/docs/">English docs</NextLink>
        </Button>
      </header>

      <section className="grid gap-5">
        <Breadcrumb
          items={[
            { label: "خانه", href: "/" },
            { label: "مستندات", href: "/docs/" },
            { label: "نمایش فارسی" },
          ]}
        />
        <Badge variant="accent" dot className="w-fit">
          راست‌به‌چپ
        </Badge>
        <h1 className="text-pa-h1 font-light">
          <TextScramble text="پیکسل‌ها، با دقت ساخته شده." />
        </h1>
        <p className="max-w-2xl text-pa-body-lg text-pa-muted">
          همهٔ کامپوننت‌ها از ویژگی‌های منطقی CSS استفاده می‌کنند؛ پس با تنظیم{" "}
          <code className="font-pa-mono text-sm">dir="rtl"</code> چیدمان، فلش‌ها، کلیدهای
          جهت‌دار و افکت‌های پیکسلی خودبه‌خود برمی‌گردند.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg" roll>
            شروع کنید
          </Button>
          <Button size="lg" roll>
            مشاهدهٔ کامپوننت‌ها
          </Button>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <form className="grid content-start gap-5">
          <Field label="نام" description="در صفحهٔ عمومی شما نمایش داده می‌شود." required>
            <Input placeholder="علی مرادی" />
          </Field>
          <Field label="ایمیل" error="لطفاً یک ایمیل معتبر وارد کنید.">
            <Input defaultValue="ali@studio" dir="ltr" />
          </Field>
          <Field label="اندازهٔ پیکسل">
            <Slider min={4} max={16} defaultValue={9} />
          </Field>
          <Checkbox
            label="دریافت خبرنامه"
            description="ماهی یک بار، بدون هرزنامه"
            defaultChecked
          />
          <RadioGroup
            aria-label="دورهٔ پرداخت"
            defaultValue="monthly"
            orientation="horizontal"
          >
            <Radio value="monthly" label="ماهانه" />
            <Radio value="yearly" label="سالانه" />
          </RadioGroup>
          <Switch label="حرکت کمتر" />
        </form>
        <div className="grid content-start gap-6">
          <Tabs defaultValue="a">
            <TabList aria-label="نمونه">
              <Tab value="a">پیش‌نمایش</Tab>
              <Tab value="b">کد</Tab>
              <Tab value="c">ویژگی‌ها</Tab>
            </TabList>
            <TabPanel value="a" className="text-sm text-pa-muted">
              کلیدهای چپ و راست در جهت راست‌به‌چپ برعکس کار می‌کنند.
            </TabPanel>
            <TabPanel value="b" className="font-pa-mono text-xs" dir="ltr">
              {"<Button />"}
            </TabPanel>
            <TabPanel value="c" className="text-sm">
              جدول ویژگی‌ها
            </TabPanel>
          </Tabs>
          <Progress label="بارگذاری فایل‌ها" value={64} />
          <Progress label="ساخت رجیستری" value={26} max={40} variant="pixel" />
          <FaInteractive />
        </div>
      </section>

      <Marquee
        aria-label="ساخته شده با"
        className="border-y border-pa-border py-4 text-2xl font-light text-pa-muted"
      >
        {["تیلویند ۴", "ری‌اکت ۱۹", "دیالوگ بومی", "پاپ‌اور", "بوم (canvas)"].map((t) => (
          <span key={t} className="flex items-center gap-10 whitespace-nowrap">
            {t}
            <i className="size-2 bg-pa-accent" />
          </span>
        ))}
      </Marquee>

      <section className="grid gap-6 md:grid-cols-2">
        <Card
          eyebrow="نمونهٔ کار"
          title="آتلیه نوآر"
          description="سایت یک خانهٔ مد که با همین کیت ساخته شده است."
          interactive
        />
        <Accordion>
          <AccordionItem title="آیا دسترس‌پذیر است؟" defaultOpen>
            بله. همهٔ افکت‌ها با فوکوس صفحه‌کلید هم اجرا می‌شوند.
          </AccordionItem>
          <AccordionItem title="آیا از راست‌به‌چپ پشتیبانی می‌کند؟">
            بله، همین صفحه نمونهٔ آن است.
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
