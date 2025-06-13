import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <Image
            src="/logo.png?height=150&width=150"
            alt="Math AI Mascot"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-500 drop-shadow-md">
            Turn math problems into fun stories!
          </h1>
          <p className="text-lg text-white mt-2">
            Personalize math problems based on your interests
          </p>
        </div>
      </div>
    </div>
  );
}
