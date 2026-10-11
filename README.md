# Restaurant App MVP (React Native, frontend only)

Assignment 1, Fall 2026. A customer can browse a menu, search, add to cart, apply a promo code, reserve a table,
place an order and watch it progress. A manager can update orders, answer reservations and edit the menu.
There is **no backend**: everything is mock data held in React state and saved in AsyncStorage.

## Run it

```bash
npm install
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npx expo start
```

Demo accounts: `customer@test.com / customer123` and `manager@test.com / manager123` (or sign up).

Screen recording of the full flow (max 3 min): **PASTE YOUR LINK HERE**

## Folder structure

```
app.js / index.js            entry point + all providers
A1/SRS.pdf, A1/UML/*.png     documents
src/data                     users.js, menu.js, tables.js, promos.js   (mock data)
src/context                  Theme, Auth, Menu, Reservations, Orders, Cart providers
src/reducers                 cartReducer (+ tests), ordersReducer, menuReducer, ...
src/hooks                    useForm, useDebounce, useReservation, usePersistedReducer
src/components               MenuItemCard (React.memo), StatusStepper, AppButton, Chip
src/screens                  Login, Menu, Cart, OrderSummary, OrderTracking, MyOrders, Reservation, Profile, ManagerDashboard
src/navigation               AppNavigator (stack + bottom tabs), navigationRef
```

## Hook map (which question uses what)

| Q | Hook(s) | Where |
|---|---------|-------|
| 3 | useState | LoginScreen (mode, showPassword, isSubmitting), useForm (values, errors) |
| 4 | useState, useEffect | MenuScreen (loading, filtering, header title, cleanup) |
| 5 | useRef | MenuScreen (input ref, list ref, render counter, previous query) |
| 6 | useContext | src/context, ProfileScreen |
| 7 | useReducer | cartReducer, CartContext |
| 8 | useMemo, useCallback, React.memo | OrderSummaryScreen, MenuScreen, MenuItemCard |
| 9 | custom hooks | src/hooks |
| 10 | useEffect (timers, storage) | OrderTrackingScreen, usePersistedReducer |

## Q4 note: what if the filtering effect has an empty dependency array?

If the effect that builds `filteredItems` used `[]`, it would run only once, right after the first render, when
`menuItems` is still the empty array from the initial state. It would never see the 1.5 second "fetched" menu and it
would never run again when the user taps a different category chip. The list would stay empty (or stale) forever,
because React only re-runs an effect when something in its dependency array changes. The correct array is
`[selectedCategory, menuItems]`, so the effect runs again whenever either value changes. (In the final version
of the app this effect was replaced by a single `useMemo`, see Q8.)

## Q5 note: the manual debounce (replaced by useDebounce in Q9)

```js
const timeoutRef = useRef(null);
const onChangeText = (text) => {
  setSearchText(text);
  clearTimeout(timeoutRef.current);                       // cancel the previous timer on every keystroke
  timeoutRef.current = setTimeout(() => setQuery(text), 400); // apply after 400 ms of inactivity
};
useEffect(() => () => clearTimeout(timeoutRef.current), []);  // clear on unmount
```

To take the "render counter" screenshot: open the Menu tab, type a word and wait; the label above the list shows
`Renders: N`. A ref change alone never increases it, only state changes do.

## Q6 note: why Context instead of prop drilling

The logged-in user and the theme are needed on almost every screen (header colours, role based tabs, profile,
order creation). Passing them as props through the navigator, the tabs, and each screen would mean many components
carry props they never use. With Context, any component reads `useAuth()` or `useTheme()` directly, and the
provider is the only place that owns the state. This also makes logout and the dark mode toggle instant for the
whole app. One drawback: every component that consumes a context re-renders when the context value changes, even if it only uses a small part of it.

## Q7: Cart reducer test cases

| # | Action | Initial state | Expected state |
|---|--------|---------------|----------------|
| 1 | ADD_ITEM (Zinger Burger) | empty cart | 1 item, qty 1, note "" |
| 2 | ADD_ITEM (same burger again) | burger qty 1 | still 1 item, qty 2 |
| 3 | INCREMENT id 9 | burger qty 1 | burger qty 2 |
| 4 | DECREMENT id 9 | burger qty 1 | items = [] (removed at 0) |
| 5 | UPDATE_NOTE id 9 "no onions" | burger qty 1 | note = "no onions" |
| 6 | APPLY_PROMO FEAST20 / 20 | any cart | promoCode "FEAST20", discountPercent 20 |
| 7 | REMOVE_PROMO | promo applied | promoCode null, discountPercent 0 |
| 8 | CLEAR_CART | items + promo | initial state |

These are implemented as Jest tests in `src/reducers/cartReducer.test.js` (bonus). Run with
`npm i -D jest jest-expo` then add `"jest": { "preset": "jest-expo" }` and `"test": "jest"` to package.json, and `npm test`.

## Q7 note: useReducer vs useState for the cart

The cart has several related fields (items, promo code, discount) and eight different ways to change them. With
useReducer every change is a named action handled in one pure function, so the rules (for example "quantity 0 removes
the item") live in one place and can be unit tested without rendering anything. With useState we would scatter
`setItems`, `setPromo` and `setDiscount` calls across screens and could easily leave them out of sync. useState would
have been enough if the cart were only a single list with add and remove, or just a counter.

## Q8 note: when NOT to use useMemo / useCallback

Do not wrap everything by default. Both hooks cost memory and a dependency comparison on every render, so they only
pay off when the saved work is bigger than that cost. Skip useMemo for cheap calculations (adding two numbers,
filtering five items) and skip useCallback for handlers passed to ordinary elements such as a Pressable, or to
components that are not wrapped in React.memo, because a new function reference then changes nothing.
Also skip them when the dependency array changes on almost every render, which makes the cache useless. Use them
for expensive calculations, long lists and memoised children whose props must stay referentially stable. Measure first.

## Q8: console screenshots (do these yourself)

1. **Before:** in `MenuItemCard.js` comment out `memo(...)` (export the plain function), run the app, tap one heart.
   The Metro terminal prints a `[render] MenuItemCard -> ...` line for every visible card. Take a screenshot.
2. **After:** restore `export default memo(MenuItemCard)`, tap one heart again. Only the toggled card logs. Take a screenshot.

## Full flow test checklist (Q10)

Sign up as customer, browse + search, add items, apply WELCOME10, reserve a table, place an order, watch it move
Pending, Preparing, Ready, Served; log out, log in as manager, open Dashboard, update the same order, accept the reservation, add a menu item and check that it shows on the customer's Menu.
