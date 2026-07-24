type Props = {
  story: string;
};

export default function ProductStory({ story }: Props) {
  return (
    <section className="mt-24 border-t border-white/10 pt-20">
      <h2 className="text-4xl font-black text-white">
        The Story
      </h2>

      <p className="mt-8 max-w-4xl text-xl leading-10 text-gray-300">
        {story}
      </p>
    </section>
  );
}