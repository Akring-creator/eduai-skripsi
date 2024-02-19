import { db } from '@/lib/db';
import { auth, redirectToSignIn, redirectToSignUp } from '@clerk/nextjs';
export const getProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    redirectToSignUp();
  }

  const profile = await db.profile.findUnique({
    where: {
      externalUserId: userId!,
    },
  });

  if (!profile) {
    return null;
  }
  return profile;
};
