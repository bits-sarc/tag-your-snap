export default function Banner() {
  return (
    <>
      <div className="bg-white">
        <div className="bg-black w-full min-h-8"></div>
        <div className="bg-black rounded-b-full w-full min-h-32"></div>
        <div className="font-gilmer-heavy text-black">
          <div className="relative marquee h-40">
            <div className="inner -translate-y-1/4 text-7xl" style={{ lineHeight: 1.5 }}>
              <div className="flex child justify-around">
                <div>Login</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div>Recognise</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div>Tag</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div className="hidden lg:block">Login</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
                <div className="hidden lg:block">Recognise</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
                <div className="hidden lg:block">Tag</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
              </div>
              <div className="flex child justify-around">
                <div>Login</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div>Recognise</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div>Tag</div>
                <div className="-translate-y-1/3 text-9xl">.</div>
                <div className="hidden lg:block">Login</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
                <div className="hidden lg:block">Recognise</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
                <div className="hidden lg:block">Tag</div>
                <div className="-translate-y-1/3 text-9xl hidden lg:block">.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black rounded-t-full w-full min-h-32"></div>
        <div className="bg-black w-full min-h-8"></div>
      </div>
    </>
  )
}
