import React, { useState } from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import useCreateUser from '../hooks/useCreateUser';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useUsers } from '../../fetch/userContext';

function CreateUser({ userType, onClose }) {
  const { refreshUsers } = useUsers(); // Få adgang til din nye refreshUsers funktion

  const normalizedUserType = userType === 'Cashbook' ? 'own' : (userType === 'customer' ? 'client' : userType);
  const navigate = useNavigate()
  const { t } = useTranslation(); 
  const [formData, setFormData] = useState({
    userType: normalizedUserType,
    name: '', // Kun dette felt er required
    companyName: '',
    phoneNumber: '',
    email: '',
    address: '',
    watch: 0, // Bruger 0 som default for false, og 1 for true
    balanceLimit: '', // Fortsat numerisk værdi
    blackListed: 0, // Bruger 0 som default for false, og 1 for true
    removed: 0, // Bruger 0 som default for false, og 1 for true
  });

  const createUser = useCreateUser();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if(type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked ? 1 : 0 // Opdaterer til 1 for true, 0 for false
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Opret et kort for at omdanne formfelter til læsbare titler
    const fieldTitles = {
        name: 'Name',
        companyName: 'Company Name',
        phoneNumber: 'Phone Number',
        email: 'Email',
        address: 'Address',
        watch: 'Watch Status',
        balanceLimit: 'Balance Limit',
        blackListed: 'Blacklisted Status'
    };

    // Opret en streng, der viser den læsbare version af formdata
    const formDataEntries = Object.entries(formData)
      .filter(([key]) => Object.keys(fieldTitles).includes(key)) // Filtrer for kun specifikke felter
      .map(([key, value]) => {
        let readableValue = value;
        if (key === 'watch' || key === 'blackListed') {
            readableValue = value === 1 ? 'Yes' : 'No'; // Omdan 1 til 'Yes' og 0 til 'No'
        }
        return `${fieldTitles[key]}: ${readableValue}`;
      })
      .join('\n');

    console.log('Form data:', formDataEntries);

    // Vis den læsbare version i en bekræftelsesdialog
    const confirmMessage = `Please confirm your details:\n${formDataEntries}\nPress OK to continue.`;
    const isConfirmed = window.confirm(confirmMessage);

    if (isConfirmed) {
        try {
            // Vent på at createUser operationen er fuldført
            await createUser(formData);
            onClose(); // Lukker formularen/modalen
            await refreshUsers();
            
            // Navigation baseret på normalizedUserType
            switch (normalizedUserType) {
                case 'client':
                    navigate('/dashboard/');
                    break;
                case 'supplier':
                    navigate('/dashboard/Supplier');
                    break;
                case 'own':
                    navigate('/dashboard/Cashbook');
                    break;
                default:
                    break;
            }

            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1000);
        } catch (error) {
            console.error('Error creating user:', error);
            alert("Error creating user"); // Eller en anden form for fejlmeddelelse
        }
    }
};


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('userType:', normalizedUserType);

//     try {
//         // Vent på at createUser operationen er fuldført
//         await createUser(formData);
//         // Efter brugeroprettelsen kan du lukke formen eller navigere væk
//         onClose(); // Lukker formularen/modalen
//         await refreshUsers();
//         switch(normalizedUserType) {
//             case 'client':
//                 navigate('/dashboard/');
//                 break;
//             case 'supplier':
//                 navigate('/dashboard/Supplier');
//                 break;
//             case 'own':
//                 navigate('/dashboard/Cashbook');
//                 break;
//             default:
//                 // Du kan navigere til en standardrute eller lade være med at navigere nogen steder
//                 break;
//         }
        
//         // Vent et kort øjeblik efter navigationen for at sikre, at den nye side er blevet indlæst
//         setTimeout(() => {
//             // Scroll ned til bunden af siden
//             window.scrollTo({
//                 top: document.body.scrollHeight,
//                 behavior: 'smooth' // Dette tillader en glat scrollingeffekt
//             });
//         }, 1000); // Du kan øge dette tal, hvis det er nødvendigt, for at sikre, at siden er fuldt indlæst
        
//     } catch (error) {
//         // Håndtér fejl her, hvis createUser kaster en fejl
//         console.error('Error creating user:', error);
//         // Måske vis en fejlmeddelelse til brugeren
//     }
// };


  

  return (
    <Container className="m-3">
      <Form onSubmit={handleSubmit}>
  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>{t("table.name")}</Form.Label>
      <Form.Control
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required // Kun dette felt er required
      />
    </Form.Group>

    <Form.Group as={Col}>
      <Form.Label>{t("table.companyName")}</Form.Label>
      <Form.Control
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>{t("table.phoneNumber")}</Form.Label>
      <Form.Control
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group as={Col}>
      <Form.Label>{t("table.mail")}</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Label>{t("table.address")}</Form.Label>
      <Form.Control
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group as={Col}>
      <Form.Label>{t("common.balanceLimit")}</Form.Label>
      <Form.Control
        type="number"
        name="balanceLimit"
        value={formData.balanceLimit}
        onChange={handleChange}
      />
    </Form.Group>
  </Row>

  <Row className="mb-3">
    <Form.Group as={Col}>
      <Form.Check 
        type="switch"
        label=  {t("common.watch")}
        name="watch"
        checked={formData.watch === 1}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group as={Col}>
      <Form.Check 
        type="switch"
        label= {t("common.blacklisted")}
        name="blackListed"
        checked={formData.blackListed === 1}
        onChange={handleChange}
      />
    </Form.Group>
  </Row>

  <Button variant="primary" type="submit" style={{ margin: "10px" }}>
  {t("common.createUser")}

  </Button>

  <Button variant="secondary" onClick={onClose} style={{ margin: "10px" }}>
  {t("common.close")}
  </Button>
</Form>

    </Container>
  );
}

export default CreateUser;
