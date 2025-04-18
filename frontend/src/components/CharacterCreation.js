// // src/components/CharacterCreation.js
// import React, { useState } from 'react';
// import { 
//   Box, 
//   Paper, 
//   Typography, 
//   TextField, 
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Divider,
//   Alert
// } from '@mui/material';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import DrawingCanvas from './DrawingCanvas';
// import { analyzeImage } from '../utils/imageAnalysis';

// const CharacterCreation = ({ onNext, addCharacter, characters }) => {
//   const [characterName, setCharacterName] = useState('');
//   const [characterDescription, setCharacterDescription] = useState('');
//   const [showAlert, setShowAlert] = useState(false);

//   const handleSaveCharacter = async (imageData) => {
//     if (!characterName.trim()) {
//       setShowAlert(true);
//       return;
//     }
    
//     // Analyze the drawn image
//     const features = await analyzeImage(imageData);
    
//     // Create character object
//     const character = {
//       id: Date.now(),
//       name: characterName,
//       description: characterDescription || features.characterDescription,
//       image: imageData,
//       features: features
//     };
    
//     // Add character to the story data
//     addCharacter(character);
    
//     // Reset form
//     setCharacterName('');
//     setCharacterDescription('');
//     setShowAlert(false);
//   };

//   return (
//     <Box sx={{ mb: 4 }}>
//       <Typography variant="h2" gutterBottom align="center">
//         Create Your Characters
//       </Typography>
      
//       <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Instructions
//         </Typography>
//         <Typography variant="body1" paragraph>
//           Draw your character in the canvas below. Make it as colorful and unique as you want! 
//           Give your character a name and an optional description. You can create multiple characters 
//           for your story.
//         </Typography>
        
//         <Divider sx={{ my: 2 }} />
        
//         {showAlert && (
//           <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setShowAlert(false)}>
//             Please give your character a name before saving!
//           </Alert>
//         )}
        
//         <Box sx={{ mb: 3 }}>
//           <TextField
//             fullWidth
//             label="Character Name"
//             variant="outlined"
//             value={characterName}
//             onChange={(e) => setCharacterName(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Character Description (Optional)"
//             variant="outlined"
//             multiline
//             rows={2}
//             value={characterDescription}
//             onChange={(e) => setCharacterDescription(e.target.value)}
//             helperText="If left blank, we'll generate a description based on your drawing"
//           />
//         </Box>
        
//         <DrawingCanvas 
//           width={400} 
//           height={400} 
//           onSave={handleSaveCharacter} 
//         />
//       </Paper>
      
//       {characters.length > 0 && (
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Your Characters
//           </Typography>
//           <Grid container spacing={2}>
//             {characters.map((character) => (
//               <Grid item xs={12} sm={6} md={4} key={character.id}>
//                 <Card>
//                   <CardMedia
//                     component="img"
//                     height="140"
//                     image={character.image}
//                     alt={character.name}
//                     sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
//                   />
//                   <CardContent>
//                     <Typography variant="h6">{character.name}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {character.description}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
      
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button
//           variant="contained"
//           color="primary"
//           endIcon={<ArrowForwardIcon />}
//           onClick={onNext}
//           disabled={characters.length === 0}
//         >
//           Next: Create Scenes
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CharacterCreation;