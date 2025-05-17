function getDirectoryElement() {
  return document.getElementById("directory");
}

// Display loading state
function showLoading() {
  const directoryElement = getDirectoryElement();
  if (directoryElement) {
    directoryElement.innerHTML = '<p class="loading">Loading directory data...</p>';
  }
}

// Display error message
function showError(message) {
  const directoryElement = getDirectoryElement();
  if (directoryElement) {
    directoryElement.innerHTML = `<p class="error">Error: ${message}</p>`;
    console.error("Error:", message);
  }
}

// Get membership level text based on numerical value
function getMembershipLevel(level) {
  switch (level) {
    case 3:
      return "Gold Member";
    case 2:
      return "Silver Member";
    case 1:
      return "Bronze Member";
    default:
      return "Member";
  }
}

// Fetch and process member data using async/await
async function fetchMembers() {
  try {
    showLoading();
    console.log("Fetching members data...");
    
    // Try multiple paths to find the JSON file
    let response;
    const possiblePaths = [
      "data/members.json",
      "members.json",
      "../members.json",
      "./data/members.json",
      "./members.json"
    ];
    
    let fetchSuccessful = false;
    
    for (const path of possiblePaths) {
      try {
        console.log(`Trying to fetch from: ${path}`);
        response = await fetch(path);
        
        if (response.ok) {
          console.log(`Successfully loaded from: ${path}`);
          fetchSuccessful = true;
          break;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${path}: ${err.message}`);
      }
    }
    
    if (!fetchSuccessful) {
      throw new Error("Could not find members.json file in any location");
    }
    
    // Parse JSON data
    const data = await response.json();
    console.log("Data loaded:", data.length, "members");
    
    // Display the members
    displayMembers(data);
    
  } catch (error) {
    showError(`Failed to load member data: ${error.message}`);
    console.error("Error fetching member data:", error);
  }
}

// Display members in the directory
function displayMembers(members) {
  // Get the directory element
  const directoryElement = getDirectoryElement();
  
  // Check if directory element exists
  if (!directoryElement) {
    console.error("Directory element not found!");
    return;
  }
  
  // Clear the directory
  directoryElement.innerHTML = "";
  console.log("Cleared directory, preparing to display members");
  
  // Sort members by name
  members.sort((a, b) => a.name.localeCompare(b.name));
  
  // Display each member
  members.forEach(member => {
    console.log("Creating card for:", member.name);
    
    // Create a section element for the member
    const card = document.createElement("section");
    
    // Create the inner HTML with proper structure
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy" 
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'150\\' viewBox=\\'0 0 200 150\\'%3E%3Crect width=\\'200\\' height=\\'150\\' fill=\\'%23cccccc\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%23333333\\'%3EImage Placeholder%3C/text%3E%3C/svg%3E'; this.onerror=null;">
      <div class="card-content">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <p class="membership">${getMembershipLevel(member.membership)}</p>
        <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
      </div>
    `;
    
    // Add the card to the directory
    directoryElement.appendChild(card);
    console.log("Added card for:", member.name);
  });
  
  console.log(`Successfully displayed ${members.length} members`);
}

// Initialize the directory
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing members directory");
  // Add a small delay to ensure script.js has run first
  setTimeout(fetchMembers, 100);
});