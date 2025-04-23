// src/utils/storyGeneration.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generates a story based on the provided characters and scenes
 * 
 * @param {object} storyData - Object containing characters, scenes, and preferences
 * @returns {Promise<Array<{title: string, content: string, images?: {beginning: string, middle: string, end: string}}>>} Promise that resolves to an array of story sections
 */
export const generateStory = async (storyData) => {
  try {
    // Create prompt for the API
    const prompt = createStoryPrompt(storyData);
    
    // Make an API call to the backend
    const response = await axios.post(`${API_BASE_URL}/story`, {
      query: prompt,
      story_context: '',
      cultural_context: storyData.useCulturalContext,
      language: storyData.selectedLanguage,
      user_preferences: {
        age: storyData.age,
        genre: storyData.selectedGenre,
        character_name: storyData.characterName,
        use_mythology: storyData.useMythology,
        use_cultural_context: storyData.useCulturalContext,
        fav_genres: storyData.favGenres.split(',').map(g => g.trim())
      }
    });
    
    // Return the story sections with images
    return [{
      title: 'Your Story',
      content: response.data.story,
      images: response.data.images
    }];
    
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story. Please try again later.');
  }
};

/**
 * Continues a story based on user input and previous story context
 * 
 * @param {object} params - Parameters for continuing the story
 * @param {string} params.prompt - User's input for continuing the story
 * @param {number} params.story_length - Length of the story continuation
 * @param {string} params.theme - Theme of the story
 * @param {Array} params.history - Previous story messages
 * @param {string} params.language - Language of the story
 * @param {boolean} params.useCulturalContext - Whether to use cultural context
 * @param {boolean} params.useMythology - Whether to use mythology
 * @returns {Promise<{content: string, images?: {beginning: string, middle: string, end: string}}>} Promise that resolves to the story continuation
 */
export const continueStory = async (params) => {
  try {
    // Make an API call to the backend
    const response = await axios.post(`${API_BASE_URL}/continue-story`, {
      userInput: params.prompt,
      storyLength: params.story_length,
      theme: params.theme,
      storyHistory: params.history,
      language: params.language,
      cultural_context: params.useCulturalContext,
      use_mythology: params.useMythology
    });
    
    // Return the story continuation with images
    return {
      content: response.data.storySegment,
      images: response.data.images
    };
    
  } catch (error) {
    console.error('Error continuing story:', error);
    throw new Error('Failed to continue the story. Please try again later.');
  }
};

/**
 * Creates a prompt for the language model based on story data
 */
const createStoryPrompt = (storyData) => {
  let prompt = "Generate a story appropriate for a listener aged " + storyData.age + " with the following elements:\n\n";
  
  // Add character descriptions
  if (storyData.characters.length > 0) {
    prompt += "Characters:\n";
    storyData.characters.forEach(char => {
      prompt += `- ${char.name}: ${char.description}\n`;
    });
  }
  
  // Add scene descriptions
  if (storyData.scenes.length > 0) {
    prompt += "\nScenes:\n";
    storyData.scenes.forEach(scene => {
      const keywordsText = scene.keywords.length > 0 
        ? ` (${scene.keywords.join(', ')})` 
        : '';
      prompt += `- ${scene.label}${keywordsText}\n`;
    });
  }
  
  // Add preferences
  prompt += "\nPreferences:\n";
  prompt += `- Listener's Age: ${storyData.age}\n`;
  prompt += `- Genre: ${storyData.selectedGenre}\n`;
  prompt += `- Language: ${storyData.selectedLanguage}\n`;
  prompt += `- Use Cultural Context: ${storyData.useCulturalContext}\n`;
  prompt += `- Use Mythology: ${storyData.useMythology}\n`;
  prompt += `- Favorite Genres: ${storyData.favGenres}\n`;
  
  // Add special needs accommodations if specified
  if (storyData.specialNeeds && storyData.specialNeeds.length > 0) {
    prompt += "\nSpecial Needs Accommodations:\n";
    
    // Handle predefined special needs
    storyData.specialNeeds.forEach(need => {
      if (!need.startsWith('custom_')) {
        switch (need) {
          case 'dyslexia':
            prompt += "- Use clear, simple fonts and spacing\n";
            prompt += "- Avoid complex sentence structures\n";
            prompt += "- Include visual aids and illustrations\n";
            break;
          case 'adhd':
            prompt += "- Keep paragraphs short and engaging\n";
            prompt += "- Include interactive elements\n";
            prompt += "- Use clear transitions between scenes\n";
            break;
          case 'autism':
            prompt += "- Use clear, literal language\n";
            prompt += "- Avoid idioms and metaphors\n";
            prompt += "- Include predictable patterns\n";
            break;
          case 'visual_impairment':
            prompt += "- Focus on auditory and tactile descriptions\n";
            prompt += "- Use rich sensory details\n";
            prompt += "- Avoid visual-only references\n";
            break;
          case 'hearing_impairment':
            prompt += "- Focus on visual descriptions\n";
            prompt += "- Include visual cues for sounds\n";
            prompt += "- Use clear visual storytelling\n";
            break;
          case 'anxiety':
            prompt += "- Use calming and positive themes\n";
            prompt += "- Avoid sudden surprises or conflicts\n";
            prompt += "- Include reassuring elements\n";
            break;
          case 'cognitive_delay':
            prompt += "- Use simple, clear language\n";
            prompt += "- Include repetitive patterns\n";
            prompt += "- Focus on basic concepts\n";
            break;
        }
      }
    });

    // Handle custom special needs
    const customNeeds = storyData.specialNeeds.filter(need => need.startsWith('custom_'));
    if (customNeeds.length > 0) {
      prompt += "\nCustom Special Needs:\n";
      customNeeds.forEach(need => {
        const customNeed = need.replace('custom_', '');
        prompt += `- Accommodate for: ${customNeed}\n`;
        prompt += `- Adjust story format and content accordingly\n`;
        prompt += `- Ensure accessibility and understanding\n`;
      });
    }
  }
  
  // Add age-appropriate content guidelines
  prompt += "\nThe story should be:\n";
  if (storyData.age < 6) {
    prompt += "- Simple and easy to understand\n";
    prompt += "- Use basic vocabulary and short sentences\n";
    prompt += "- Include repetitive patterns and rhymes\n";
    prompt += "- Focus on basic concepts and emotions\n";
  } else if (storyData.age < 9) {
    prompt += "- Use age-appropriate vocabulary\n";
    prompt += "- Include simple moral lessons\n";
    prompt += "- Have clear character motivations\n";
    prompt += "- Include some educational elements\n";
  } else if (storyData.age < 13) {
    prompt += "- Use more sophisticated vocabulary\n";
    prompt += "- Include deeper character development\n";
    prompt += "- Have more complex plot elements\n";
    prompt += "- Include age-relevant themes\n";
  } else {
    prompt += "- Use mature vocabulary and themes\n";
    prompt += "- Include complex character development\n";
    prompt += "- Have sophisticated plot elements\n";
    prompt += "- Address relevant life experiences\n";
  }
  
  prompt += "\nThe story should be engaging, positive, and include specific references to the visual characteristics of the characters and settings. ";
  prompt += "Divide the story into a beginning, middle, and end. Each section should be about 2-3 paragraphs.";
  
  return prompt;
};

