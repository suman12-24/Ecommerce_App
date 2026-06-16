# E-Commerce React Native App

A polished React Native e-commerce application featuring product browsing, sorting, filtering, and a persistent shopping bag powered by Redux Toolkit.

---

## 📱 Screenshots

| Products Screen | Sort Modal | Filter Modal | Bag (Filled) | Bag (Empty) |
|:-:|:-:|:-:|:-:|:-:|
| Product listing with cards | Sort bottom sheet | Filter bottom sheet | Bag with totals | Empty state |

---

## ✨ Features

- **Products Screen** — Fetches and displays products from `https://fakestoreapi.com/products`
- **Sorting** — Price: Low→High, High→Low, Rating: High→Low (functional); additional UI-only options
- **Filtering** — Filter by category (functional); price range, rating, discount (UI only)
- **Add to Bag** — Add any product to the shopping bag with one tap
- **Bag Screen** — Full bag management with quantity controls and grand total
- **Persistence** — Bag survives app restarts via AsyncStorage + redux-persist
- **Empty States** — Friendly empty bag and network error states

---

## 🛠 Tech Stack

| Library | Purpose |
|---|---|
| React Native 0.75.4 | Core framework |
| Redux Toolkit | State management |
| react-redux | React-Redux bindings |
| redux-persist | Bag persistence |
| @react-native-async-storage/async-storage | Local storage |
| @react-navigation/native + stack | Navigation |
| react-native-screens | Native screen optimization |
| react-native-safe-area-context | Safe area handling |

---

## 🚀 Setup & Run Instructions

### Prerequisites

Make sure you have the React Native development environment set up:
- Node.js ≥ 18
- JDK 17 (for Android)
- Android Studio with an emulator **or** a physical Android device
- Xcode 15+ (for iOS, macOS only)

> Follow the official guide if needed: https://reactnative.dev/docs/environment-setup

### 1. Clone the Repository

```bash
git clone https://github.com/suman12-24/Ecommerce_App.git
cd ecommerce-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. iOS — Install Pods (macOS only)

```bash
cd ios && pod install && cd ..
```

### 4. Start Metro Bundler

```bash
npm start
```

### 5. Run on Android

```bash
npm run android
```

Make sure an Android emulator is running or a physical device is connected via USB with USB debugging enabled.

### 6. Run on iOS (macOS only)

```bash
npm run ios
```

---

## 🤖 Android Build Configuration

```gradle
android {
    buildToolsVersion = "35.0.0"
    compileSdkVersion = 35
    
    defaultConfig {
        minSdkVersion = 24
        targetSdkVersion = 35
    }
}
```

> **Note:** `minSdkVersion 24` means the app supports Android 7.0 (Nougat) and above.

---

## 📂 Project Structure

```
ecommerce-app/
├── App.js                        # Root with Provider + PersistGate
├── src/
│   ├── store/
│   │   ├── index.js              # Redux store + persistor
│   │   ├── bagSlice.js           # Bag state + actions
│   │   └── productsSlice.js      # Products state + async thunk
│   ├── screens/
│   │   ├── ProductsScreen.js     # Main products listing
│   │   └── BagScreen.js          # Shopping bag
│   ├── components/
│   │   ├── ProductCard.js        # Individual product card
│   │   ├── SortModal.js          # Sort bottom sheet
│   │   └── FilterModal.js        # Filter bottom sheet
│   ├── navigation/
│   │   └── AppNavigator.js       # Stack navigator
│   └── theme/
│       └── index.js              # Colors, fonts, spacing constants
├── package.json
└── README.md
```

---

## 🧠 Redux Actions Reference

### Bag Slice (`src/store/bagSlice.js`)

| Action | Payload | Description |
|---|---|---|
| `addToBag(product)` | Product object | Adds product; increments qty if already in bag |
| `removeFromBag(id)` | Product ID | Completely removes item from bag |
| `increaseQuantity(id)` | Product ID | Increments item quantity by 1 |
| `decreaseQuantity(id)` | Product ID | Decrements qty; removes if qty reaches 0 |
| `clearBag()` | — | Empties the entire bag |

### Products Slice (`src/store/productsSlice.js`)

| Action | Payload | Description |
|---|---|---|
| `fetchProducts()` | — | Async thunk; fetches from FakeStoreAPI |
| `setSortOption(value)` | Sort key string | Sets active sort |
| `setActiveCategory(cat)` | Category string | Sets active category filter |
| `clearFilters()` | — | Resets all filters |

---

## 💾 Bag Persistence

The shopping bag is persisted using `redux-persist` with `AsyncStorage`. The bag state survives:
- App backgrounding
- Full app close and reopen
- Device restart

Only the `bag` slice is persisted; `products` data is always freshly fetched.

---

## 🎨 Design Notes

- Clean, minimal UI inspired by modern e-commerce apps
- Active sort/filter pills displayed below the header for transparency
- "In Bag" confirmation state on product cards
- Quantity decrease to 0 triggers item removal with trash icon
- Free delivery threshold shown dynamically in bag summary
- Category labels auto-extracted from API response

---


## 📦 Building APK (Android Release)

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

> For a signed release APK, configure a keystore in `android/app/build.gradle`.