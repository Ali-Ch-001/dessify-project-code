'use client';                                  // ← make this a client component

import dynamicImport from 'next/dynamic';     // rename the import to avoid conflicts

const ResetPasswordClient = dynamicImport(
  () => import('./ResetPasswordClient'),
  { ssr: false }
);

export default function Page() {
  return <ResetPasswordClient />;
}
