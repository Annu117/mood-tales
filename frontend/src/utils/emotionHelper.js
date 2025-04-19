export const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'joy':
      case 'happy':
      case 'excitement':
        return '😄';
      case 'sadness':
      case 'sad':
        return '😢';
      case 'fear':
        return '😨';
      case 'anger':
        return '😠';
      case 'surprise':
        return '😲';
      case 'love':
        return '❤️';
      case 'admiration':
        return '😍';
      case 'curiosity':
        return '🤔';
      default:
        return '😊';
    }
  };
  