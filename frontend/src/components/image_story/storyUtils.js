/**
 * Utility functions for Story component
 */

export const downloadStoryAsPDF = async (storyRef, story) => {
    if (!storyRef.current || story.length === 0) return;
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      // Create the HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${story[0].title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            .images {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .image {
              width: 30%;
              text-align: center;
            }
            .image img {
              max-width: 100%;
              height: auto;
            }
            .content {
              margin-top: 20px;
            }
            .chapter {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              .images {
                page-break-inside: avoid;
              }
              .content {
                page-break-inside: auto;
              }
            }
          </style>
        </head>
        <body>
          <h1>${story[0].title}</h1>
          
          ${story.map((section, index) => `
            <div class="chapter">
              ${index > 0 ? `<h2>${section.title}</h2>` : ''}
              
              ${section.images && Object.keys(section.images).length > 0 ? `
                <div class="images">
                  ${Object.entries(section.images).map(([part, image]) => `
                    <div class="image">
                      <img src="data:image/jpeg;base64,${image}" alt="${part} of the story" />
                      <p>${part.charAt(0).toUpperCase() + part.slice(1)}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              <div class="content">
                ${section.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
              </div>
            </div>
          `).join('')}
        </body>
        </html>
      `;
      
      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for images to load
      setTimeout(() => {
        // Print the window
        printWindow.print();
        // Close the window after printing
        printWindow.close();
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  export const downloadImage = (part, sectionIndex, story) => {
    const section = story[sectionIndex];
    if (!section || !section.images || !section.images[part]) return;
    
    try {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${section.images[part]}`;
      link.download = `story_chapter${sectionIndex + 1}_${part}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };