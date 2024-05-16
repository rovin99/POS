import React, { useState } from 'react';
import { Row, Col, Form, Button, Layout,Input,InputNumber,Switch } from 'antd';
import useCreateUser from '../hooks/useCreateUser';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useUsers } from '../../fetch/userContext';
const { Content } = Layout;
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
  <Content style={{ padding: '20px' }}>
    <Form onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("table.name")}
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t("table.companyName")} name="companyName">
            <Input onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={t("table.phoneNumber")} name="phoneNumber">
            <Input onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t("table.mail")} name="email">
            <Input onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={t("table.address")} name="address">
            <Input onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t("common.balanceLimit")} name="balanceLimit">
            <InputNumber onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t("common.watch")}
            name="watch"
            valuePropName="checked"
          >
            <Switch onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t("common.blacklisted")}
            name="blackListed"
            valuePropName="checked"
          >
            <Switch onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col>
          <Button type="primary" htmlType="submit" style={{ margin: '10px' }}>
            {t("common.createUser")}
          </Button>
          <Button type="default" onClick={onClose} style={{ margin: '10px' }}>
            {t("common.close")}
          </Button>
        </Col>
      </Row>
    </Form>
  </Content>
);
}

export default CreateUser;
