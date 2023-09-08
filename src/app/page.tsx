import AboutMe from '@/components/about';
import Footer from '@/components/footer';
import Positions from '@/components/positions';

export default function Home() {
  return (
    <div className="h-full flex flex-col sm:pb-0 pb-[100px]">
      <AboutMe />
      <Positions />
      <Footer />
    </div>
  );
}
