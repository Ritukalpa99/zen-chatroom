import {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {Box, Container,TabList,Tabs,Tab,Text, TabPanels, TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const Homepage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        

        if(userInfo) {
            navigate('/chats')
        }
    }, [navigate])


    return <Container maxW='xl' centerContent>
        <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px" 
        >
            <Text fontSize="4xl" fontFamily="Work Sans">Zen Chatroom</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs variant="soft-rounded">
                <TabList mb="1em">
                    <Tab w="50%">Login</Tab >
                    <Tab w="50%">Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
} 

export default Homepage;