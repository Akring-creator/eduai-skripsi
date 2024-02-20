import { db } from '@/lib/db';
import {
  RedirectToSignIn,
  auth,
  currentUser,
  redirectToSignIn,
  redirectToSignUp,
} from '@clerk/nextjs';
import { redirect } from 'next/navigation';
export const getInitialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      externalUserId: user.id!,
    },
  });

  return profile;
};