/**
 * Generates a mock story for development/demo purposes
 */
const generateMockStory = (storyData) => {
  const characters = storyData.characters;
  const scenes = storyData.scenes;
  
  // Default sections
  const narrative = [
    {
      title: 'Beginning',
      content: 'Once upon a time...',
      imageId: scenes[0]?.id
    },
    {
      title: 'Middle',
      content: 'And then something happened...',
      imageId: scenes[1]?.id || scenes[0]?.id
    },
    {
      title: 'End',
      content: 'Finally, they all lived happily ever after.',
      imageId: scenes[scenes.length - 1]?.id
    }
  ];
  
  // If we have characters, customize the story
  if (characters.length > 0) {
    const mainCharacter = characters[0];
    
    narrative[0].content = `Once upon a time, there was ${mainCharacter.description} named ${mainCharacter.name}. `;
    narrative[0].content += `${mainCharacter.name} was the most ${mainCharacter.features?.colorDescription || 'colorful'} character in the whole land. `;
    
    if (characters.length > 1) {
      const friend = characters[1];
      narrative[0].content += `${mainCharacter.name}'s best friend was ${friend.name}, who was ${friend.description}. `;
      narrative[0].content += `They did everything together and had many adventures.`;
    } else {
      narrative[0].content += `${mainCharacter.name} loved going on adventures and making new friends.`;
    }
    
    // Add a second paragraph
    narrative[0].content += `\n\nEvery morning, ${mainCharacter.name} would wake up excited for a new day of exploration. `;
    narrative[0].content += `"What will I discover today?" ${mainCharacter.name} would ask, looking out the window with excitement.`;
  }
  
  // If we have scenes, customize the setting
  if (scenes.length > 0) {
    const mainScene = scenes[0];
    
    if (characters.length > 0) {
      const mainCharacter = characters[0];
      narrative[1].content = `One day, ${mainCharacter.name} decided to visit the ${mainScene.label}. `;
      
      if (mainScene.keywords && mainScene.keywords.length > 0) {
        narrative[1].content += `It was a ${mainScene.keywords.join(', ')} place full of wonder. `;
      }
      
      narrative[1].content += `"Wow!" said ${mainCharacter.name}, looking around at the ${mainScene.features?.colorDescription || 'colorful'} surroundings. `;
      
      if (characters.length > 1) {
        const friend = characters[1];
        narrative[1].content += `"Look at that!" shouted ${friend.name}, pointing excitedly.`;
      } else {
        narrative[1].content += `"This is the most amazing place I've ever seen!"`;
      }
      
      // Add another paragraph
      narrative[1].content += `\n\nAs they explored the ${mainScene.label}, they found many interesting things. `;
      narrative[1].content += `There were strange sounds and beautiful sights everywhere they looked. `;
      narrative[1].content += `It was going to be a day full of unexpected surprises!`;
    }
    
    // End the story
    if (characters.length > 0) {
      const mainCharacter = characters[0];
      narrative[2].content = `After their amazing adventure in the ${mainScene.label}, `;
      narrative[2].content += `${mainCharacter.name} felt happy and proud. `;
      
      if (characters.length > 1) {
        const friend = characters[1];
        narrative[2].content += `${mainCharacter.name} and ${friend.name} had learned so much and had so much fun together. `;
      } else {
        narrative[2].content += `${mainCharacter.name} had learned so much and had so much fun. `;
      }
      
      narrative[2].content += `They couldn't wait for their next adventure!`;
      
      // Add closing paragraph
      narrative[2].content += `\n\nAnd as the sun began to set, casting a warm golden glow over everything, `;
      narrative[2].content += `they headed home with hearts full of joy and heads full of memories. `;
      narrative[2].content += `It had been the perfect day, and tomorrow would bring new adventures for ${mainCharacter.name}`;
      narrative[2].content += characters.length > 1 ? ` and friends.` : `.`;
    }
  }
  
  return narrative;
};