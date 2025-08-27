export const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) {
    return 'no date inputted';
  }

  const date = new Date(dateInput);


  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',  
    month: '2-digit',  
    day: '2-digit', 
  });
};

export const capitalize = (str: string | null | undefined): string => {
  if (!str) {
    return ''; 
  }
  
 
  const firstLetter = str.charAt(0).toUpperCase();
  
  const restOfString = str.slice(1).toLowerCase();
  
  return firstLetter + restOfString;
}




