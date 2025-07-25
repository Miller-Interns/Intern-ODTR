<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>


<style>
/* General styling for the page background to make the card stand out */
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f0f2f5;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* The main container for the card */
.batchCard {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    max-width: 500px;
    width: 100%;
    overflow: hidden; /* Ensures child elements respect the border-radius */
    transition: box-shadow 0.3s ease-in-out;
}

.batchCard:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Header section of the card */
.card-header {
    background-color: #fafafa;
    padding: 16px 24px;
    border-bottom: 1px solid #e0e0e0;
}

/* Flex container for the title and button */
.batchNo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0; /* Resets default h3 margin */
    font-size: 1.25rem;
    color: #333;
}

/* The "View Details" button */
.view-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.view-button:hover {
    background-color: #0056b3;
}

/* The main body/content area of the card */
.card-body {
    padding: 24px;
}

/* Container for key details like intern count and start date */
.card-details {
    display: flex;
    justify-content: space-between;
    gap: 20px; /* Adds space between the detail items */
    margin-bottom: 20px;
}

.card-details h4 {
    margin: 0; /* Resets default h4 margin */
    font-size: 0.9rem;
    color: #666;
    font-weight: 400;
    display: flex;
    flex-direction: column; /* Stacks the label and value vertically */
    gap: 4px;
}

/* The bold value (e.g., the number or date) */
.card-details h4 strong {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
}

/* Styling for the content injected via the slot */
.slot-content {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.6;
}

.slot-content p {
    margin: 0;
}
</style>