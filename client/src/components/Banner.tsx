import Marquee from 'react-fast-marquee';

export default function Banner() {
  return (
    <>
      <div className="font-gilmer-bold pt-24" style={{ fontSize: '64px', color: '#DAC86D' }}>
        <Marquee autoFill={true} gradient={true} gradientColor="#000" direction={"right"} gradientWidth={400}>
          <div>Login</div>
          <div className="-translate-y-1/4 text-7xl px-8">.</div>
          <div>Recognise</div>
          <div className="-translate-y-1/4 text-7xl px-8">.</div>
          <div>Tag</div>
          <div className="-translate-y-1/4 text-7xl px-8">.</div>
        </Marquee>
      </div>
    </>
  );
}
