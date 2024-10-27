import { Container } from "react-bootstrap";
import styles from './HomePage.module.css';
import AddExpenseForm from "../components/AddExpense/AddExpenseForm";

const HomePage = () => {
  
  return (
    <>
      <div className={styles.homePageContainer}>
        <Container>
          <div className={styles.welcomeMessage}>
            <p>Welcome to Expense Tracker!!!</p>
          </div>
        </Container>
      </div>
      <AddExpenseForm />
      
    </>
  );
};

export default HomePage;
