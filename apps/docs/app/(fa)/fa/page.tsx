import NextLink from "next/link";
import { Accordion, AccordionItem } from "pixelbits/accordion";
import { Avatar, AvatarGroup } from "pixelbits/avatar";
import { Badge } from "pixelbits/badge";
import { Button } from "pixelbits/button";
import {
  Card,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardTitle,
} from "pixelbits/card";
import { Checkbox } from "pixelbits/checkbox";
import { Field } from "pixelbits/field";
import { Input } from "pixelbits/input";
import { Marquee } from "pixelbits/marquee";
import { PixelLoader } from "pixelbits/pixel-loader";
import { Progress } from "pixelbits/progress";
import { Radio, RadioGroup } from "pixelbits/radio";
import { Skeleton } from "pixelbits/skeleton";
import { Slider } from "pixelbits/slider";
import { SpotlightCard } from "pixelbits/spotlight-card";
import { Switch } from "pixelbits/switch";
import { Tab, TabList, TabPanel, Tabs } from "pixelbits/tabs";
import { TextScramble } from "pixelbits/text-scramble";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import { Logo, Mark } from "@/components/layout/logo";
import { MadeWithLove } from "@/components/layout/made-with-love";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { catalog } from "@/lib/catalog";
import { breadcrumbLd, JsonLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { FaInteractive } from "./_components/interactive";

const fa = (n: number) => n.toLocaleString("fa-IR");

const features = [
  {
    title: "پیکسل، فقط هنگام لمس",
    text: "افکت‌های پیکسلی با هاور، فوکوس صفحه‌کلید، باز شدن و بارگذاری ظاهر می‌شوند. در حالت عادی همه‌چیز آرام است.",
  },
  {
    title: "سبک و سریع",
    text: "هر کامپوننت ورودی جداگانه دارد و هر چه وارد نکنید در باندل نیست. بدون کتابخانهٔ انیمیشن و بدون CSS-in-JS.",
  },
  {
    title: "ساخته‌شده روی پلتفرم",
    text: "دیالوگ بومی، پاپ‌اور API، ورودی‌های واقعی فرم و جزئیات بومی؛ دسترس‌پذیر حتی با جاوااسکریپت کم.",
  },
  {
    title: "راست‌به‌چپ، از پایه",
    text: "همهٔ کامپوننت‌ها از ویژگی‌های منطقی CSS استفاده می‌کنند؛ فلش‌ها، کلیدهای جهت‌دار و افکت‌ها خودبه‌خود برمی‌گردند.",
  },
];

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="grid gap-8">
      <header className="grid gap-2">
        <span className="text-xs font-medium text-pb-accent">{eyebrow}</span>
        <h2 id={id} className="text-pb-h3 font-bold tracking-normal">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-5 rounded-pb-lg border border-pb-border bg-pb-surface p-6">
      <h3 className="text-sm font-bold text-pb-muted">{title}</h3>
      {children}
    </div>
  );
}

