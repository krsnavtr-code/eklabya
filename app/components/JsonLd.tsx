"use client";

import { ReactNode } from "react";

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
  children?: ReactNode;
}

export default function JsonLd({ data, children }: JsonLdProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
      {children}
    </>
  );
}
