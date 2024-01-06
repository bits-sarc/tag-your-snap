export default function FancyButton({ text }: { text: string }) {
  return (
    <button className="btn bg-gradient-to-l from-amber-300 to-70% px-16 py-2 text-4xl rounded-full border-2 border-amber-300 font-gilmer-bold">{text}</button>
  )
}