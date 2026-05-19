import { IntroExperience } from '@/components/home/intro-experience';
import { DemlemeSection } from '@/components/home/demleme-section';
import { SubscriptionTeaser } from '@/components/home/subscription-teaser';

export default function HomePage() {
  return (
    <>
      <IntroExperience />
      <DemlemeSection />
      <SubscriptionTeaser />
    </>
  );
}
