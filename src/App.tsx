import "./App.css"
import { UserBalance } from "./components/UserBalance"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import UserInventory from "./pages/UserInventory"
import { Navbar } from "./components/NavBar"
import ItemsOnSale from "./components/ItemsOnSale"

const App = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <Navbar />

          <Routes>
            <Route path="/" element={<UserInventory />} />
            <Route path="/prices" element={<UserBalance />} />
            <Route path="/selling" element={<ItemsOnSale />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
