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