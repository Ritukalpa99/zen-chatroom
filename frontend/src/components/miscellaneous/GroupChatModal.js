import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers,setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, chats, setChats} = ChatState();


    const handleSearch = async (query) => {
      setSearch(query);
      if(!query) {
        return;
      }
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.get(`/api/user?search=${search}`, config);
        setLoading(false);
        setSearchResults(data);
      }catch(error) {
        toast({
          title: "Error Occured",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      } 
    }

    const handleSubmit = async () => {
      if(!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.post('/api/chat/group', {
          name: groupChatName,
          users : JSON.stringify(selectedUsers.map(u => u._id)),
        }, config);

        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }catch(error) {
        toast({
          title: "Failed to Create the Chat!",
          description : error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }

    const handleDelete = (deletedUser) => {
      setSelectedUsers(selectedUsers.filter(sel => sel._id !== deletedUser._id))
    }

    const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)) {
        toast({
          title: "User alredy added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        }); 
        return;
      }

      setSelectedUsers([...selectedUsers, userToAdd]);
    }

     return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          display="flex"
          fontSize="35px"
          fontFamily="Work sans"
          justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input placeholder='Chat name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)}/>
            </FormControl>
            {/* list of selected users */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map(u => (
                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)}/>
              ))}
            </Box>

            {/* render searched users */}
            
            {loading ? <div>loading</div> : (
              searchResults?.slice(0,4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
     }
export default GroupChatModal