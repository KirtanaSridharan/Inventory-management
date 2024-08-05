'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material"
import { collection, getDoc, query, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}
 
export default function Home() {
  const [inventory, setInventory] = useState([]) // state variables to add the inventory 
  const [open, setOpen] = useState(false) //state variables for bottles - to add and remove stuff 
  const [itemName, setItemName] = useState('')
  const [filteredInventory, setFilteredInventory] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async() => {  // fetching database from firebase 
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await(getDocs(snapshot))
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      }  // more than one value to add in the list, use {}
      )
    })
    console.log('Fetched inventory:', inventoryList);
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }


  useEffect(() => {
    updateInventory()
   }, [])

  useEffect(() => {
    if (searchQuery){
      setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
    }
    else {
      setFilteredInventory(inventory)
    }
  }, [searchQuery, inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1 })
        }
      else{
        await setDoc(docRef, {quantity: 1 }) 
      }
      await updateInventory()
    }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1 })
      }
  }
  await updateInventory()
}

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)




return (
  <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="contained" onClick={handleOpen}>
      Add New Item
    </Button>

    
    {/* <TextField 
      id="search" 
      label="Search" 
      variant="outlined" 
      fullWidth 
      margin="normal" 
      value={searchQuery} 
      onChange={(e)=> setSearchQuery(e.target.value)}></TextField> */}


    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
          Inventory Items
        </Typography>
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {inventory.map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
              {quantity}
            </Typography>
            <Button
            variant="outlined"
            onClick={() => {
              addItem(name)
              handleClose()
            }}
          >
            Add
          </Button>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
)

  }
