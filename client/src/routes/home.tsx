import Hero from '../components/Hero';
import SnapWall from '../components/SnapWall';
import Banner from '../components/Banner';
import TextBlock from '../components/TextBlock';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className='pt-48'>
      <Hero />
      <SnapWall />
      <TextBlock />
      <Banner />
      <HowItWorks />
      <Footer />
    </div>
  );
}