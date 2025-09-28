import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./layout/pages/Login";
import Movies from "./layout/pages/Movies";
import Layout from "./layout/Layout";
import Theaters from "./layout/pages/Theaters";
import Users from "./layout/pages/Users";
import Orders from "./layout/pages/Orders";

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
