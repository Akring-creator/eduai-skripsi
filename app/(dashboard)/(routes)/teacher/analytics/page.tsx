import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { getAnalytics } from '@/actions/get-analytics';

import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';
import { getProfile } from '@/actions/get-profile';

const AnalyticsPage = async () => {
  const profile = await getProfile();

  if (!profile) {
    return redirect('/');
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(profile.id);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
