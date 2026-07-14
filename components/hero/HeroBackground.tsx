import Image from "next/image";

type Props = {
  image: string;
};

export default function HeroBackground({ image }: Props) {
  return (
    <div className="absolute inset-0">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}