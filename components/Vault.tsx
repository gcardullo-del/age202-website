const products = [
  {
    title: "Nike RF Polo Wimbledon 2017",
    image: "/images/products/rf-polo-white.jpg",
    status: "SOLD",
    color: "text-red-500",
  },
  {
    title: "Nike Jacket Australian Open",
    image: "/images/products/rf-jacket-black.jpg",
    status: "ARCHIVED",
    color: "text-yellow-400",
  },
  {
    title: "Nike Polo US Open 2009",
    image: "/images/products/rf-polo-blue.jpg",
    status: "AVAILABLE",
    color: "text-lime-400",
  },
];

export default function Vault() {
  return (
    <section className="bg-[#07192f] py-24">

      <div className="max-w-7xl mx-auto px-8">

        <div className="flex items-center justify-between mb-12">

          <div>

            <p className="uppercase tracking-[8px] text-lime-400 text-sm">
              The Vault
            </p>

            <h2 className="text-5xl font-black text-white mt-3">
              Iconic Pieces
            </h2>

          </div>

          <button className="border border-lime-400 text-lime-400 px-6 py-3 rounded-full hover:bg-lime-400 hover:text-black transition">
            Visita il Vault →
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {products.map((product) => (

            <div
              key={product.title}
              className="bg-[#0b2342] rounded-3xl overflow-hidden border border-white/5 hover:border-lime-400 transition duration-300 group"
            >

              <div className="overflow-hidden">

                <img
                  src={product.image}
                  className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                  alt={product.title}
                />

              </div>

              <div className="p-6">

                <h3 className="text-white font-bold text-xl">
                  {product.title}
                </h3>

                <p className={`uppercase mt-3 font-bold ${product.color}`}>
                  ● {product.status}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}