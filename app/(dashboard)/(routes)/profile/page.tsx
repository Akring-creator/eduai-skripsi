import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { ProfileImage } from './_components/profile-image-form';
import BasicInformation from './_components/basic-information-form';

const ProfilePage = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  return (
    <div className="p-6">
      <div className="space-y-2">
        <ProfileImage imageUrl={profile.imageUrl} />
      </div>
      <div className="space-y-2"></div>
      <BasicInformation profile={profile} />
    </div>
  );
};

export default ProfilePage;
