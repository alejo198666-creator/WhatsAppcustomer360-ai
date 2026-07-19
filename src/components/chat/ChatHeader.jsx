import { Box,Avatar,Typography } from "@mui/material";

export default function ChatHeader(){

return(

<Box

sx={{

height:70,

background:"#075E54",

display:"flex",

alignItems:"center",

padding:2,

color:"white"

}}

>

<Avatar>

AI

</Avatar>

<Box ml={2}>

<Typography fontWeight="bold">

Customer360 AI

</Typography>

<Typography fontSize={12}>

En línea

</Typography>

</Box>

</Box>

);

}