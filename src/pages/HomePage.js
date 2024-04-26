import { Container } from "react-bootstrap";
import classes from "./HomePage.module.css";

import { Link } from "react-router-dom";
import { useState } from "react";
import ContactDetails from "../components/ContactDetails/ContactDetails";
import AddExpenseForm from "../components/AddExpense/AddExpenseForm";
import { useSelector } from "react-redux";

const HomePage = () => {
  const userData = useSelector((state) => state.auth.userData);

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className={classes.underline}>
        <Container>
          <div className={classes.flexContainer}>
            <p>Welcome to Expense Tracker!!!</p>
            {userData ? (
              <p className={classes.alignRight}>Your profile is complete.</p>
            ) : (
              <p className={classes.alignRight}>
                Your profile is incomplete.{" "}
                <Link to="/contactdetails" onClick={handleOpenModal}>
                  Complete now
                </Link>
              </p>
            )}
          </div>
        </Container>
      </div>
      <AddExpenseForm />
      {showModal && <ContactDetails onClose={handleCloseModal} />}
    </>
  );
};

export default HomePage;
