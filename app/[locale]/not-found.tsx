import Link from "next/link";
import { dict } from "@/content/dictionary";

export default function NotFound() {
  // The locale segment is not available to not-found, so this page is bilingual.
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-40">
      <p className="label">404</p>
      <h1 className="display display-lg mt-6">
        {dict.common.notFoundTitle.fr}
        <span className="block italic opacity-50">{dict.common.notFoundTitle.en}</span>
      </h1>
      <p className="prose-asm mt-8">
        <span>{dict.common.notFoundBody.fr}</span>
      </p>
      <div className="mt-10 flex gap-6">
        <Link href="/fr" className="btn btn-ink">
          {dict.common.backHome.fr}
        </Link>
        <Link href="/en" className="btn btn-ink">
          {dict.common.backHome.en}
        </Link>
      </div>
    </section>
  );
}
