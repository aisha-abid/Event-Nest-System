import React, { useEffect } from 'react'

const ExploreMenu = () => {
  useEffect(() => {
    window.scrollTo(0, 0);   // page load hote hi top par le jao
  }, []);
  const menuData = { 
    starters: [
      { name: "Lamb Seekh Kebab", desc: "2 pcs", price: "$2", img: "/images/starters/lamb-seekh.jpeg" },
      { name: "Chicken Seekh Kebab", desc: "2 pcs", price: "$1.5", img: "/images/starters/chicken-seekh.jpeg" },
      { name: "Chicken Malai Boti", desc: "6 pcs", price: "$1.5", img: "/images/starters/chicken-malai-boti.jpg" },
      { name: "Fish Fry", desc: "6 pcs", price: "$2", img: "/images/starters/fish-fry.jpg" },
      { name: "Spicy Honey Wings", desc: "8 pcs", price: "$2", img: "/images/starters/spicy-honey-wings.jpg" },
      { name: "Vegetable Spring Rolls", desc: "6 pcs", price: "$1.5", img: "/images/starters/veg-spring-rolls.jpeg" },
      { name: "Mongolian Wings", desc: "6 pcs", price: "$2", img: "/images/starters/mangolian-wings.jpg" },
      { name: "Beef Tikka", desc: "6 pcs", price: "$2.5", img: "/images/starters/beef-tikka.jpeg" },
    ],
    salads: [
      { name: "Kachumar Salad", price: "$1", img: "/images/salads/katchumar-salad.jpg" },
      { name: "Red Beans Salad", price: "$1.5", img: "/images/salads/red-beans-salad.jpg" },
      { name: "Russian Salad", price: "$1.5", img: "/images/salads/russian-salad.jpg" },
      { name: "Caprese Salad", price: "$2", img: "/images/salads/caprese.jpg" },
    ],
    mainCourse: [
      { name: "Chicken Handi (½ kg, serves 2–3)", price: "$4.5", img: "/images/mainCourse/chicken-handi.jpg" },
      { name: "Mutton Qorma (½ kg, serves 2–3)", price: "$6.5", img: "/images/mainCourse/mutton-qorma.jpg" },
      { name: "Biryani / Pulao (per plate)", price: "$2", img: "/images/mainCourse/biryani.jpg" },
      { name: "Chicken Shashlik (with rice)", price: "$2.5", img: "/images/mainCourse/chicken-shashlik.jpg" },
      { name: "Egg Fried Rice", price: "$1.5", img: "/images/mainCourse/chinese-rice.jpg" },
      { name: "Chicken Butter Masala", price: "$3.5", img: "/images/mainCourse/chicken-butter-msala.jpeg" },
      { name: "Chicken Steak (with sides)", price: "$3.5", img: "/images/mainCourse/chicken-steak.jpg" },
      { name: "Beef Steak (with sides)", price: "$4.5", img: "/images/mainCourse/beaf-steak.jpg" },
      { name: "Mutton Karahi (½ kg)", price: "$6.5", img: "/images/mainCourse/mutton-karahi.jpeg" },
      { name: "Dam ka Keema", price: "$3", img: "/images/mainCourse/dam-ka-keema.jpeg" },
      { name: "Beef Haleem", price: "$2.5", img: "/images/mainCourse/beef-haleem.jpeg" },
      { name: "Beef Nihari", price: "$2.5", img: "/images/mainCourse/beef-nihari.jpeg" },
    ],
    drinks: [
      { name: "Mineral Water (small)", price: "$0.5", img: "/images/drinks/mineralwater.jpeg" },
      { name: "Avocado Smoothie", price: "$1.5", img: "/images/drinks/Avocado Smoothie.jpeg" },
      { name: "Black Berry Smoothie", price: "$1.5", img: "/images/drinks/blackberrysmoothie.jpeg" },
      { name: "Cold Coffee", price: "$1.5", img: "/images/drinks/coldcoffee.jpeg" },
      { name: "Mango Smoothie", price: "$1.5", img: "/images/drinks/mangosmoothie.jpeg" },
      { name: "Apple Juice", price: "$1", img: "/images/drinks/AppleJuice.jpeg" },
      { name: "Orange Juice", price: "$1", img: "/images/drinks/orangejuice.jpeg" },
      { name: "Pina Colada", price: "$2", img: "/images/drinks/PinaColada.jpeg" },
      { name: "Strawberry Smoothie", price: "$1.5", img: "/images/drinks/stawberrysmoothie.jpeg" },
      { name: "Soft Drinks (Coke/Sprite/7up)", price: "$1", img: "/images/drinks/softdrinks.jpg" },
    ],
    beverages: [
      { name: "Coffee", price: "$1", img: "/images/beverages/coffee.jpeg" },
      { name: "Green Tea", price: "$1", img: "/images/beverages/greentea.jpg" },
      { name: "Pink Tea", price: "$1.5", img: "/images/beverages/pinktea.jpeg" },
      { name: "Tea", price: "$0.5", img: "/images/beverages/tea.jpeg" },
    ],
    deserts: [
      { name: "Gajar Halwa (single serving)", price: "$1.5", img: "/images/deserts/gajar-halwa.jpeg" },
      { name: "Kheer (per bowl)", price: "$1", img: "/images/deserts/kheer.jpeg" },
      { name: "Shahi Tukray", price: "$1.5", img: "/images/deserts/shahi-tukry.jpeg" },
      { name: "Rasmalai (2 pcs)", price: "$1.5", img: "/images/deserts/ras-malai.jpg" },
      { name: "Red Velvet Slice", price: "$2", img: "/images/deserts/red-slice.jpg" },
      { name: "Lotus Cheese Cake Slice", price: "$2.5", img: "/images/deserts/lotus-slice.jpg" },
      { name: "Black Forest Cake Slice", price: "$2", img: "/images/deserts/black-slice.jpeg" },
      { name: "Tiramisu Slice", price: "$2", img: "/images/deserts/Tiramisu Slice.jpeg" },
      { name: "Vanilla Ice Cream", price: "$0.5", img: "/images/deserts/Vanilla-ice-cream.jpeg" },
      { name: "Chocolate Ice Cream", price: "$0.5", img: "/images/deserts/chocolate-ice-cream.jpeg" },
      { name: "Strawberry Ice Cream", price: "$0.5", img: "/images/deserts/strawberry-ice-cream.jpeg" },
      { name: "Mango Ice Cream", price: "$0.5", img: "/images/deserts/mango-ice-cream.jpeg" },
    ],
  
  }

  return (
    <div className="p-8 bg-gray-50 mt-20">
      {Object.entries(menuData).map(([category, items]) => (
        <div key={category} className="mb-12">
          <h2 className="text-3xl font-bold text-[#23a8d8] capitalize mb-5 text-center">
            {category.replace(/([A-Z])/g, " $1")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-55 w-full object-cover rounded-lg"
                />
                <h3 className="mt-3 text-lg font-semibold">{item.name}</h3>
                {item.desc && <p className="text-sm text-gray-500">{item.desc}</p>}
                {item.price && <p className="text-[#23a8d8] font-bold mt-1">{item.price}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExploreMenu
