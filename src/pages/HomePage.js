import { Container, } from "react-bootstrap";
import classes from "./HomePage.module.css"; // Import your CSS file for styling

import { Link} from "react-router-dom";
import { useState } from "react";
import ContactDetails from "../components/ContactDetails/ContactDetails";

const HomePage = () => {

  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () =>{
    setShowModal(false);
  };
  return (
    <div className={classes.underline}>
      <Container>
        <div className={classes.flexContainer}>
          <p>Welcome to Expense Tracker!!!</p>
          <p className={classes.alignRight}>
            Your profile is incomplete.{" "}
            <Link to="/contactdetails" onClick={handleOpenModal}>Complete now</Link>
          </p>
        </div>
      </Container>
      <div className={classes.bottomBorder}></div>
      {showModal && <ContactDetails onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;
