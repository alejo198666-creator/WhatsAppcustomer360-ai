import { Box } from "@mui/material";

import ChatHeader from "../chat/ChatHeader";
import ChatBody from "../chat/ChatBody";
import ChatInput from "../chat/ChatInput";

export default function MainLayout(){

return(

<Box

sx={{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:"#ECE5DD"

}}

>

<Box

sx={{

width:350,

height:600,

background:"#fff",

borderRadius:4,

overflow:"hidden",

display:"flex",

flexDirection:"column",

boxShadow:8

}}

>

<ChatHeader/>

<ChatBody/>

<ChatInput/>

</Box>

</Box>

);

}