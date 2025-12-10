const API_URL = '/api'; // Relative path since frontend is served by same origin

// Helper to get ID from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// POST Need
async function submitNeed(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const response = await fetch(`${API_URL}/needs/create`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Need posted successfully!');
            window.location.href = 'browse-needs.html';
        } else {
            const data = await response.json();
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Need';
    }
}

// FETCH Needs & Render
async function fetchNeeds() {
    const container = document.getElementById('needs-container');
    const cityFilter = document.getElementById('filter-city').value;
    const categoryFilter = document.getElementById('filter-category').value;

    let url = `${API_URL}/needs?`;
    if (cityFilter) url += `city=${encodeURIComponent(cityFilter)}&`;
    if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;

    try {
        const response = await fetch(url);
        const needs = await response.json();

        container.innerHTML = '';

        if (needs.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full">No needs found matching your criteria.</p>';
            return;
        }

        needs.forEach(need => {
            const card = document.createElement('div');
            card.className = 'card need-card';

            const imageHtml = need.imageUrl
                ? `<img src="${need.imageUrl}" alt="${need.title}">`
                : `<div style="height:200px; background:#f3f4f6; border-radius:8px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; color:#9ca3af;">No Image</div>`;

            card.innerHTML = `
                ${imageHtml}
                <span class="tag">${need.category}</span>
                <h3>${need.title}</h3>
                <p><strong>📍 ${need.city}</strong></p>
                <p>${need.description.substring(0, 100)}...</p>
                <a href="need-detail.html?id=${need._id}" class="btn mt-4" style="width:100%; text-align:center;">View Details</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching needs:', error);
        container.innerHTML = '<p>Error loading needs.</p>';
    }
}

// FETCH Single Need Details
async function loadNeedDetails() {
    const needId = getQueryParam('id');
    if (!needId) return;

    try {
        const response = await fetch(`${API_URL}/needs/${needId}`);
        const need = await response.json();

        if (response.status === 404) {
            document.getElementById('need-details').innerHTML = '<p>Need not found.</p>';
            return;
        }

        const imageHtml = need.imageUrl
            ? `<img src="${need.imageUrl}" alt="${need.title}" style="max-height:400px; width:100%; object-fit:cover; border-radius:12px; margin-bottom:2rem;">`
            : '';

        document.getElementById('need-content').innerHTML = `
            ${imageHtml}
            <span class="tag">${need.category}</span>
            <span class="tag" style="background:#d1fae5; color:#065f46;">Status: Open</span>
            <h1>${need.title}</h1>
            <p class="text-lg"><strong>📍 ${need.city}</strong> | Posted by: ${need.ngoName}</p>
            <div class="card" style="margin-top:2rem; background:#f9fafb;">
                <h3>Description</h3>
                <p>${need.description}</p>
            </div>
        `;

        document.getElementById('ngo-name-placeholder').textContent = need.ngoName;

    } catch (error) {
        console.error('Error:', error);
    }
}

// SUBMIT Offer
async function submitOffer(event) {
    event.preventDefault();
    const needId = getQueryParam('id');
    if (!needId) return;

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Convert FormData to JSON
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_URL}/needs/${needId}/offer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Your offer has been sent to the NGO!');
            form.reset();
            // Scroll to top or show success message nicer?
        } else {
            alert('Failed to send offer.');
        }
    } catch (error) {
        console.error(error);
        alert('Error submitting offer.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'I want to fulfil this need';
    }
}

// NGO VIEW OFFERS
async function viewOffers(event) {
    event.preventDefault();
    const needId = getQueryParam('id');
    const email = document.getElementById('ngo-email-check').value;
    const resultsContainer = document.getElementById('offers-list');

    try {
        const response = await fetch(`${API_URL}/needs/${needId}/view-offers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ngoEmail: email })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>No offers yet.</p>';
                return;
            }
            resultsContainer.innerHTML = data.map(offer => `
                <div class="card" style="margin-bottom:1rem; border-left: 4px solid var(--secondary);">
                    <h4>${offer.donatorName}</h4>
                    <p>📧 ${offer.donatorEmail} | 📞 ${offer.donatorPhone}</p>
                    <p style="margin-top:0.5rem; color:#374151;">"${offer.message}"</p>
                    <small style="color:#9ca3af;">${new Date(offer.createdAt).toLocaleString()}</small>
                </div>
            `).join('');
            resultsContainer.classList.remove('hidden');
        } else {
            alert(data.error || 'Access Denied');
            resultsContainer.innerHTML = '';
        }
    } catch (error) {
        console.error(error);
        alert('Error checking offers');
    }
}
