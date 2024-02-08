import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import SetupPage from './_components/username-form';

const SetupMainPage = async () => {
  return <SetupPage />;
};

export default SetupMainPage;
