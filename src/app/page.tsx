import Lanyard from '@/components/Lanyard';
import AboutMe from '@/components/about';
import Positions from '@/components/positions';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col px-3">
      <AboutMe />
      <Lanyard />
      <Positions />
    </div>
  );
}
