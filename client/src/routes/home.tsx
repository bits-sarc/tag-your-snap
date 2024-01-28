import Hero from '../components/Hero';
import SnapWall from '../components/SnapWall';
import Banner from '../components/Banner';
import TextBlock from '../components/TextBlock';

export default function Home() {
  return (
    <div className='pt-48'>
      <Hero />
      <SnapWall />
      <Banner />
      <TextBlock />
    </div>
  );
}