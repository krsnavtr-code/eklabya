"use client";

import { ReactNode } from "react";

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
  children?: ReactNode;
}

export default function JsonLd({ data, children }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      {children}
    </>
  );
}
