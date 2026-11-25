import React from "react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";
import styles from "./App.module.css";

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            MOVIE<span>.</span>
          </Link>
          <Link to="/" className={styles.navLink}>
            평점 높은 영화
          </Link>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default App;