export default function Persian() {
  return (
    <>
      <JsonLd
        data={{
          "@graph": [
            { ...websiteLd, inLanguage: "fa", url: `${site.url}/fa/` },
            breadcrumbLd([
              { name: "Pixelbits", path: "/" },
              { name: "فارسی", path: "/fa/" },
            ]),
          ],
        }}
      />
      <header className="sticky top-0 z-40 border-b border-pb-border bg-pb-bg/80 backdrop-blur-md">
        <div className="pb-container flex h-14 items-center gap-6">
          <NextLink
            href="/fa/"
            aria-label="پیکسل‌بیتس، صفحهٔ فارسی"
            className="rounded-pb-xs outline-none focus-visible:outline-2 focus-visible:outline-pb-accent"
          >
            <Logo />
          </NextLink>
          <nav
            aria-label="بخش‌ها"
            className="hidden items-center gap-6 text-[0.8125rem] md:flex"
          >
            <a href="#features" className="text-pb-muted hover:text-pb-text">
              ویژگی‌ها
            </a>
            <a href="#components" className="text-pb-muted hover:text-pb-text">
              کامپوننت‌ها
            </a>
            <a href="#install" className="text-pb-muted hover:text-pb-text">
              نصب
            </a>
            <a href="#faq" className="text-pb-muted hover:text-pb-text">
              پرسش‌ها
            </a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <NextLink href="/docs/" lang="en">
                English docs
              </NextLink>
            </Button>
            <ThemeToggle label="تغییر تم" />
          </div>
        </div>
      </header>

      <main id="main" className="pb-container grid flex-1 gap-24 py-16 lg:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid gap-7">
            <Badge variant="accent" dot className="w-fit">
              نسخهٔ ۱٫۰ · {fa(catalog.length)} کامپوننت
            </Badge>
            <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.3] font-bold text-balance">
              <TextScramble text="پیکسل‌ها، با وسواس ساخته‌شده." />
            </h1>
            <p className="max-w-2xl text-pb-body-lg leading-loose text-pb-muted">
              پیکسل‌بیتس یک کیت رابط کاربری آرام و لوکس برای ری‌اکت است. افکت‌های پیکسلی‌اش
              فقط لحظهٔ تعامل ظاهر می‌شوند و همه با فوکوس صفحه‌کلید هم کار می‌کنند. این صفحه
              همهٔ آن‌ها را در جهت راست‌به‌چپ نشان می‌دهد.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <a href="#install">شروع کنید</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#components">دیدن کامپوننت‌ها</a>
              </Button>
            </div>
          </div>
          <SpotlightCard className="grid aspect-[5/4] place-items-center">
            <Mark className="w-2/5" />
          </SpotlightCard>
        </section>

        <Marquee
          aria-label="ساخته‌شده با"
          className="-mx-[clamp(1rem,4vw,2.5rem)] border-y border-pb-border py-5 text-xl text-pb-muted"
        >
          {[
            "تیلویند ۴",
            "ری‌اکت ۱۹",
            "دیالوگ بومی",
            "پاپ‌اور API",
            "رنگ‌های OKLCH",
            "رجیستری shadcn",
            "دسترس‌پذیری AA",
          ].map((t) => (
            <span key={t} className="flex items-center gap-10 whitespace-nowrap">
              {t}
              <i className="size-2 bg-pb-accent" />
            </span>
          ))}
        </Marquee>

        <Section
          id="features"
          eyebrow="چرا پیکسل‌بیتس"
          title="ظریف در آرامش، زنده در تعامل"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="grid content-start gap-3 border-t border-pb-border pt-5"
              >
                <h3 className="text-[0.9375rem] font-bold">{f.title}</h3>
                <p className="text-[0.875rem] leading-loose text-pb-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="components" eyebrow="نمونهٔ زنده" title="کامپوننت‌ها در جهت راست‌به‌چپ">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="فرم">
              <form className="grid gap-5">
                <Field
                  label="نام"
                  description="در صفحهٔ عمومی شما نمایش داده می‌شود."
                  required
                >
                  <Input placeholder="علی مرادی" />
                </Field>
                <Field label="ایمیل" error="لطفاً یک ایمیل معتبر وارد کنید.">
                  <Input defaultValue="ali@studio" dir="ltr" />
                </Field>
                <Field label="اندازهٔ پیکسل">
                  <Slider min={4} max={16} defaultValue={9} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Checkbox
                    label="دریافت خبرنامه"
                    description="ماهی یک بار، بدون هرزنامه"
                    defaultChecked
                  />
                  <Switch label="حرکت کمتر" />
                </div>
                <RadioGroup
                  aria-label="دورهٔ پرداخت"
                  defaultValue="monthly"
                  orientation="horizontal"
                >
                  <Radio value="monthly" label="ماهانه" />
                  <Radio value="yearly" label="سالانه" />
                </RadioGroup>
              </form>
            </Panel>
            <Panel title="پیمایش و پنجره‌ها">
              <Tabs defaultValue="a">
                <TabList aria-label="نمونه">
                  <Tab value="a">پیش‌نمایش</Tab>
                  <Tab value="b">کد</Tab>
                  <Tab value="c">ویژگی‌ها</Tab>
                </TabList>
                <TabPanel value="a" className="text-sm leading-loose text-pb-muted">
                  کلیدهای چپ و راست در جهت راست‌به‌چپ برعکس کار می‌کنند.
                </TabPanel>
                <TabPanel value="b" className="font-pb-mono text-xs" dir="ltr">
                  {'<Tabs defaultValue="a" />'}
                </TabPanel>
                <TabPanel value="c" className="text-sm leading-loose text-pb-muted">
                  دسترس‌پذیر، با کلیدهای جهت‌دار و Home و End.
                </TabPanel>
              </Tabs>
              <FaInteractive />
            </Panel>
            <Panel title="نمایش داده">
              <Card interactive>
                <CardHeader>
                  <CardEyebrow>نمونهٔ کار</CardEyebrow>
                  <CardTitle>خانهٔ مد نوآر</CardTitle>
                  <CardDescription>
                    سایت یک خانهٔ مد که با همین کیت ساخته شده است.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Badge variant="success" dot>
                    منتشر شده
                  </Badge>
                  <AvatarGroup className="ms-auto">
                    <Avatar name="Ali Moradi" />
                    <Avatar name="Sara Karimi" />
                  </AvatarGroup>
                </CardFooter>
              </Card>
              <div className="flex flex-wrap gap-2">
                <Badge>پیش‌فرض</Badge>
                <Badge variant="accent">ویژه</Badge>
                <Badge variant="warning">در انتظار</Badge>
                <Badge variant="danger">خطا</Badge>
                <Badge variant="info">اطلاعات</Badge>
              </div>
            </Panel>
            <Panel title="بارگذاری و پیشرفت">
              <Progress label="بارگذاری فایل‌ها" value={64} />
              <Progress label="ساخت رجیستری" value={26} max={40} variant="pixel" />
              <div className="flex items-center gap-4" aria-busy="true">
                <Skeleton shape="square" />
                <div className="grid flex-1 gap-2">
                  <Skeleton shape="text" className="w-2/3" />
                  <Skeleton shape="text" />
                </div>
              </div>
              <div className="flex items-center gap-8 text-pb-text">
                <PixelLoader label="در حال بارگذاری" />
                <PixelLoader variant="pulse" size={8} label="در انتظار پاسخ" />
                <PixelLoader variant="noise" label="در حال پردازش" />
              </div>
            </Panel>
          </div>
        </Section>

        <Section id="install" eyebrow="نصب" title="در دو دقیقه راه بیندازید">
          <div className="grid gap-6 lg:grid-cols-2" dir="ltr">
            <CodeBlock title="terminal" lang="bash" code="pnpm add pixelbits" />
            <CodeBlock
              title="app/globals.css"
              lang="css"
              code={`@import "tailwindcss";\n@import "pixelbits/theme.css";`}
            />
          </div>
          <p className="max-w-2xl text-sm leading-loose text-pb-muted">
            برای راست‌به‌چپ کافی است روی عنصر <code dir="ltr">{'<html dir="rtl">'}</code> را
            بگذارید. راهنمای کامل در{" "}
            <NextLink
              href="/docs/"
              className="text-pb-accent underline underline-offset-4"
              lang="en"
            >
              مستندات انگلیسی
            </NextLink>{" "}
            است.
          </p>
        </Section>

        <Section id="faq" eyebrow="پرسش‌های متداول" title="پاسخ‌های کوتاه">
          <Accordion className="max-w-3xl">
            <AccordionItem title="آیا دسترس‌پذیر است؟" defaultOpen>
              بله. همهٔ رنگ‌ها کنتراست AA دارند و همهٔ افکت‌ها با فوکوس صفحه‌کلید هم اجرا
              می‌شوند. اگر کاربر «حرکت کمتر» را در سیستم روشن کرده باشد، انیمیشن‌ها خاموش یا
              آرام می‌شوند.
            </AccordionItem>
            <AccordionItem title="آیا از راست‌به‌چپ پشتیبانی می‌کند؟">
              بله، همین صفحه نمونهٔ آن است: چیدمان، فلش‌ها، کلیدهای جهت‌دار، پنل‌های کناری و
              افکت‌های پیکسلی همه برمی‌گردند.
            </AccordionItem>
            <AccordionItem title="بدون تیلویند هم کار می‌کند؟">
              بله. یک فایل CSS از پیش ساخته‌شده هم دارد که فقط یک بار وارد می‌شود.
            </AccordionItem>
            <AccordionItem title="می‌توانم کد کامپوننت را خودم تغییر دهم؟">
              بله. هر کامپوننت در رجیستری shadcn هم هست و با یک فرمان، کد آن در پروژهٔ شما
              کپی می‌شود.
            </AccordionItem>
          </Accordion>
        </Section>
      </main>

      <footer className="mt-12 border-t border-pb-border bg-pb-surface">
        <div className="pb-container flex flex-wrap items-center justify-between gap-6 py-10">
          <div className="grid gap-3">
            <Logo />
            <p className="text-[0.8125rem] text-pb-muted">
              کیت رابط کاربری ری‌اکت با افکت‌های پیکسلی · مجوز MIT
            </p>
          </div>
          <MadeWithLove lang="fa" className="text-sm text-pb-muted" />
        </div>
      </footer>
    </>
  );
}
