import sarcLogo from '/sarc.svg';

export default function Hero() {
  return (
    <>
      <div className="py-32 flex flex-col text-center">
        <div className="font-gilmer-heavy text-4xl">Login . Recognise . Tag .</div>
        <div className="font-gilmer-heavy hero-text-grad">Capturing Memories</div>
        <div className="font-gilmer-heavy hero-text-grad">Capturing Smiles</div>
      </div>
      <div className="relative marquee h-48">
        <div className="inner loop-text-grad">
          <div className="flex child justify-around">
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
          </div>
          <div className="flex child justify-around">
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
            <div className="font-arial font-bold text-4xl">SARC</div>
          </div>
        </div>
        <div className="absolute left-1/2 hero-logo px-32">
          <div className="border-2 border-amber-300 rounded-full px-2 bg-gradient-to-b from-amber-300 to-70%">
            <div className="p-8">
              <img src={sarcLogo} alt="SARC Logo" width={82} height={90.2} className="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}