import React from 'react';
import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/auth';
import { readFullDbState } from '@/lib/db';
import { AdminCmsWorkspace, AdminModuleKey } from '@/components/admin/AdminCmsWorkspace';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard — The Creative Odyssey CMS',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: { tab?: AdminModuleKey };
}) {
  const session = await requireAdminSession();
  const fullState = await readFullDbState();

  return (
    <AdminCmsWorkspace
      initialState={fullState}
      adminEmail={session.email}
      initialTab={searchParams?.tab || 'overview'}
    />
  );
}

