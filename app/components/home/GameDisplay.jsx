const products = [
  {
    id: 1,
    name: "Nomad Pouch",
    href: "#",
    price: "$50",
    availability: "White and Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-07-product-01.jpg",
    imageAlt:
      "White fabric pouch with white zipper, black zipper pull, and black elastic loop.",
  },
  {
    id: 2,
    name: "Zip Tote Basket",
    href: "#",
    price: "$140",
    availability: "Washed Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-07-product-02.jpg",
    imageAlt:
      "Front of tote bag with washed black canvas body, black straps, and tan leather handles and accents.",
  },
  {
    id: 3,
    name: "Medium Stuff Satchel",
    href: "#",
    price: "$220",
    availability: "Blue",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-07-product-03.jpg",
    imageAlt:
      "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
  },
];

export default function GameDisplay({ gameList }) {
  const gameCard = gameList?.map((game) => {
    const url = `/games/${game._id}`;
    return (
      <a key={game._id} href={url} className="group text-sm">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
          <img
            src={""}
            alt={""}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <h3 className="mt-4 font-medium text-white">{game.title}</h3>
        {game.categories.map((category, index) => {
          return (
            <p key={index} className="italic text-white">
              {category}
            </p>
          );
        })}
        <p className="mt-2 font-medium text-white">{game.description}</p>
      </a>
    );
  });

  return (
    <div className="bg-blue-950 w-8/12 rounded-t-2xl">
      <div className="mx-auto max-w-2xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-white text-center pb-20">
          Nouveaux jeux
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {gameCard}
        </div>
      </div>
    </div>
  );
}
