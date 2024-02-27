import Marquee from 'react-fast-marquee';
import sarcLogo from '/sarc.svg';

export default function Hero() {
  return (
    <>
      <div className="py-20 flex flex-col text-center">
        <div className="font-gilmer-heavy text-4xl">Login . Recognise . Tag .</div>
        <div className="pt-6 goblin-one-regular hero-text-grad">Capturing Memories</div>
        <div className="goblin-one-regular hero-text-grad">Capturing Smiles</div>
        <div className="py-8 font-gilmer-medium text-2xl">tagging made easy and effortless</div>
      </div>
      <div className="relative h-48">
        <div className="absolute">
          <Marquee autoFill={true} gradient={true} gradientColor="#000" gradientWidth={400}>
            <div className="font-arial font-bold text-4xl loop-text-grad ml-32 mt-12">SARC</div>
          </Marquee>
        </div>
        <div className="absolute left-1/2 hero-logo px-32 custom-follow-mouse z-10" onClick={() => { window.location.href = "https://bits-sarc.in"}}>
          <div className="border-2 hero-logo-inner rounded-full px-2 transition-transform duration-75">
            <div className="p-8">
              <img src={sarcLogo} alt="SARC Logo" width={82} height={90.2} className="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}