export const NEUMORPHIC_CARD_STYLE = {
  borderRadius: "49px",
  background: "linear-gradient(145deg, #9e3b6a, #bb467e)",
  boxShadow: "27px 27px 54px #6d2849, -27px -27px 54px #f25aa3",
}

// Update the COOKIE_FLAVORS to match the specified flavors
export const COOKIE_FLAVORS = [
  { id: "chocolate", name: "Chocolate", color: "bg-amber-900" },
  { id: "orange", name: "Orange", color: "bg-orange-500" },
  { id: "lemon", name: "Lemon", color: "bg-yellow-400" },
  { id: "sugar", name: "Sugar", color: "bg-amber-100" },
]

export const COOKIE_SHAPES = [
  { id: "circle", name: "Circle", image: "/classic-round-cookies.png" },
  { id: "heart", name: "Heart", image: "/classic-heart-cookie.png" },
  { id: "crown", name: "Crown", image: "/golden-crown-cookies.png" },
  { id: "bunny", name: "Bunny", image: "/bunny-cookie-cutter.png" },
  { id: "clover", name: "Clover", image: "/clover-cookie.png" },
  { id: "rectangle", name: "Rectangle", image: "/simple-rectangle-cookies.png" },
  { id: "baby-bottle", name: "Baby Bottle", image: "/baby-bottle-cookies.png" },
]

// Update the CHOCOLATE_FLAVORS to match the specified flavors
export const CHOCOLATE_FLAVORS = [
  { id: "dark", name: "Dark Chocolate" },
  { id: "milk", name: "Milk Chocolate" },
  { id: "white", name: "White Chocolate" },
  { id: "dark-milk", name: "Dark with Milk Chocolate" },
  { id: "dark-white", name: "Dark with White Chocolate" },
  { id: "milk-dark", name: "Milk with Dark Chocolate" },
  { id: "milk-white", name: "Milk with White Chocolate" },
  { id: "white-dark", name: "White with Dark Chocolate" },
  { id: "white-milk", name: "White with Milk Chocolate" },
]

export const OCCASIONS = [
  { id: "birthday", name: "Birthday" },
  { id: "baby", name: "Baby" },
  { id: "wedding", name: "Wedding & Engagement" },
  { id: "anniversary", name: "Anniversary" },
  { id: "graduation", name: "Graduation" },
  { id: "thank-you", name: "Thank You" },
  { id: "corporate", name: "Corporate Logo Desserts" },
  { id: "bachelorette", name: "Bachelorette Desserts" },
  { id: "valentines", name: "Valentine's Day" },
  { id: "superbowl", name: "Football Super Bowl" },
  { id: "stpatricks", name: "St. Patrick's Day" },
  { id: "easter", name: "Easter" },
  { id: "mothers-day", name: "Mother's Day" },
  { id: "fathers-day", name: "Father's Day" },
  { id: "july4", name: "July 4th" },
  { id: "halloween", name: "Halloween" },
  { id: "thanksgiving", name: "Fall Thanksgiving" },
  { id: "hanukkah", name: "Hanukkah" },
  { id: "christmas", name: "Christmas & Winter Holiday" },
  { id: "new-years", name: "New Years" },
]

// Update the PRICING object with the correct pricing structure
export const PRICING = {
  cookies: {
    single: 10, // pickup only
    six: 30,
    twelve: 54, // 10% off
    eighteen: 76.5, // 15% off
    twentyFour: 96, // 20% off
  },
  chocolateBars: {
    single: 18,
    four: 64.8, // 10% off
    eight: 122.4, // 15% off
  },
  regularChocolate: {
    twoPiece: 15,
    fourPiece: 30,
    sixPiece: 40.5, // 10% off
    eightPiece: 51, // 15% off
    tenPiece: 75,
    twelvePiece: 72, // 20% off
    fourteenPiece: 84, // 20% off
  },
  subscriptions: {
    muse: 39,
    velvet: 69,
    blackLabel: 99,
  },
}
