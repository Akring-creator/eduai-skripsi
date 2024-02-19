import { db } from '@/lib/db';
import { auth, redirectToSignIn, redirectToSignUp } from '@clerk/nextjs';
export const getProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      externalUserId: userId!,
    },
  });

  if (!profile) {
    redirectToSignUp();
  }
  return profile;
};
