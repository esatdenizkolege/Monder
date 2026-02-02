document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentView = 'sponsors'; // sponsors, doctors, details
    let selectedSponsor = null;
    let selectedDoctor = null;

    // DOM Elements
    const backBtn = document.getElementById('back-btn');
    const pageTitle = document.getElementById('page-title');
    const mainContent = document.getElementById('main-content');
    const loadingEl = document.getElementById('loading');
    const listView = document.getElementById('list-view');
    const detailView = document.getElementById('detail-view');

    // Initialize
    init();

    function init() {
        if (typeof window.transferData === 'undefined') {
            loadingEl.textContent = 'Veri yüklenemedi!';
            return;
        }
        loadingEl.classList.add('hidden');
        renderSponsors();
    }

    // Navigation Logic
    backBtn.addEventListener('click', () => {
        if (currentView === 'details') {
            showDoctors(selectedSponsor);
        } else if (currentView === 'doctors') {
            showSponsors();
        }
    });

    // Render Functions
    function showSponsors() {
        currentView = 'sponsors';
        selectedSponsor = null;
        selectedDoctor = null;

        pageTitle.textContent = 'Sponsorlar';
        backBtn.classList.add('hidden');
        pageTitle.style.marginRight = '24px'; // Balance

        listView.classList.remove('hidden');
        detailView.classList.add('hidden');

        renderSponsors();
    }

    function showDoctors(sponsorData) {
        currentView = 'doctors';
        selectedSponsor = sponsorData;

        pageTitle.textContent = sponsorData.sponsor;
        backBtn.classList.remove('hidden');
        pageTitle.style.marginRight = '0';

        listView.classList.remove('hidden');
        detailView.classList.add('hidden');

        renderDoctors(sponsorData.doctors);
    }

    function showDetails(doctor) {
        currentView = 'details';
        selectedDoctor = doctor;

        pageTitle.textContent = 'Detaylar';
        backBtn.classList.remove('hidden');
        pageTitle.style.marginRight = '0';

        listView.classList.add('hidden');
        detailView.classList.remove('hidden');

        renderDetails(doctor);
    }

    // List Builders
    function renderSponsors() {
        listView.innerHTML = '';
        const data = window.transferData || [];

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div>
                    <div class="list-item-title">${item.sponsor}</div>
                    <div class="list-item-subtitle">${item.doctors.length} Katılımcı</div>
                </div>
                <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            `;
            li.addEventListener('click', () => showDoctors(item));
            listView.appendChild(li);
        });
    }

    function renderDoctors(doctors) {
        listView.innerHTML = '';

        doctors.forEach(doc => {
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                <div>
                    <div class="list-item-title">${doc.name}</div>
                    <div class="list-item-subtitle">${doc.city || ''}</div>
                </div>
                <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            `;
            li.addEventListener('click', () => showDetails(doc));
            listView.appendChild(li);
        });
    }

    function renderDetails(doc) {
        const initials = doc.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

        let html = `
            <div class="detail-card">
                <div class="doctor-avatar">${initials}</div>
                <div class="doctor-name">${doc.name}</div>
                <div class="doctor-city">${doc.city || '-'}</div>
                
                <div class="info-grid">
        `;

        // Helper to add info item
        const addInfo = (label, value, icon) => {
            if (!value) return;
            html += `
                <div class="info-item">
                    <div class="info-label">${label}</div>
                    <div class="info-value">${value}</div>
                </div>
            `;
        };

        if (doc.arrival_date || doc.arrival_time) {
            html += `
                <div class="info-item">
                    <div class="info-label">Geliş</div>
                    <div class="info-value">
                        ${doc.arrival_date || ''} <br>
                        <span style="font-size: 1.2em; color: var(--primary-color)">${doc.arrival_time || ''}</span>
                    </div>
                </div>
            `;
        }

        if (doc.departure_date || doc.departure_time) {
            html += `
                <div class="info-item">
                    <div class="info-label">Gidiş</div>
                    <div class="info-value">
                        ${doc.departure_date || ''} <br>
                        <span style="font-size: 1.2em; color: var(--primary-color)">${doc.departure_time || ''}</span>
                    </div>
                </div>
            `;
        }

        html += `</div>`; // Close grid

        if (doc.notes) {
            html += `<div class="note-box"><strong>Not:</strong> ${doc.notes}</div>`;
        }

        html += `</div>`; // Close card
        detailView.innerHTML = html;
    }
});
