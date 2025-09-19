let allListings = [];
let currentListings = [];

// Function to load the listings from JSON file
function loadListings() {
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("errorMessage").style.display = "none";

  fetch("./airbnb_sf_listings_500.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load data");
      }
      return response.json();
    })
    .then(function (data) {
      allListings = data.slice(0, 50);
      currentListings = allListings;
      document.getElementById("listingCount").textContent = allListings.length;
      displayListings();
      document.getElementById("loadingSpinner").style.display = "none";
    })
    .catch(function (error) {
      console.log("Error loading data:", error);
      document.getElementById("loadingSpinner").style.display = "none";
      document.getElementById("errorMessage").style.display = "block";
    });
}

// Function to display listings on the page
function displayListings() {
  let listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "";

  if (currentListings.length === 0) {
    document.getElementById("noResults").style.display = "block";
    return;
  } else {
    document.getElementById("noResults").style.display = "none";
  }

  for (let i = 0; i < currentListings.length; i++) {
    let listing = currentListings[i];
    let card = createListingCard(listing);
    listingsContainer.appendChild(card);
  }
}

// Function to create a single listing card
function createListingCard(listing) {
  let card = document.createElement("article");
  card.className = "listing-card";

  let name = listing.name || "Listing";
  if (name.includes("·")) {
    name = name.split("·")[0].trim();
  }

  let neighborhood = listing.neighbourhood_cleansed || "San Francisco";
  let hostName = listing.host_name || "Host";
  let price = getPrice(listing.price);
  let rating = listing.review_scores_rating || 0;
  let reviews = listing.number_of_reviews || 0;
  let isSuperhost = listing.host_is_superhost === "t";

  let imageUrl =
    listing.picture_url ||
    "https://picsum.photos/seed/" + listing.id + "/400/300";
  let imageAlt = listing.picture_url
    ? name + " - " + neighborhood + " listing"
    : "Placeholder image for " +
      name +
      " listing (original image not available)";

  let hostImageUrl =
    listing.host_picture_url ||
    listing.host_thumbnail_url ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(hostName) +
      "&background=3498db&color=fff&size=80";
  let hostImageAlt =
    listing.host_picture_url || listing.host_thumbnail_url
      ? "Photo of host " + hostName
      : "Generated avatar for host " +
        hostName +
        " (original photo not available)";

  let description = "";
  if (listing.description) {
    description = listing.description
      .replace(/<br>/g, " ")
      .replace(/<[^>]*>/g, "");
    if (description.length > 200) {
      description = description.substring(0, 200) + "...";
    }
  }

  let details = [];
  if (listing.bedrooms) details.push(listing.bedrooms + " BR");
  if (listing.beds) details.push(listing.beds + " Beds");
  if (listing.bathrooms_text) details.push(listing.bathrooms_text);
  let roomDetails = details.join(" · ");

  let stars = "";
  if (rating > 0) {
    let fullStars = Math.floor(rating);
    for (let j = 0; j < 5; j++) {
      if (j < fullStars) {
        stars += "★";
      } else {
        stars += "☆";
      }
    }
  }

  let amenitiesHtml = "";
  if (listing.amenities) {
    try {
      let amenities = JSON.parse(listing.amenities);
      for (let k = 0; k < Math.min(amenities.length, 6); k++) {
        amenitiesHtml +=
          '<span class="amenity-badge">' + amenities[k] + "</span>";
      }
      if (amenities.length > 6) {
        amenitiesHtml +=
          '<span class="amenity-badge">+' +
          (amenities.length - 6) +
          " more</span>";
      }
    } catch (e) {
      amenitiesHtml = '<span class="amenity-badge">Various amenities</span>';
    }
  }

  let hostSince = "Verified Host";
  if (listing.host_since) {
    let year = new Date(listing.host_since).getFullYear();
    hostSince = "Since " + year;
  }

  card.innerHTML = `
        <div class="card-image-container">
            <img src="${imageUrl}" alt="${imageAlt}" class="card-image" onerror="this.src='https://picsum.photos/seed/${
    listing.id
  }/400/300'; this.alt='Placeholder image (original not available)';">
            ${
              isSuperhost
                ? '<span class="superhost-badge">⭐ Superhost</span>'
                : ""
            }
            <span class="price-badge">$${price.toFixed(0)}/night</span>
        </div>
        
        <div class="card-body">
            <h3 class="card-title">${name}</h3>
            
            <p class="card-location">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                </svg>
                ${neighborhood} ${roomDetails ? "· " + roomDetails : ""}
            </p>
            
            <p class="card-description">${description}</p>
            
            <div class="amenities-container">
                ${amenitiesHtml}
            </div>
            
            <div class="host-section">
                <img src="${hostImageUrl}" alt="${hostImageAlt}" class="host-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
    hostName
  )}&background=4a90e2&color=fff&size=80'; this.alt='Generated avatar for ${hostName}';">
                <div class="host-info">
                    <div class="host-name">${hostName}</div>
                    <div class="host-since">${hostSince}</div>
                </div>
            </div>
            
            <div class="rating-section">
                <div>
                    ${
                      stars
                        ? '<span class="rating-stars">' + stars + "</span>"
                        : ""
                    }
                    <span class="rating-text">
                        ${
                          rating > 0
                            ? rating.toFixed(2) + " (" + reviews + ")"
                            : "New"
                        }
                    </span>
                </div>
                <a href="${
                  listing.listing_url || "#"
                }" target="_blank" class="btn btn-primary">
                    View
                </a>
            </div>
        </div>
    `;

  return card;
}

// Helper function to get price as number
function getPrice(priceString) {
  if (!priceString) return 0;
  let cleanPrice = priceString.replace(/[$,]/g, "");
  return parseFloat(cleanPrice) || 0;
}

// Function to apply search and filters
function applyFilters() {
  let searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let priceSort = document.getElementById("priceSort").value;
  let roomType = document.getElementById("roomFilter").value;

  currentListings = allListings.slice(); // make a copy
  if (searchTerm) {
    currentListings = currentListings.filter(function (listing) {
      let searchText =
        (listing.name || "") + " " + (listing.neighbourhood_cleansed || "");
      return searchText.toLowerCase().includes(searchTerm);
    });
  }

  if (roomType) {
    currentListings = currentListings.filter(function (listing) {
      return listing.room_type === roomType;
    });
  }

  if (priceSort) {
    currentListings.sort(function (a, b) {
      let priceA = getPrice(a.price);
      let priceB = getPrice(b.price);

      if (priceSort === "asc") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  }

  displayListings();
}

// Function to reset all filters
function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("priceSort").value = "";
  document.getElementById("roomFilter").value = "";

  currentListings = allListings;
  displayListings();
}

// Set up event listeners when page loads
function setupEventListeners() {
  document.getElementById("searchInput").addEventListener("input", function () {
    setTimeout(applyFilters, 300);
  });

  document.getElementById("priceSort").addEventListener("change", applyFilters);
  document
    .getElementById("roomFilter")
    .addEventListener("change", applyFilters);

  document
    .getElementById("resetFilters")
    .addEventListener("click", resetFilters);
}

// Start everything when page is loaded
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  loadListings();
});
