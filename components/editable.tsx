"use client";

import { useDataStore } from "@/lib/data-store";
import { useEffect, useState, ReactNode } from "react";

interface EditableTextProps {
  subdomain: string;
  field: "heroTitle" | "heroDescription";
  defaultValue: ReactNode;
  className?: string;
  as?: any;
}

export const EditableText = ({ subdomain, field, defaultValue, className, as: Component = "span" }: EditableTextProps) => {
  const { getPageContent } = useDataStore();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // Access store only on client to avoid hydration mismatch
    // Actually store usage is fine, but we need to wait for mount
    // to access localStorage persisted data.
    const content = getPageContent(subdomain);
    if (content && content[field]) {
       setText(content[field]!);
    }
  }, [subdomain, field, getPageContent]);

  if (text !== null) {
      // If user typed custom HTML in title (unlikely for title but possible)
      // For safety let's assume title is text, but Tiptap could be anything.
      // If it's pure text input from Editor, just render it.
      return <Component className={className}>{text}</Component>;
  }

  return <Component className={className}>{defaultValue}</Component>;
};

interface EditableContentProps {
  subdomain: string;
  defaultContent: ReactNode;
}

export const EditableContent = ({ subdomain, defaultContent }: EditableContentProps) => {
  const { getPageContent } = useDataStore();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    const data = getPageContent(subdomain);
    if (data && data.bodyContent) {
        setHtml(data.bodyContent);
    }
  }, [subdomain, getPageContent]);

  if (html) {
      return <div className="prose prose-invert max-w-none w-full" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <>{defaultContent}</>;
};
